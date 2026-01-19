"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useContext, useState } from "react";

import { SessionContext } from "@/context/session";
import { createGame } from "@/lib/game";

export default function CreateGame() {
  const session = useContext(SessionContext);
  const [buttonLoading, setButtonLoading] = useState(false);
  const router = useRouter();

  async function submitCreateGame(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!session?.user?.id) return;
    setButtonLoading(true);

    const target = e.target as HTMLFormElement;
    const unlisted = target.elements.namedItem("createUnlisted") as HTMLInputElement;
    const startingSide = (target.elements.namedItem("createStartingSide") as HTMLSelectElement)
      .value;

    const game = await createGame(startingSide, unlisted.checked);

    if (game) {
      router.push(`/${game.code}`);
    } else {
      setButtonLoading(false);
      // TODO: Show error message
    }
  }

  return (
    <form className="form-control space-y-4" onSubmit={submitCreateGame}>
      <label className="label cursor-pointer bg-base-100 rounded-lg p-4 hover:bg-base-300 transition-all duration-200 border border-primary/10">
        <span className="label-text text-base font-medium">Private Game (Invite Only)</span>
        <input 
          type="checkbox" 
          className="checkbox checkbox-primary" 
          name="createUnlisted" 
          id="createUnlisted" 
        />
      </label>
      
      <div className="space-y-2">
        <label className="label" htmlFor="createStartingSide">
          <span className="label-text text-base font-medium">Select your side</span>
        </label>
        <div className="join w-full shadow-md">
          <select
            className="select select-bordered join-item flex-1 focus:outline-primary transition-all duration-200"
            name="createStartingSide"
            id="createStartingSide"
          >
            <option value="random">🎲 Random</option>
            <option value="white">⚪ White</option>
            <option value="black">⚫ Black</option>
          </select>
          <button
            className={
              "btn btn-primary join-item shadow-lg hover:shadow-royal transition-all duration-300" +
              (buttonLoading ? " loading" : "") +
              (!session?.user?.id ? " btn-disabled" : "")
            }
            type="submit"
          >
            {!buttonLoading && <span className="font-bold">CREATE</span>}
          </button>
        </div>
      </div>
      
      {!session?.user?.id && (
        <div className="alert alert-info shadow-md animate-pulse-slow">
          <span className="text-sm">Please login to create a game</span>
        </div>
      )}
    </form>
  );
}
