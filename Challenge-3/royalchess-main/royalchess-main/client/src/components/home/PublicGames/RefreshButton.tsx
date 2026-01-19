"use client";

import { IconRefresh } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function RefreshButton() {
  const router = useRouter();
  const [isLoading, startTransition] = useTransition();

  function handleRefresh() {
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <button
      aria-label="Refresh public games"
      className={
        "btn btn-sm btn-circle btn-ghost hover:btn-primary transition-all duration-300 hover:rotate-180 hover:scale-110" +
        (isLoading ? " loading animate-spin" : "")
      }
      onClick={handleRefresh}
    >
      {!isLoading && <IconRefresh size={20} className="transition-transform duration-300" />}
    </button>
  );
}
