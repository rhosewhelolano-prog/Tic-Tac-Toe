"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameMode, setGameMode] = useState("multiplayer");
  const [isAiThinking, setIsAiThinking] = useState(false);

  const [scores, setScores] = useState({
    "🔥": 0,
    "❄️": 0,
  });

  const result = calculateWinner(board);
  const winner = result?.winner;
  const winningLine = result?.line || [];

  const isDraw = !winner && board.every((cell) => cell !== null);

  useEffect(() => {
    if (winner) {
      setScores((prev) => ({
        ...prev,
        [winner]: prev[winner] + 1,
      }));
    }
  }, [winner]);

  const makeComputerMove = (currentBoard) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    // Win if possible
    for (const line of lines) {
      const [a, b, c] = line;

      const values = [
        currentBoard[a],
        currentBoard[b],
        currentBoard[c],
      ];

      if (
        values.filter((v) => v === "❄️").length === 2 &&
        values.includes(null)
      ) {
        return line[values.indexOf(null)];
      }
    }

    // Block the player
    for (const line of lines) {
      const [a, b, c] = line;

      const values = [
        currentBoard[a],
        currentBoard[b],
        currentBoard[c],
      ];

      if (
        values.filter((v) => v === "🔥").length === 2 &&
        values.includes(null)
      ) {
        return line[values.indexOf(null)];
      }
    }

    // Take center
    if (currentBoard[4] === null) {
      return 4;
    }

    // Take corners
    const corners = [0, 2, 6, 8].filter(
      (index) => currentBoard[index] === null
    );

    if (corners.length > 0) {
      return corners[
        Math.floor(Math.random() * corners.length)
      ];
    }

    // Any remaining spot
    const emptySquares = currentBoard
      .map((cell, index) => (cell === null ? index : null))
      .filter((index) => index !== null);

    if (emptySquares.length === 0) return null;

    return emptySquares[
      Math.floor(Math.random() * emptySquares.length)
    ];
  };

  const handleClick = (index) => {
    if (board[index] || winner || isAiThinking) return;

    const newBoard = [...board];

    if (gameMode === "single") {
      newBoard[index] = "🔥";
      setBoard(newBoard);

      const playerWon = calculateWinner(newBoard);
      const boardFull = newBoard.every(
        (cell) => cell !== null
      );

      if (playerWon || boardFull) return;

      setIsAiThinking(true);

      setTimeout(() => {
        const aiMove = makeComputerMove(newBoard);

        if (aiMove !== null) {
          const aiBoard = [...newBoard];
          aiBoard[aiMove] = "❄️";
          setBoard(aiBoard);
        }

        setIsAiThinking(false);
      }, 700);
    } else {
      newBoard[index] = isXNext ? "🔥" : "❄️";
      setBoard(newBoard);
      setIsXNext(!isXNext);
    }
  };

  const newGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setIsAiThinking(false);
  };

  const resetScores = () => {
    setScores({
      "🔥": 0,
      "❄️": 0,
    });

    newGame();
  };

  const getStatus = () => {
    if (winner) return `🏆 Winner: ${winner}`;

    if (isDraw) return "🤝 It's a Draw!";

    if (isAiThinking) {
      return "🤖 Computer is thinking...";
    }

    if (gameMode === "single") {
      return "Your Turn 🔥";
    }

    return `Turn: ${isXNext ? "🔥" : "❄️"}`;
  };

  return (
    <main className="container">
      <h1>🤖 Tic-Tac-Toe</h1>

      <p className="subtitle">
        Play against a smart Computer or challenge a friend.
      </p>

      <div className="mode-selector">
        <button
          className={
            gameMode === "single" ? "active-mode" : ""
          }
          onClick={() => {
            setGameMode("single");
            newGame();
          }}
        >
          🤖 Single Player
        </button>

        <button
          className={
            gameMode === "multiplayer" ? "active-mode" : ""
          }
          onClick={() => {
            setGameMode("multiplayer");
            newGame();
          }}
        >
          👥 Multiplayer
        </button>
      </div>

      <p className="mode-label">
        Mode:{" "}
        {gameMode === "single"
          ? "🤖 Single Player"
          : "👥 Multiplayer"}
      </p>

      <div className="scoreboard">
        <p>🔥 Score: {scores["🔥"]}</p>
        <p>❄️ Score: {scores["❄️"]}</p>
      </div>

      <p className="status">{getStatus()}</p>

      <div className="board">
        {board.map((cell, index) => (
          <button
            key={index}
            className={`square ${
              winningLine.includes(index)
                ? "winner-square"
                : ""
            }`}
            onClick={() => handleClick(index)}
          >
            {cell}
          </button>
        ))}
      </div>

      <div className="buttons">
        <button className="new-game" onClick={newGame}>
          New Game
        </button>

        <button
          className="reset-score"
          onClick={resetScores}
        >
          Reset Scores
        </button>
      </div>
    </main>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let [a, b, c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return {
        winner: squares[a],
        line: [a, b, c],
      };
    }
  }

  return null;
}