"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "antd";
import { FacebookOutlined, GoogleOutlined } from "@ant-design/icons";

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
    // setLoading(true);
    // const res = await signIn("credentials", {
    //   email: data.email,
    //   password: data.password,
    //   redirect: false,
    //   callbackUrl: "/",
    // });
    // setLoading(false);
    // if (res?.error) {
    //   setError(true);
    // } else {
    //   if (res?.url) {
    //     await router.push(res.url);
    //     router.refresh();
    //   }
    // }
  };

  return (
    <div className="flex flex-col w-full h-[60%] items-center justify-center">
      <div className="text-lg">重設密碼</div>
      <form
        className="flex flex-col rounded-md w-[90%] md:w-96 p-6 bg-zinc-100 border border-solid"
        method="post"
        action="/api/auth/callback/credentials"
        onSubmit={handleSubmit(onSubmit)}
      >
        電郵地址
        <input
          type="email"
          className="mb-1 p-1 rounded-sm border border-solid"
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
        新密碼
        <input
          className="p-1 rounded-sm border border-solid"
          type="password"
          {...register("password", {
            required: true,
          })}
        />
        {errors.password && (
          <div className="text-red-500 text-sm">{errors.password.message}</div>
        )}
        <Button
          className="mt-4"
          loading={loading}
          type="primary"
          htmlType="submit"
        >
          確認
        </Button>
        <div className="text-sm text-gray-800 mt-1">
          (請查看信箱並批准更改密碼要求)
        </div>
        {error && <div className="text-red-500">Something went wrong.</div>}
      </form>
    </div>
  );
}
