import EnquiryForm from "@/components/enquiries/form";
import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";

async function Page() {
  const session = await getServerSession(authOptions);

  const about = await prisma.websiteContent.findMany({
    select: {
      key: true,
      content: true,
    },
    where: {
      key: {
        in: ["about-us", "address", "email", "tel", "terms"],
      },
    },
  });

  return (
    <div className="py-2 flex justify-center">
      <div className="flex flex-col gap-8 w-4/5">
        <div>
          <div className="text-lg font-bold">關於我們</div>
          <pre>{about.find((c) => c.key === "about-us")?.content}</pre>
        </div>
        <div>
          <div className="text-lg font-bold">聯絡我們</div>
          <div>電郵: {about.find((c) => c.key === "email")?.content}</div>
          <div>聯絡地址: {about.find((c) => c.key === "address")?.content}</div>
          <div>聯絡電話: {about.find((c) => c.key === "tel")?.content}</div>
          <hr className="my-1" />
          <div>或在此提交查詢:</div>
          <EnquiryForm userId={session?.user.id} />
        </div>
        <div>
          <div className="text-lg font-bold">條款及細則</div>
          <pre>{about.find((c) => c.key === "terms")?.content}</pre>
        </div>
      </div>
    </div>
  );
}

export default Page;
