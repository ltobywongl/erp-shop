import { WalletOutlined, KeyOutlined, ScheduleOutlined, FieldTimeOutlined } from "@ant-design/icons";
import Link from "next/link";
import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/login");
  }
  const user = await prisma.user.findUnique({
    select: {
      balance: true,
    },
    where: {
      id: session.user.id,
    },
  });
  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="flex justify-center py-2">
      <div className="w-full md:w-4/5">
        <h1 className="text-xl font-bold">賬號設置</h1>
        <div>餘額: ${user.balance}</div>
        <hr />
        <div>
          <Link
            className="flex justify-center gap-2 w-full border-b p-2 hover:bg-slate-50 text-center"
            href="/order-history"
          >
            <FieldTimeOutlined style={{ color: "black" }} />
            <div>歷史訂單</div>
          </Link>
          <Link
            className="flex justify-center gap-2 w-full border-b p-2 hover:bg-slate-50 text-center"
            href="/coupons"
          >
            <ScheduleOutlined style={{ color: "black" }} />
            <div>優惠卷</div>
          </Link>
          <Link
            className="flex justify-center gap-2 w-full border-b p-2 hover:bg-slate-50 text-center"
            href="/top-up"
          >
            <WalletOutlined style={{ color: "black" }} />
            <div>充值</div>
          </Link>
          <Link
            className="flex justify-center gap-2 w-full border-b p-2 hover:bg-slate-50 text-center"
            href="/change-password"
          >
            <KeyOutlined style={{ color: "black" }} />
            <div>更改密碼</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Page;
