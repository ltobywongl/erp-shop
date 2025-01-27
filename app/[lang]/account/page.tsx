import {
  WalletOutlined,
  KeyOutlined,
  ScheduleOutlined,
  FieldTimeOutlined,
  IdcardOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { redirect } from "next/navigation";
import { loadUser } from "@/utils/user";
import { signOut } from "next-auth/react";
import SignOutButton from "@/components/common/signOutButton";

async function Page() {
  const user = await loadUser();
  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="flex justify-center py-2">
      <div className="w-full md:w-4/5">
        <h1 className="text-xl font-bold">賬號設置</h1>
        <hr />
        <div>
          <Link
            className="flex items-center justify-center gap-2 w-full border-b p-2 hover:bg-slate-50 text-center"
            href="/order-history"
          >
            <FieldTimeOutlined style={{ color: "black" }} />
            <div>歷史訂單</div>
          </Link>
          <Link
            className="flex items-center justify-center gap-2 w-full border-b p-2 hover:bg-slate-50 text-center"
            href="/coupons"
          >
            <ScheduleOutlined style={{ color: "black" }} />
            <div>優惠卷</div>
          </Link>
          <Link
            className="flex items-center justify-center gap-2 w-full border-b p-2 hover:bg-slate-50 text-center"
            href="/change-password"
          >
            <KeyOutlined style={{ color: "black" }} />
            <div>更改密碼</div>
          </Link>
          <SignOutButton
            className="flex items-center justify-center gap-2 w-full border-b p-2 hover:bg-slate-50 text-center"
          >
            <UserOutlined style={{ color: "black" }} />
            <div>登出</div>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}

export default Page;
