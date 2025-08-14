"use client";

import React from "react";
import Link from "next/link";

import { Suspense } from "react";

import SignUpForm from "./form";
function page(props) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <Suspense>
        <SignUpForm />
      </Suspense>
      <p className="pt-2">
        already have an account?{" "}
        <Link
          className="hover:text-[#4C4138] hover:underline decoration-2 duration-500"
          href="/sign-in"
        >
          sign in.
        </Link>
      </p>
    </div>
  );
}

export default page;
