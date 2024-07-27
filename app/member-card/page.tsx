import MBarcode from "@/components/common/barcode";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Login() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/login");
  }

  return (
    <div className="flex w-full h-[60%] items-center justify-center">
      <div className="flex flex-col rounded-md w-[90%] md:w-96 p-6 bg-red-500 border border-solid">
        <div className="text-xl text-orange-50 font-bold uppercase">
          {session.user.name}
        </div>
        <div className="text-xs text-center">
          <MBarcode content={session.user.id} />
          {session.user.id}
        </div>
      </div>
    </div>
  );
}
