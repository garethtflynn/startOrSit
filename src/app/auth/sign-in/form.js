import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";

// import Alert from "@/components/common/Alert";

function SignInForm(props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/compare";
  const [error, setError] = useState("");
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signIn("credentials", {
        redirect: false,
        username,
        password,
        callbackUrl,
      });
      if (!res?.error) {
        router.push(callbackUrl);
      } else {
        setError(res?.error || "Invalid email or password");
      }
    } catch (error) {
      setError(error?.message);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit} className="flex flex-col gap-2 ">
        <input
          type="text"
          name="username"
          placeholder="username"
          autoComplete="off"
          onChange={(e) => setUsername(e.target.value)}
          className="border-4 border-black bg-transparent text-black px-2 py-1 my-1 rounded focus:within:bg-[#D7CDBF] outline-none placeholder-zinc-700"
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          autoComplete="off"
          onChange={(e) => setPassword(e.target.value)}
          className="border-4 border-black bg-transparent text-black px-2 py-1 rounded focus:within:bg-[#D7CDBF] outline-none placeholder-zinc-700"
        />
        {/* {error && <Alert>{error}</Alert>} */}
        <div className="flex gap-2 justify-center">
          <button
            type="submit"
            className="w-64 bg-black hover:opacity-80 text-white font-bold py-2 px-4 rounded-md duration-500"
          >
            sign in
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignInForm;
