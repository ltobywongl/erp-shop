import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { RedirectType, redirect } from "next/navigation";
import TopUpForm from "@/components/top-up/form";

export default async function TopUp() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    return (
      <div className="p-4 md:p-8">
        <TopUpForm />
      </div>
    );
  } else {
    return redirect("/login", RedirectType.push);
  }
}
