import { fetchPublicGames } from "@/lib/game";
import JoinButton from "./JoinButton";
import RefreshButton from "./RefreshButton";
import "./styles.css";

export default async function PublicGames() {
  const games = await fetchPublicGames();

  return (
    <div className="flex flex-col items-center w-full animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Public Games
        </h2>
        <RefreshButton />
      </div>

      <div className="bg-gradient-to-br from-base-200 to-base-300 rounded-2xl shadow-royal overflow-hidden w-full">
        <div className="h-96 max-h-96 overflow-y-auto public-games-scrollbar">
          <table className="table w-full">
            <thead className="sticky top-0 z-10 bg-gradient-to-r from-primary to-secondary text-primary-content">
              <tr>
                <th className="w-1/3 text-base">Host</th>
                <th className="w-1/3 text-base">Opponent</th>
                <th className="w-1/3 text-base text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {games && games.length > 0 ? (
                games.map((game, index) => (
                  <tr 
                    key={game.code} 
                    className="hover:bg-primary/10 transition-all duration-200 border-b border-base-300 animate-fade-in"
                    style={{animationDelay: `${index * 0.05}s`}}
                  >
                    <td className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${typeof game.host?.id === "number" ? "bg-primary animate-pulse-slow" : "bg-base-content/30"}`}></div>
                        <span className={typeof game.host?.id === "number" ? "text-primary font-bold" : ""}>
                          {game.host?.name}
                        </span>
                      </div>
                    </td>
                    <td className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className={
                          `w-2 h-2 rounded-full ${
                            typeof (game.host?.id === game.white?.id
                              ? game.black?.id
                              : game.white?.id) === "number"
                              ? "bg-secondary animate-pulse-slow"
                              : "bg-base-content/30"
                          }`
                        }></div>
                        <span className={
                          typeof (game.host?.id === game.white?.id
                            ? game.black?.id
                            : game.white?.id) === "number"
                            ? "text-secondary font-bold"
                            : "text-base-content/50"
                        }>
                          {(game.host?.id === game.white?.id ? game.black?.name : game.white?.name) || "Waiting..."}
                        </span>
                      </div>
                    </td>
                    <th className="text-center">
                      <JoinButton code={game.code as string} />
                    </th>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-12 text-base-content/50">
                    <div className="flex flex-col items-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <span className="text-lg font-medium">No public games available</span>
                      <span className="text-sm">Create one to get started!</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
