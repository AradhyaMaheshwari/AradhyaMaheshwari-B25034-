import CreateGame from "@/components/home/CreateGame";
import JoinGame from "@/components/home/JoinGame";
import PublicGames from "@/components/home/PublicGames/PublicGames";

export const revalidate = 0;

export default function Home() {
  return (
    <div className="flex w-full flex-wrap items-start justify-center gap-8 px-4 py-10 lg:gap-16 animate-fade-in">
      <div className="flex-1 max-w-2xl">
        <PublicGames />
      </div>

      <div className="flex flex-col items-center gap-6 min-w-[320px]">
        <div className="card bg-base-200 shadow-royal hover:shadow-royal-lg transition-all duration-300 w-full animate-slide-up">
          <div className="card-body">
            <h2 className="card-title text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
              Join from invite
            </h2>
            <JoinGame />
          </div>
        </div>

        <div className="divider my-2">
          <span className="badge badge-primary badge-lg shadow-md">OR</span>
        </div>

        <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 shadow-royal hover:shadow-royal-lg transition-all duration-300 border border-primary/20 w-full animate-slide-up" style={{animationDelay: '0.1s'}}>
          <div className="card-body">
            <h2 className="card-title text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
              Create game
            </h2>
            <CreateGame />
          </div>
        </div>
      </div>
    </div>
  );
}
