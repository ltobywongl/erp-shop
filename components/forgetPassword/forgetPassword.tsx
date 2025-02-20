"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/i18n/client";

type Inputs = {
  email: string;
};

export default function ForgetPassword(props: { lang: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>();
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { t } = useTranslation(props.lang, "account");

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    const res = await fetch("/api/auth/forget-password", {
      method: "POST",
      body: JSON.stringify({
        email: data.email,
      }),
    });
    setLoading(false);
    const response = await res.json();
    if (!res?.ok) {
      toast({
        title: response.error,
        variant: "destructive",
      });
    } else {
      reset();
      toast({
        title: response.body,
      });
    }
  };

  return (
    <div className="flex flex-col w-full py-[10%] items-center justify-center bg-[#e5ebe5]">
      <div className="text-3xl font-bold">{t("resetPassword")}</div>
      <form
        className="flex flex-col gap-1 w-[90%] md:w-96"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label htmlFor="email">{t("email")}</label>
        <Input
          id="email"
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
        <Button
          className="mt-4"
          loading={loading}
          variant={"default"}
          type="submit"
        >
          {t("send")}
        </Button>
      </form>
    </div>
  );
}
