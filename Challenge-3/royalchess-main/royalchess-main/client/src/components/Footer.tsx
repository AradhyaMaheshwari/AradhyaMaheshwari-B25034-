import { IconCrown } from "@tabler/icons-react";

export default function Footer() {
  return (
    <footer className="footer border-primary/20 text-base-content mx-1 mt-8 w-auto items-center justify-center border-t-2 p-6 md:mx-16 lg:mx-40">
      <div className="items-center flex gap-2">
        <IconCrown size={20} className="text-primary animate-pulse-slow" />
        <p className="text-sm">
          &copy; 2024{" "}
          <span className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            RoyalChess
          </span>
          {" · Premium Online Chess"}
        </p>
      </div>
    </footer>
  );
}
