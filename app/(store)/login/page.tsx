import type { Metadata } from "next";
import { LoginCard } from "@/components/account/auth-card";
export const metadata:Metadata={title:"تسجيل الدخول",robots:{index:false,follow:false}};
export default function LoginPage(){return <LoginCard/>}
