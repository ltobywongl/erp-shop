"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/i18n/client";

type Inputs = {
  email: string;
  password: string;
  newPassword: string;
};

export default function ChangePassword(props: { lang: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const { t } = useTranslation(props.lang, "account");

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    const res = await fetch("/api/auth/change-password", {
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
      <div className="text-3xl font-bold">{t("changePassword")}</div>
      <form
        className="flex flex-col gap-1 w-[90%] md:w-96"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label htmlFor="email">{t("email")}</label>
        <Input
          type="email"
          id="email"
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

        <label htmlFor="password">{t("password")}</label>
        <Input
          type="password"
          id="password"
          {...register("password", {
            required: true,
          })}
        />
        {errors.password && (
          <div className="text-red-500 text-sm">{errors.password.message}</div>
        )}

        <label htmlFor="newPassword">{t("newPassword")}</label>
        <Input
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
          variant="default"
          type="submit"
        >
          {t("send")}
        </Button>
        {error && (
          <div className="text-red-500">{t("invalidEmailPassword")}</div>
        )}
      </form>
    </div>
  );
}
