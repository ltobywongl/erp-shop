"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Inputs = {
  username: string;
  password: string;
};

export default function Login() {
  const { register, handleSubmit } = useForm<Inputs>();
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const res = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
      callbackUrl: "/",
    });
    if (res?.error) {
      setError(true);
    } else {
      if (res?.url) {
        await router.push(res.url);
        router.refresh();
      }
    }
  };

  return (
    <div className="flex w-full h-[80%] items-center justify-center">
      <form
        className="flex flex-col rounded-md w-[90%] md:w-96 p-6 bg-zinc-100"
        method="post"
        action="/api/auth/callback/credentials"
        onSubmit={handleSubmit(onSubmit)}
      >
        帳號
        <input
          className="mb-1 p-1 rounded-sm"
          {...register("username", {
            required: true,
          })}
        />
        密碼
        <input
          className="p-1 rounded-sm"
          type="password"
          {...register("password", {
            required: true,
          })}
        />
        <button
          className="w-auto rounded-md bg-blue-500 text-white mt-4 p-1"
          type="submit"
        >
          登入
        </button>
        {error && <div className="warning">Invalid username/password</div>}
      </form>
    </div>
  );
}
