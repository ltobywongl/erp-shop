"use client";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";

function EnquiryForm({ userId }: Readonly<{ userId?: string }>) {
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => [key, String(value)])
    );
    if (userId) data["userId"] = userId;
    const res = await fetch("/api/enquiry", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (res.ok) {
      message.info("已發出");
      router.refresh();
    } else {
      message.error("發生錯誤");
    }
  }

  return (
    <form
      className="flex flex-col gap-2 [&>*]:border [&>*]:rounded [&>*]:px-3 [&>*]:py-1"
      onSubmit={(e) => handleSubmit(e)}
    >
      <input type="email" id="email" name="email" placeholder="請輸入您的信箱" />
      <textarea name="content" id="content" />
      <button type="submit">提交</button>
    </form>
  );
}

export default EnquiryForm;
