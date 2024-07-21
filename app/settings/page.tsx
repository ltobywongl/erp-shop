import { WalletOutlined, KeyOutlined } from "@ant-design/icons";
import Link from "next/link";

function Page() {
  return (
    <div>
      <h1 className="text-xl font-bold p-2">賬號設置</h1>
      <div className="flex justify-around">
        <Link
          className="w-full border-y p-2 hover:bg-slate-50 text-center"
          href="/top-up"
        >
          <WalletOutlined style={{ color: "black" }} />
          <div>充值</div>
        </Link>
        <Link
          className="w-full border-y p-2 hover:bg-slate-50 text-center"
          href="/change-password"
        >
          <KeyOutlined style={{ color: "black" }} />
          <div>更改密碼</div>
        </Link>
      </div>
    </div>
  );
}

export default Page;
