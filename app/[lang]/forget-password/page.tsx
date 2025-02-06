"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

type Inputs = {
  email: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const { toast } = useToast();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    const res = await fetch("/api/forget-password", {
      method: "POST",
      body: JSON.stringify({
        email: data.email,
      }),
    });
    setLoading(false);
    if (!res?.ok) {
      setError(true);
    } else {
      reset();
      toast({
        title: "Please check email to confirm the action",
      })
    }
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
        <label htmlFor="email">電郵地址</label>
        <Input
          id="email"
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
        <Button
          className="mt-4"
          loading={loading}
          variant={"default"}
          type="submit"
        >
          確認
        </Button>
        {error && <div className="text-red-500">Something went wrong.</div>}
      </form>
    </div>
  );
}
