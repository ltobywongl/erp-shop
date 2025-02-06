"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

type Inputs = {
  email: string;
  password: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const { toast } = useToast();

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
      reset();
      toast({
        title: "Please check email to confirm the action",
      });
    }
  };

  return (
    <div className="flex flex-col w-full my-[10%] items-center justify-center">
      <form
        className="flex flex-col gap-1 w-[90%] md:w-96 mb-4 [&>button]:w-full"
        method="post"
        action="/api/auth/callback/credentials"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label htmlFor="email">電郵地址</label>
        <Input
          id="email"
          type="email"
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
        <label htmlFor="email">密碼</label>
        <Input
          id="password"
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
          type="submit"
        >
          註冊
        </Button>
        {error && <div className="text-red-500 text-sm">Register Failed</div>}
        {error && <div className="text-red-500 text-sm">{message}</div>}
      </form>
    </div>
  );
}
