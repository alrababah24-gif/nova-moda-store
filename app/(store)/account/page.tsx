import type { Metadata } from "next";
import { AccountDashboard } from "@/components/account/account-dashboard";
export const metadata:Metadata={title:"حسابي",robots:{index:false,follow:false}};
export default function AccountPage(){return <AccountDashboard/>}
