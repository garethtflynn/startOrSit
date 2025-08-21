"use client";

import React from "react";
import Link from "next/link";

import { Suspense } from "react";

import SignInForm from "./form";

function page(props) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white">
      <Suspense>
        <SignInForm />
      </Suspense>
      <p className="pt-2 text-black">
        don`t have an account?{" "}
        <Link
          className="decoration-slate-500/50 hover:underline decoration-2 duration-500"
          href="/auth/sign-up"
        >
          sign up.
        </Link>
      </p>
    </div>
  );
}

export default page;
