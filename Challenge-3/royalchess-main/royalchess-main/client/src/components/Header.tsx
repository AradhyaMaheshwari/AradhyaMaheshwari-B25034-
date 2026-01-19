import { IconExternalLink, IconUser, IconCrown } from "@tabler/icons-react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="navbar backdrop-blur-lg bg-base-100/80 shadow-royal mx-1 w-auto justify-center border-b border-primary/20 md:mx-16 lg:mx-40 sticky top-0 z-50">
      <div className="flex flex-1 items-center gap-3">
        <Link
          href="/"
          className="btn btn-ghost no-animation p-0 text-2xl normal-case hover:bg-transparent group transition-all duration-300"
        >
          <div className="relative">
            <IconCrown className="h-9 w-9 text-primary group-hover:text-secondary transition-colors duration-300 group-hover:scale-110 transform" />
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
          </div>
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-bold ml-1">
            RoyalChess
          </span>
        </Link>
        <div className="badge badge-sm badge-primary gap-1 animate-pulse-slow shadow-lg border-primary/30">
          <span className="text-xs font-semibold">PREMIUM</span>
          <IconExternalLink size={10} />
        </div>
      </div>
      <div className="flex-none gap-2">
        <ThemeToggle />
        <label 
          tabIndex={0} 
          htmlFor="auth-modal" 
          className="btn btn-ghost btn-circle avatar hover:shadow-royal transition-all duration-300 hover:scale-105"
        >
          <div className="w-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/30 hover:border-primary/50 transition-all duration-300">
            <IconUser className="m-auto block h-full text-primary" />
          </div>
        </label>
      </div>
    </header>
  );
}
