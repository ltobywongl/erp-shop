import { RedirectType, redirect } from "next/navigation";
import TopUpForm from "@/components/top-up/form";
import { loadSessionUser } from "@/utils/user";

export default async function TopUp() {
  const user = await loadSessionUser();

  if (user) {
    return (
      <div className="p-4 md:p-8">
        <TopUpForm />
      </div>
    );
  } else {
    return redirect("/login", RedirectType.push);
  }
}
