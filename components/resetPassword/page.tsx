"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

type Inputs = {
  password: string;
};

export default function ResetPassword(
  props: Readonly<{ verificationId: string }>
) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        verificationId: props.verificationId,
        password: data.password,
      }),
    });
    setLoading(false);
    if (!res?.ok) {
      setError(true);
      const response = await res?.json();
      toast({
        title: response.error,
        variant: "destructive",
      });
    } else {
      setError(false);
      reset();
      router.push("/login");
    }
  };

  return (
    <div className="flex flex-col w-full my-[10%] items-center justify-center">
      <div className="text-3xl font-bold">重設密碼</div>
      <form
        className="flex flex-col gap-1 w-[90%] md:w-96 mb-4 [&>button]:w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label htmlFor="email">新密碼</label>
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
        <Button className="mt-4" loading={loading} type="submit">
          送出
        </Button>
        {error && (
          <div className="text-red-500 text-sm">Something went wrong</div>
        )}
      </form>
    </div>
  );
}
