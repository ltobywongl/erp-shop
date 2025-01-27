"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "antd";

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
  const [error, setError] = useState<string>("");
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
      const response = await res.json();
      setError(response.error);
    }
  };

  return (
    <div className="flex flex-col w-full py-[10%] items-center justify-center bg-[#e5ebe5]">
      <form
        className="flex flex-col w-[90%] md:w-96"
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
          type="password"
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
        {error && <div className="text-red-500">錯誤的電郵地址/密碼</div>}
      </form>
    </div>
  );
}
