"use client";

import React from "react";
import Link from "next/link";

import { Suspense } from "react";

import SignInForm from "./form";

function page(props) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <Suspense>
        <SignInForm />
      </Suspense>
      <p className="pt-2">
        don`t have an account?{" "}
        <Link
          className="text-[#D7CDBF] hover:text-[#4C4138] hover:underline decoration-2 duration-500"
          href="/sign-up"
        >
          sign up.
        </Link>
      </p>
    </div>
  );
}

export default page;
