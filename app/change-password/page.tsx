"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "antd";
import Link from "next/link";

type Inputs = {
  email: string;
  password: string;
  newPassword: string;
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
    const res = await fetch("/api/change-password", {
      method: "POST",
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        newPassword: data.newPassword,
      }),
    });
    setLoading(false);
    if (res?.ok) {
      router.push("/");
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex w-full h-[60%] items-center justify-center">
      <form
        className="flex flex-col rounded-md w-[90%] md:w-96 p-6 bg-zinc-100 border border-solid"
        method="post"
        action="/api/auth/callback/credentials"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label htmlFor="email">電郵地址</label>
        <input
          type="email"
          id="email"
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

        <label htmlFor="password">密碼</label>
        <input
          className="p-1 rounded-sm border border-solid"
          type="password"
          id="password"
          {...register("password", {
            required: true,
          })}
        />
        {errors.password && (
          <div className="text-red-500 text-sm">{errors.password.message}</div>
        )}

        <label htmlFor="newPassword">新密碼</label>
        <input
          className="p-1 rounded-sm border border-solid"
          type="newPassword"
          id="newPassword"
          {...register("newPassword", {
            required: true,
          })}
        />
        {errors.newPassword && (
          <div className="text-red-500 text-sm">
            {errors.newPassword.message}
          </div>
        )}
        <Button
          className="mt-4"
          loading={loading}
          type="primary"
          htmlType="submit"
        >
          更改密碼
        </Button>
        {error && <div className="text-red-500">發生錯誤</div>}
      </form>
    </div>
  );
}
