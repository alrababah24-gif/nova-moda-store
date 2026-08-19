import { NextResponse } from "next/server";
import { hasStaffPermission } from "@/lib/auth";
import type { Profile, StaffPermissions, StaffRole } from "@/lib/types";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

async function authorize(){
  const supabase=await createClient();
  if(!supabase)return null;
  const{data:{user}}=await supabase.auth.getUser();
  if(!user)return null;
  const{data}=await supabase.from("profiles").select("id,email,role,permissions").eq("id",user.id).maybeSingle();
  const profile=data as Profile|null;
  if(!hasStaffPermission(profile,"staff"))return null;
  return{user,profile};
}

export async function POST(request:Request){
  const auth=await authorize();
  if(!auth)return NextResponse.json({error:"غير مصرح"},{status:403});
  const admin=createAdminClient();
  if(!admin)return NextResponse.json({error:"مفتاح Service Role غير مضاف بعد."},{status:503});
  const body=await request.json().catch(()=>({}));
  const email=String(body.email||"").trim().toLowerCase();
  const password=String(body.password||"");
  const fullName=String(body.fullName||"").trim();
  const role:StaffRole=body.role==="admin"?"admin":"editor";
  const permissions=(body.permissions||{}) as StaffPermissions;
  if(!email.includes("@")||password.length<8||!fullName)return NextResponse.json({error:"الاسم والبريد وكلمة مرور 8 خانات على الأقل مطلوبة."},{status:400});

  const{data,error}=await admin.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{full_name:fullName}});
  if(error||!data.user)return NextResponse.json({error:error?.message||"تعذر إنشاء المستخدم"},{status:400});
  const{error:profileError}=await admin.from("profiles").upsert({id:data.user.id,email,full_name:fullName,role,permissions},{onConflict:"id"});
  if(profileError)return NextResponse.json({error:profileError.message},{status:400});
  return NextResponse.json({ok:true,id:data.user.id});
}

export async function PATCH(request:Request){
  const auth=await authorize();
  if(!auth)return NextResponse.json({error:"غير مصرح"},{status:403});
  const admin=createAdminClient();
  if(!admin)return NextResponse.json({error:"مفتاح Service Role غير مضاف بعد."},{status:503});
  const body=await request.json().catch(()=>({}));
  const id=String(body.id||"");
  if(!id||id===auth.user.id)return NextResponse.json({error:"لا يمكن تعديل صلاحية حسابك الحالي من هنا."},{status:400});
  const allowedRoles:StaffRole[]=["customer","editor","admin"];
  const role=allowedRoles.includes(body.role)?body.role:"editor";
  const permissions=(body.permissions||{}) as StaffPermissions;
  const{error}=await admin.from("profiles").update({role,permissions}).eq("id",id).neq("role","owner");
  if(error)return NextResponse.json({error:error.message},{status:400});
  return NextResponse.json({ok:true});
}
