import MBarcode from "@/components/common/barcode";
import { loadSessionUser } from "@/utils/user";
import { redirect } from "next/navigation";

export default async function Login() {
  const user = await loadSessionUser();
  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="flex w-full h-[60%] items-center justify-center">
      <div className="flex flex-col rounded-md w-[90%] md:w-96 p-6 bg-red-500 border border-solid">
        <div className="text-xl text-orange-50 font-bold uppercase">
          {user.name}
        </div>
        <div className="text-xs text-center">
          <MBarcode content={user.id} />
          {user.id}
        </div>
      </div>
    </div>
  );
}
