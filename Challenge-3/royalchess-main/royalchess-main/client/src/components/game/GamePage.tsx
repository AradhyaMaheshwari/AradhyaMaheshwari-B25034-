"use client";
// TODO: restructure, i could use some help with this :>

import {
  IconChevronLeft,
  IconChevronRight,
  IconCopy,
  IconPlayerSkipBack,
  IconPlayerSkipForward
} from "@tabler/icons-react";

import type { FormEvent, KeyboardEvent } from "react";

import { SessionContext } from "@/context/session";
import { useContext, useEffect, useReducer, useRef, useState } from "react";

import type { Message } from "@/types";
import type { Game } from "@royalchess/types";

import type { Move, Square } from "chess.js";
import { Chess } from "chess.js";
import type { ClearPremoves } from "react-chessboard";
import { Chessboard } from "react-chessboard";

import { API_URL } from "@/config";
import { io } from "socket.io-client";

import { lobbyReducer, squareReducer } from "./reducers";
import { initSocket } from "./socketEvents";
import { syncPgn, syncSide } from "./utils";

const socket = io(API_URL, { withCredentials: true, autoConnect: false });

export default function GamePage({ initialLobby }: { initialLobby: Game }) {
  const session = useContext(SessionContext);

  const [lobby, updateLobby] = useReducer(lobbyReducer, {
    ...initialLobby,
    actualGame: new Chess(),
    side: "s"
  });

  const [customSquares, updateCustomSquares] = useReducer(squareReducer, {
    options: {},
    lastMove: {},
    rightClicked: {},
    check: {}
  });

  const [moveFrom, setMoveFrom] = useState<string | Square | null>(null);
  const [boardWidth, setBoardWidth] = useState(480);
  const chessboardRef = useRef<ClearPremoves>(null);

  const [navFen, setNavFen] = useState<string | null>(null);
  const [navIndex, setNavIndex] = useState<number | null>(null);

  const [playBtnLoading, setPlayBtnLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      author: {},
      message: `Welcome! You can invite friends to watch or play by sharing the link above. Have fun!`
    }
  ]);
  const chatListRef = useRef<HTMLUListElement>(null);
  const moveListRef = useRef<HTMLDivElement>(null);

  const [abandonSeconds, setAbandonSeconds] = useState(60);
  useEffect(() => {
    if (
      lobby.side === "s" ||
      lobby.endReason ||
      lobby.winner ||
      !lobby.pgn ||
      !lobby.white ||
      !lobby.black ||
      (lobby.white.id !== session?.user?.id && lobby.black.id !== session?.user?.id)
    )
      return;

    let interval: number;
    if (!lobby.white?.connected || !lobby.black?.connected) {
      setAbandonSeconds(60);
      interval = Number(
        setInterval(() => {
          if (abandonSeconds === 0 || (lobby.white?.connected && lobby.black?.connected)) {
            clearInterval(interval);
            return;
          }
          setAbandonSeconds((s) => s - 1);
        }, 1000)
      );
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lobby.black, lobby.white, lobby.black?.disconnectedOn, lobby.white?.disconnectedOn]);

  useEffect(() => {
    if (!session?.user || !session.user?.id) return;
    socket.connect();

    window.addEventListener("resize", handleResize);
    handleResize();

    if (lobby.pgn && lobby.actualGame.pgn() !== lobby.pgn) {
      syncPgn(lobby.pgn, lobby, { updateCustomSquares, setNavFen, setNavIndex });
    }

    syncSide(session.user, undefined, lobby, { updateLobby });

    initSocket(session.user, socket, lobby, {
      updateLobby,
      addMessage,
      updateCustomSquares,
      makeMove,
      setNavFen,
      setNavIndex
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      socket.removeAllListeners();
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // auto scroll down when new message is added
  useEffect(() => {
    const chatList = chatListRef.current;
    if (!chatList) return;
    chatList.scrollTop = chatList.scrollHeight;
  }, [chatMessages]);

  // auto scroll for moves
  useEffect(() => {
    const activeMoveEl = document.getElementById("activeNavMove");
    const moveList = moveListRef.current;
    if (!activeMoveEl || !moveList) return;
    moveList.scrollTop = activeMoveEl.offsetTop;
  });

  useEffect(() => {
    updateTurnTitle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lobby]);

  function updateTurnTitle() {
    if (lobby.side === "s" || !lobby.white?.id || !lobby.black?.id) return;

    if (!lobby.endReason && lobby.side === lobby.actualGame.turn()) {
      document.title = "(your turn) RoyalChess";
    } else {
      document.title = "RoyalChess";
    }
  }

  function handleResize() {
    if (window.innerWidth >= 1920) {
      setBoardWidth(580);
    } else if (window.innerWidth >= 1536) {
      setBoardWidth(540);
    } else if (window.innerWidth >= 768) {
      setBoardWidth(480);
    } else {
      setBoardWidth(350);
    }
  }

  function addMessage(message: Message) {
    setChatMessages((prev) => [...prev, message]);
  }

  function sendChat(message: string) {
    if (!session?.user) return;

    socket.emit("chat", message);
    addMessage({ author: session.user, message });
  }

  function chatKeyUp(e: KeyboardEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.key === "Enter") {
      const input = e.target as HTMLInputElement;
      if (!input.value || input.value.length == 0) return;
      sendChat(input.value);
      input.value = "";
    }
  }

  function chatClickSend(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const target = e.target as HTMLFormElement;
    const input = target.elements.namedItem("chatInput") as HTMLInputElement;
    if (!input.value || input.value.length == 0) return;
    sendChat(input.value);
    input.value = "";
  }

  function makeMove(m: { from: string; to: string; promotion?: string }) {
    try {
      const result = lobby.actualGame.move(m);

      if (result) {
        setNavFen(null);
        setNavIndex(null);
        updateLobby({
          type: "updateLobby",
          payload: { pgn: lobby.actualGame.pgn() }
        });
        updateTurnTitle();
        let kingSquare = undefined;
        if (lobby.actualGame.inCheck()) {
          const kingPos = lobby.actualGame.board().reduce((acc, row, index) => {
            const squareIndex = row.findIndex(
              (square) => square && square.type === "k" && square.color === lobby.actualGame.turn()
            );
            return squareIndex >= 0 ? `${String.fromCharCode(squareIndex + 97)}${8 - index}` : acc;
          }, "");
          kingSquare = {
            [kingPos]: {
              background: "radial-gradient(red, rgba(255,0,0,.4), transparent 70%)",
              borderRadius: "50%"
            }
          };
        }
        updateCustomSquares({
          lastMove: {
            [result.from]: { background: "rgba(255, 255, 0, 0.4)" },
            [result.to]: { background: "rgba(255, 255, 0, 0.4)" }
          },
          options: {},
          check: kingSquare
        });
        return true;
      } else {
        throw new Error("Invalid move");
      }
    } catch (err) {
      updateCustomSquares({
        options: {}
      });
      return false;
    }
  }

  function isDraggablePiece({ piece }: { piece: string }) {
    return piece.startsWith(lobby.side) && !lobby.endReason && !lobby.winner;
  }

  function onDrop(sourceSquare: Square, targetSquare: Square) {
    if (lobby.side === "s" || navFen || lobby.endReason || lobby.winner) return false;

    // premove
    if (lobby.side !== lobby.actualGame.turn()) return true;

    const moveDetails = {
      from: sourceSquare,
      to: targetSquare,
      promotion: "q"
    };

    const move = makeMove(moveDetails);
    if (!move) return false; // illegal move
    socket.emit("sendMove", moveDetails);
    return true;
  }

  function getMoveOptions(square: Square) {
    const moves = lobby.actualGame.moves({
      square,
      verbose: true
    }) as Move[];
    if (moves.length === 0) {
      return;
    }

    const newSquares: {
      [square: string]: { background: string; borderRadius?: string };
    } = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          lobby.actualGame.get(move.to as Square) &&
          lobby.actualGame.get(move.to as Square)?.color !== lobby.actualGame.get(square)?.color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%"
      };
      return move;
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)"
    };
    updateCustomSquares({ options: newSquares });
  }

  function onPieceDragBegin(_piece: string, sourceSquare: Square) {
    if (lobby.side !== lobby.actualGame.turn() || navFen || lobby.endReason || lobby.winner) return;

    getMoveOptions(sourceSquare);
  }

  function onPieceDragEnd() {
    updateCustomSquares({ options: {} });
  }

  function onSquareClick(square: Square) {
    updateCustomSquares({ rightClicked: {} });
    if (lobby.side !== lobby.actualGame.turn() || navFen || lobby.endReason || lobby.winner) return;

    function resetFirstMove(square: Square) {
      setMoveFrom(square);
      getMoveOptions(square);
    }

    // from square
    if (moveFrom === null) {
      resetFirstMove(square);
      return;
    }

    const moveDetails = {
      from: moveFrom,
      to: square,
      promotion: "q"
    };

    const move = makeMove(moveDetails);
    if (!move) {
      resetFirstMove(square);
    } else {
      setMoveFrom(null);
      socket.emit("sendMove", moveDetails);
    }
  }

  function onSquareRightClick(square: Square) {
    const colour = "rgba(0, 0, 255, 0.4)";
    updateCustomSquares({
      rightClicked: {
        ...customSquares.rightClicked,
        [square]:
          customSquares.rightClicked[square] &&
          customSquares.rightClicked[square]?.backgroundColor === colour
            ? undefined
            : { backgroundColor: colour }
      }
    });
  }

  function clickPlay(e: FormEvent<HTMLButtonElement>) {
    setPlayBtnLoading(true);
    e.preventDefault();
    socket.emit("joinAsPlayer");
  }

  function getPlayerHtml(side: "top" | "bottom") {
    const blackHtml = (
      <div className="flex w-full flex-col justify-center">
        <a
          className={
            (lobby.black?.name ? "font-bold" : "") +
            (typeof lobby.black?.id === "number" ? " text-primary link-hover" : " cursor-default")
          }
          href={typeof lobby.black?.id === "number" ? `/user/${lobby.black?.name}` : undefined}
          target="_blank"
          rel="noopener noreferrer"
        >
          {lobby.black?.name || "(no one)"}
        </a>
        <span className="flex items-center gap-1 text-xs">
          black
          {lobby.black?.connected === false && (
            <span className="badge badge-xs badge-error">disconnected</span>
          )}
        </span>
      </div>
    );
    const whiteHtml = (
      <div className="flex w-full flex-col justify-center">
        <a
          className={
            (lobby.white?.name ? "font-bold" : "") +
            (typeof lobby.white?.id === "number" ? " text-primary link-hover" : " cursor-default")
          }
          href={typeof lobby.white?.id === "number" ? `/user/${lobby.white?.name}` : undefined}
          target="_blank"
          rel="noopener noreferrer"
        >
          {lobby.white?.name || "(no one)"}
        </a>
        <span className="flex items-center gap-1 text-xs">
          white
          {lobby.white?.connected === false && (
            <span className="badge badge-xs badge-error">disconnected</span>
          )}
        </span>
      </div>
    );

    if (lobby.black?.id === session?.user?.id) {
      return side === "top" ? whiteHtml : blackHtml;
    } else {
      return side === "top" ? blackHtml : whiteHtml;
    }
  }

  function copyInvite() {
    const text = `https://ches.su/${lobby.endReason ? `archive/${lobby.id}` : initialLobby.code}`;
    if ("clipboard" in navigator) {
      navigator.clipboard.writeText(text);
    } else {
      document.execCommand("copy", true, text);
    }
    setCopiedLink(true);
    setTimeout(() => {
      setCopiedLink(false);
    }, 5000);
  }

  function getMoveListHtml() {
    const history = lobby.actualGame.history({ verbose: true });
    const movePairs = history
      .slice(history.length / 2)
      .map((_, i) => history.slice((i *= 2), i + 2));

    return movePairs.map((moves, i) => {
      return (
        <tr className="flex w-full items-center gap-1" key={i + 1}>
          <td className="">{i + 1}.</td>
          <td
            className={
              "btn btn-ghost btn-xs h-full w-2/5 font-normal normal-case" +
              ((history.indexOf(moves[0]) === history.length - 1 && navIndex === null) ||
              navIndex === history.indexOf(moves[0])
                ? " btn-active pointer-events-none rounded-none"
                : "")
            }
            id={
              (history.indexOf(moves[0]) === history.length - 1 && navIndex === null) ||
              navIndex === history.indexOf(moves[0])
                ? "activeNavMove"
                : ""
            }
            onClick={() => navigateMove(history.indexOf(moves[0]))}
          >
            {moves[0].san}
          </td>
          {moves[1] && (
            <td
              className={
                "btn btn-ghost btn-xs h-full w-2/5 font-normal normal-case" +
                ((history.indexOf(moves[1]) === history.length - 1 && navIndex === null) ||
                navIndex === history.indexOf(moves[1])
                  ? " btn-active pointer-events-none rounded-none"
                  : "")
              }
              id={
                (history.indexOf(moves[1]) === history.length - 1 && navIndex === null) ||
                navIndex === history.indexOf(moves[1])
                  ? "activeNavMove"
                  : ""
              }
              onClick={() => navigateMove(history.indexOf(moves[1]))}
            >
              {moves[1].san}
            </td>
          )}
        </tr>
      );
    });
  }

  function navigateMove(index: number | null | "prev") {
    const history = lobby.actualGame.history({ verbose: true });

    if (index === null || (index !== "prev" && index >= history.length - 1) || !history.length) {
      // last move
      setNavIndex(null);
      setNavFen(null);
      return;
    }

    if (index === "prev") {
      index = history.length - 2;
    } else if (index < 0) {
      index = 0;
    }

    chessboardRef.current?.clearPremoves(false);

    setNavIndex(index);
    setNavFen(history[index].after);
  }

  function getNavMoveSquares() {
    if (navIndex === null) return;
    const history = lobby.actualGame.history({ verbose: true });

    if (!history.length) return;

    return {
      [history[navIndex].from]: { background: "rgba(255, 255, 0, 0.4)" },
      [history[navIndex].to]: { background: "rgba(255, 255, 0, 0.4)" }
    };
  }

  function claimAbandoned(type: "win" | "draw") {
    if (
      lobby.side === "s" ||
      lobby.endReason ||
      lobby.winner ||
      !lobby.pgn ||
      abandonSeconds > 0 ||
      (lobby.black?.connected && lobby.white?.connected)
    ) {
      return;
    }
    socket.emit("claimAbandoned", type);
  }

  return (
    <div className="flex w-full flex-wrap justify-center gap-6 px-4 py-4 lg:gap-10 2xl:gap-16 animate-fade-in">
      <div className="relative h-min shadow-royal-lg rounded-xl overflow-hidden">
        {/* overlay */}
        {(!lobby.white?.id || !lobby.black?.id) && (
          <div className="absolute bottom-0 right-0 top-0 z-10 flex h-full w-full items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-base-200 to-base-300 flex w-full items-center justify-center gap-4 px-4 py-6 shadow-royal animate-pulse-slow rounded-lg m-4">
              <div className="flex flex-col items-center gap-3">
                <span className="text-lg font-semibold">Waiting for opponent...</span>
                {session?.user?.id !== lobby.white?.id && session?.user?.id !== lobby.black?.id && (
                  <button
                    className={"btn btn-primary shadow-lg hover:shadow-royal transition-all duration-300" + (playBtnLoading ? " loading" : "")}
                    onClick={clickPlay}
                  >
                    Play as {lobby.white?.id ? "Black ⚫" : "White ⚪"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <Chessboard
          boardWidth={boardWidth}
          customDarkSquareStyle={{ backgroundColor: "#1e40af" }}
          customLightSquareStyle={{ backgroundColor: "#dbeafe" }}
          position={navFen || lobby.actualGame.fen()}
          boardOrientation={lobby.side === "b" ? "black" : "white"}
          isDraggablePiece={isDraggablePiece}
          onPieceDragBegin={onPieceDragBegin}
          onPieceDragEnd={onPieceDragEnd}
          onPieceDrop={onDrop}
          onSquareClick={onSquareClick}
          onSquareRightClick={onSquareRightClick}
          arePremovesAllowed={!navFen}
          customSquareStyles={{
            ...(navIndex === null ? customSquares.lastMove : getNavMoveSquares()),
            ...(navIndex === null ? customSquares.check : {}),
            ...customSquares.rightClicked,
            ...(navIndex === null ? customSquares.options : {})
          }}
          ref={chessboardRef}
        />
      </div>

      <div className="flex max-w-lg flex-1 flex-col items-center justify-center gap-4">
        <div className="mb-auto flex w-full p-2">
          <div className="flex flex-1 flex-col items-center justify-between">
            {getPlayerHtml("top")}
            <div className="my-auto w-full text-sm font-semibold text-primary">VS</div>
            {getPlayerHtml("bottom")}
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <div className="mb-2 flex w-full flex-col items-end gap-2">
              <span className="text-sm font-medium">{lobby.endReason ? "Archived link:" : "Invite friends:"}</span>
              <div
                className={
                  "dropdown dropdown-top dropdown-end" + (copiedLink ? " dropdown-open" : "")
                }
              >
                <label
                  tabIndex={0}
                  className="badge badge-primary badge-lg gap-2 font-mono text-sm cursor-pointer hover:badge-secondary transition-all duration-200 shadow-md"
                  onClick={copyInvite}
                >
                  <IconCopy size={16} />
                  royal.chess/{lobby.endReason ? `archive/${lobby.id}` : initialLobby.code}
                </label>
                <div tabIndex={0} className="dropdown-content badge badge-success text-xs shadow-lg animate-bounce-slow">
                  ✓ Copied to clipboard
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-base-200 to-base-300 rounded-lg shadow-md p-2">
              <div className="h-32 w-full overflow-y-scroll custom-scrollbar" ref={moveListRef}>
                <table className="table-compact table w-full">
                  <tbody>{getMoveListHtml()}</tbody>
                </table>
              </div>
            </div>
            <div className="flex h-10 w-full gap-1">
              <button
                className={
                  "btn btn-sm flex-grow shadow-md hover:shadow-royal hover:btn-primary transition-all duration-200" +
                  (navIndex === 0 || lobby.actualGame.history().length <= 1 ? " btn-disabled" : "")
                }
                onClick={() => navigateMove(0)}
              >
                <IconPlayerSkipBack size={18} />
              </button>
              <button
                className={
                  "btn btn-sm flex-grow shadow-md hover:shadow-royal hover:btn-primary transition-all duration-200" +
                  (navIndex === 0 || lobby.actualGame.history().length <= 1 ? " btn-disabled" : "")
                }
                onClick={() => navigateMove(navIndex === null ? "prev" : navIndex - 1)}
              >
                <IconChevronLeft size={18} />
              </button>
              <button
                className={
                  "btn btn-sm flex-grow shadow-md hover:shadow-royal hover:btn-primary transition-all duration-200" + (navIndex === null ? " btn-disabled" : "")
                }
                onClick={() => navigateMove(navIndex === null ? null : navIndex + 1)}
              >
                <IconChevronRight size={18} />
              </button>
              <button
                className={
                  "btn btn-sm flex-grow shadow-md hover:shadow-royal hover:btn-primary transition-all duration-200" + (navIndex === null ? " btn-disabled" : "")
                }
                onClick={() => navigateMove(null)}
              >
                <IconPlayerSkipForward size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="relative h-96 w-full min-w-fit">
          {(lobby.endReason ||
            (lobby.pgn &&
              lobby.white &&
              session?.user?.id === lobby.white?.id &&
              lobby.black &&
              !lobby.black?.connected) ||
            (lobby.pgn &&
              lobby.black &&
              session?.user?.id === lobby.black?.id &&
              lobby.white &&
              !lobby.white?.connected)) && (
            <div className="bg-gradient-to-r from-primary to-secondary absolute w-full rounded-t-xl bg-opacity-95 p-3 shadow-royal z-10 animate-slide-down">
              {lobby.endReason ? (
                <div className="text-primary-content">
                  {lobby.endReason === "abandoned"
                    ? lobby.winner === "draw"
                      ? `The game ended in a draw due to abandonment.`
                      : `The game was won by ${lobby.winner} due to abandonment.`
                    : lobby.winner === "draw"
                      ? "The game ended in a draw."
                      : `The game was won by checkmate (${lobby.winner}).`}{" "}
                  <br />
                  You can review the archived game at{" "}
                  <a
                    className="link link-hover font-bold underline"
                    href={`/archive/${lobby.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    royal.chess/archive/{lobby.id}
                  </a>
                  .
                </div>
              ) : abandonSeconds > 0 ? (
                <div className="text-primary-content">
                  Your opponent has disconnected. You can claim the win or draw in <span className="font-bold text-accent">{abandonSeconds}</span> second{abandonSeconds > 1 ? "s" : ""}.
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-center gap-3 text-primary-content">
                  <span className="font-semibold">Your opponent has disconnected.</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => claimAbandoned("win")}
                      className="btn btn-sm btn-accent shadow-md hover:scale-105 transition-transform"
                    >
                      Claim Win
                    </button>
                    <button onClick={() => claimAbandoned("draw")} className="btn btn-sm btn-ghost hover:btn-neutral">
                      Draw
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="bg-gradient-to-br from-base-200 to-base-300 flex h-full w-full min-w-[64px] flex-col rounded-xl p-4 shadow-royal">
            <div className="mb-3 pb-2 border-b border-primary/20">
              <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Game Chat
              </h3>
            </div>
            <ul
              className="mb-4 flex h-full flex-col gap-2 overflow-y-scroll break-words custom-scrollbar pr-2"
              ref={chatListRef}
            >
              {chatMessages.map((m, i) => (
                <li
                  className={
                    "rounded-lg transition-all duration-200 animate-fade-in" +
                    (!m.author.id && m.author.name === "server"
                      ? " bg-primary/10 text-primary p-3 border border-primary/30"
                      : m.author.id === session?.user?.id
                      ? " bg-primary/20 p-3 ml-8 shadow-md"
                      : " bg-base-300 p-3 mr-8 shadow-sm")
                  }
                  key={i}
                  style={{animationDelay: `${i * 0.05}s`}}
                >
                  <div className="flex flex-col gap-1">
                    {m.author.id && (
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${m.author.id === session?.user?.id ? "bg-primary" : "bg-secondary"} animate-pulse-slow`}></div>
                        <a
                          className={
                            "font-bold text-sm" +
                            (typeof m.author.id === "number"
                              ? " text-primary hover:text-secondary link-hover transition-colors"
                              : " cursor-default")
                          }
                          href={
                            typeof m.author.id === "number" ? `/user/${m.author.name}` : undefined
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {m.author.name}
                        </a>
                      </div>
                    )}
                    <span className="text-sm leading-relaxed">{m.message}</span>
                  </div>
                </li>
              ))}
            </ul>
            <form className="join w-full mt-auto shadow-md" onSubmit={chatClickSend}>
              <input
                type="text"
                placeholder="Type your message..."
                className="input input-bordered join-item flex-grow focus:outline-primary transition-all duration-200"
                name="chatInput"
                id="chatInput"
                onKeyUp={chatKeyUp}
                required
              />
              <button className="btn btn-primary join-item shadow-lg hover:shadow-royal transition-all duration-300" type="submit">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
        {lobby.observers && lobby.observers.length > 0 && (
          <div className="w-full px-2 py-2 bg-base-200 rounded-lg shadow-md">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="text-xs font-medium">Spectators:</span>
              <span className="text-xs text-primary font-semibold">{lobby.observers?.map((o) => o.name).join(", ")}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
