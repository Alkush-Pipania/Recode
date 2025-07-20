"use client"
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <button onClick={async () => {
          const data = await authClient.signIn.social({
              provider: "github",
              callbackURL: "/dashboard"
          })
      }}>sign in with github</button>
    </div>
  );
}
