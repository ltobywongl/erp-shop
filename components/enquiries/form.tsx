"use client";
import { useToast } from "@/hooks/use-toast";
import { FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function EnquiryForm({ userId }: Readonly<{ userId?: string }>) {
  const { toast } = useToast();

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
      toast({
        title: "已發出",
      });
      (document.getElementById("email") as HTMLInputElement).value = "";
      (document.getElementById("content") as HTMLInputElement).value = "";
    } else {
      toast({
        title: "發生錯誤",
        variant: "destructive",
      });
    }
  }

  return (
    <form
      className="flex flex-col gap-2 [&>*]:border [&>*]:rounded [&>*]:px-3 [&>*]:py-1"
      onSubmit={(e) => handleSubmit(e)}
    >
      <Input
        type="email"
        id="email"
        name="email"
        placeholder="請輸入您的信箱"
      />
      <textarea name="content" id="content" rows={4} />
      <Button type="submit">提交</Button>
    </form>
  );
}

export default EnquiryForm;
