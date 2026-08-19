import { NextResponse } from "next/server";
import { getProducts } from "@/lib/data";
export async function GET(request:Request){const{searchParams}=new URL(request.url);const q=(searchParams.get("q")||"").trim().slice(0,80);if(q.length<2)return NextResponse.json({products:[]});const products=await getProducts({search:q});return NextResponse.json({products:products.slice(0,12)},{headers:{"Cache-Control":"public, s-maxage=30, stale-while-revalidate=120"}});}
