import EnquiryForm from "@/components/enquiries/form";
import prisma from "@/utils/prisma";
import { loadSessionUser } from "@/utils/user";

async function Page() {
  const user = await loadSessionUser();

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
    <div className="flex justify-center py-2 px-2 md:px-0">
      <div className="flex flex-col gap-8 w-4/5">
        <div>
          <div className="text-lg font-bold">關於我們</div>
          <pre className="whitespace-break-spaces">
            {about.find((c) => c.key === "about-us")?.content}
          </pre>
        </div>
        <hr className="my-2" />
        <div>
          <div className="text-lg font-bold">聯絡我們</div>
          <div>電郵: {about.find((c) => c.key === "email")?.content}</div>
          <div>聯絡地址: {about.find((c) => c.key === "address")?.content}</div>
          <div>聯絡電話: {about.find((c) => c.key === "tel")?.content}</div>
          <hr className="my-1" />
          <div>或在此提交查詢:</div>
          <EnquiryForm userId={user?.id} />
        </div>
        <hr className="my-2" />
        <div>
          <div className="text-lg font-bold">條款及細則</div>
          <pre className="whitespace-break-spaces">
            {about.find((c) => c.key === "terms")?.content}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default Page;
