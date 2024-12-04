"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "antd";

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
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });
    setLoading(false);
    if (!res?.ok) {
      const response = await res?.json();
      setMessage(response.message);
      setError(true);
    } else {
      await router.push("/login");
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
        電郵地址
        <input
          type="email"
          className="mb-1 p-1 rounded-sm border border-solid"
          {...register("email", {
            required: true,
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please input an email",
            },
          })}
        />
        {errors.email && (
          <div className="text-red-500 text-sm">{errors.email.message}</div>
        )}
        密碼
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
          註冊
        </Button>
        {error && <div className="text-red-500 text-sm">Register Failed</div>}
        {error && <div className="text-red-500 text-sm">{message}</div>}
      </form>
    </div>
  );
}
