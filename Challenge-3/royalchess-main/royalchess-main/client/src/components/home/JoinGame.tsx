"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useContext, useState } from "react";

import { SessionContext } from "@/context/session";
import { fetchActiveGame } from "@/lib/game";

export default function JoinGame() {
  const session = useContext(SessionContext);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const router = useRouter();

  async function submitJoinGame(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!session?.user?.id) return;

    const target = e.target as HTMLFormElement;
    const codeEl = target.elements.namedItem("joinGameCode") as HTMLInputElement;

    let code = codeEl.value;
    if (!code) return;

    setButtonLoading(true);

    if (code.startsWith("ches.su")) {
      code = "http://" + code;
    }
    if (code.startsWith("http")) {
      code = new URL(code).pathname.split("/")[1];
    }

    const game = await fetchActiveGame(code);

    if (game && game.code) {
      router.push(`/${game.code}`);
    } else {
      setButtonLoading(false);
      setNotFound(true);
      setTimeout(() => setNotFound(false), 5000);
      codeEl.value = "";
    }
  }

  return (
    <div className="space-y-4">
      <form className="join w-full shadow-md" onSubmit={submitJoinGame}>
        <input
          type="text"
          placeholder="Enter invite link or code"
          className="input input-bordered join-item flex-1 focus:outline-primary transition-all duration-200"
          name="joinGameCode"
          id="joinGameCode"
        />
        <button
          className={
            "btn btn-primary join-item shadow-lg hover:shadow-royal transition-all duration-300" +
            (buttonLoading ? " loading" : "") +
            (!session?.user?.id ? " btn-disabled" : "")
          }
          type="submit"
        >
          {!buttonLoading && <span className="font-bold">JOIN</span>}
        </button>
      </form>
      
      {notFound && (
        <div className="alert alert-error shadow-lg animate-bounce-slow">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Game not found! Please check the code.</span>
        </div>
      )}
      
      {!session?.user?.id && (
        <div className="alert alert-info shadow-md animate-pulse-slow">
          <span className="text-sm">Please login to join a game</span>
        </div>
      )}
    </div>
  );
}
