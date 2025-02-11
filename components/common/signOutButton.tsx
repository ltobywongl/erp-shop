"use client";

import { signOut } from "next-auth/react";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

function SignOutButton(
  params: Readonly<{
    className: string;
    variant?:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link";
    children: ReactNode;
  }>
) {
  return (
    <Button
      className={params.className}
      onClick={() => signOut()}
      variant={params.variant}
    >
      {params.children}
    </Button>
  );
}

export default SignOutButton;
