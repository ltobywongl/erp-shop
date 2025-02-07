"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import GoogleIcon from "@/components/icons/google";

type Inputs = {
  email: string;
  password: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
      callbackUrl: "/",
    });
    setLoading(false);
    if (res?.error) {
      setError(true);
    } else if (res?.url) {
      setError(false);
      router.push(res.url);
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col w-full py-[10%] items-center justify-center bg-[#e5ebe5]">
      <div className="text-3xl font-bold">Login</div>
      <div className="mt-8 flex flex-col gap-2 w-[90%] md:w-96 mb-4 [&>button]:w-full">
        <Button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          variant={"secondary"}
        >
          Sign in with Google
          <GoogleIcon />
        </Button>
      </div>
      <form
        className="flex flex-col gap-1 w-[90%] md:w-96"
        method="post"
        action="/api/auth/callback/credentials"
        onSubmit={handleSubmit(onSubmit)}
      >
        <span>電郵地址</span>
        <Input
          type="email"
          {...register("email", {
            required: true,
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Entered value does not match email format",
            },
          })}
        />
        {errors.email && (
          <div className="text-red-500 text-sm">{errors.email.message}</div>
        )}
        <span>密碼</span>
        <Input
          type="password"
          {...register("password", {
            required: true,
          })}
        />
        {errors.password && (
          <div className="text-red-500 text-sm">{errors.password.message}</div>
        )}
        <div className="mt-1 flex justify-between">
          <Link href="/register" className="w-fit text-blue-800 underline">
            註冊
          </Link>
          <Link
            href="/forget-password"
            className="w-fit text-blue-800 underline"
          >
            忘記密碼
          </Link>
        </div>
        <Button
          className="mt-4"
          variant="default"
          loading={loading}
          type="submit"
        >
          送出
        </Button>
        {error && <div className="text-red-500">Invalid email/password</div>}
      </form>
    </div>
  );
}
