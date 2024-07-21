import EnquiryForm from "@/components/enquiries/form";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";

async function Page() {
  const session = await getServerSession(authOptions);

  return (
    <div className="py-2 flex justify-center">
      <div className="flex flex-col gap-2 w-4/5">
        <div>
          <div className="text-lg font-bold">聯絡我們</div>
          <div>Email: abc@example.com</div>
          <hr className="my-1" />
          <div>或在此提交查詢:</div>
          <EnquiryForm userId={session?.user.id} />
        </div>
        <hr className="my-1" />
        <div>
          <div className="text-lg font-bold">條款及細則</div>
          <ol className="list-decimal">
            <li>abc</li>
            <li>abc</li>
            <li>abc</li>
            <li>abc</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default Page;
