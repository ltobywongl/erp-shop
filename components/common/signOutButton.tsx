"use client";

import { signOut } from "next-auth/react";
import { RefAttributes } from "react";
import { Button, ButtonProps } from "@/components/ui/button";

function SignOutButton(params: ButtonProps & RefAttributes<HTMLButtonElement>) {
  return (
    <Button
      {...params}
      onClick={() => signOut()}
    >
      {params.children}
    </Button>
  );
}

export default SignOutButton;
