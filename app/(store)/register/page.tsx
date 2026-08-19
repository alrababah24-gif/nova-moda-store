import type { Metadata } from "next";
import { RegisterCard } from "@/components/account/auth-card";
export const metadata:Metadata={title:"إنشاء حساب",robots:{index:false,follow:false}};
export default function RegisterPage(){return <RegisterCard/>}
