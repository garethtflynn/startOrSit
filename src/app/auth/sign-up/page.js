"use client";

import React from "react";
import Link from "next/link";

import { Suspense } from "react";

import SignUpForm from "./form";
function page(props) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white">
      <Suspense>
        <SignUpForm />
      </Suspense>
      <p className="pt-2 text-black">
        already have an account?{" "}
        <Link
          className="decoration-slate-500/50 hover:underline decoration-2 duration-500"
          href="/auth/sign-in"
        >
          sign in.
        </Link>
      </p>
    </div>
  );
}

export default page;
