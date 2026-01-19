"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function JoinButton({ code }: { code: string }) {
  const router = useRouter();
  const [isLoading, startTransition] = useTransition();

  function handleJoin() {
    startTransition(() => {
      router.push(`/${code}`);
    });
  }

  return (
    <button
      className={
        "btn btn-sm btn-primary shadow-md hover:shadow-royal transition-all duration-300 hover:scale-105" +
        (isLoading ? " loading" : "")
      }
      onClick={handleJoin}
    >
      {!isLoading && "Join Game"}
    </button>
  );
}
