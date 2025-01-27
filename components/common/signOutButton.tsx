"use client"

import { signOut } from "next-auth/react";
import { ReactNode } from "react";

function SignOutButton(params: Readonly<{ className: string, children: ReactNode }>) {
    return (
        <button className={params.className} onClick={() => signOut()}>{params.children}</button>
    );
}

export default SignOutButton;
