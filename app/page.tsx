"use client";

import { MouseEvent as ReactMouseEvent, useState } from "react";

function createRandomGameFields(cols: number, rows: number) {
  const items = cols * rows;

  return [...Array(items)].map((_) => (Math.random() > 0.7 ? "💣" : ""));
}

function bombsNearTile({
  fields,
  tileIndex,
  columns,
  rows,
}: {
  fields: string[];
  tileIndex: number;
  columns: number;
  rows: number;
}) {
  if (fields[tileIndex] === "💣") {
    return "💣";
  }

  const validFields = [];

  // Right border should not wrap
  if ((tileIndex + 1) % columns !== 0) {
    validFields.push(
      ...[tileIndex - columns + 1, tileIndex + 1, tileIndex + columns + 1]
    );
  }

  // Left border should not wrap
  if (tileIndex % columns !== 0) {
    validFields.push(
      ...[tileIndex - columns - 1, tileIndex - 1, tileIndex + columns - 1]
    );
  }

  // Top should be within the game field
  if (tileIndex - columns >= 0) {
    validFields.push(tileIndex - columns);
  }

  // Bottom should be within game field
  if (tileIndex + columns < columns * rows) {
    validFields.push(tileIndex + columns);
  }

  return validFields
    .map((i) => fields[i])
    .filter((f) => f === "💣")
    .length.toString();
}

export default function Home() {
  const columns = 4;
  const rows = 4;
  const [fields, setFields] = useState<string[]>([]);
  const [currentFields, setCurrentFields] = useState<string[]>([]);

  const handleNewGame = () => {
    setFields([...createRandomGameFields(columns, rows)]);
    setCurrentFields([...Array(columns * rows)].map(() => ""));
  };

  const revealAllFields = () => {
    setCurrentFields((tmpCurrentFields) =>
      tmpCurrentFields.map((f, i) => {
        if (f === "🚩") {
          return f;
        }

        return bombsNearTile({ tileIndex: i, columns, rows, fields });
      })
    );
  };

  const handleTileClick = (tile: number) => () => {
    if (currentFields[tile]) {
      return;
    }

    setCurrentFields((tmpCurrentFields) => {
      tmpCurrentFields[tile] = bombsNearTile({
        tileIndex: tile,
        columns,
        rows,
        fields,
      });

      return [...tmpCurrentFields];
    });

    if (fields[tile] === "💣") {
      // HandleGameOver
      revealAllFields();
    }
  };

  const handlePlaceFlag =
    (tile: number) => (e: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();

      if (currentFields[tile] !== "🚩" && currentFields[tile]) {
        return;
      }

      currentFields[tile] = currentFields[tile] === "🚩" ? "" : "🚩";

      setCurrentFields([...currentFields]);
    };

  const gameFinished =
    currentFields.filter(Boolean).length === currentFields.length;
  const gameLost = currentFields.includes("💣");
  const gameWon =
    !gameLost &&
    fields.filter((f) => f === "💣").length ===
      currentFields.filter((f) => f === "🚩").length;

  return (
    <main className="bg-gray-200">
      <section className="max-w-screen-xl mx-auto px-4 py-8 ">
        <h2>Minesweeper clone</h2>

        <div className="my-4">
          {fields.length > 0 ? (
            <>
              <p>Left click: Reveal, Right click: flag</p>
              {gameFinished && (
                <p>
                  {gameLost && "Game finished: You've lost"}
                  {gameWon && "Game finished: You've won"}
                </p>
              )}
              <div
                className={`grid grid-rows-[repeat(var(--rows),var(--tile-size))] grid-cols-[repeat(var(--cols),var(--tile-size))]`}
                style={{
                  ["--rows" as string]: rows,
                  ["--cols" as string]: columns,
                  ["--tile-size" as string]: "3rem",
                }}
                inert={gameFinished}
              >
                {[...Array(columns * rows)].map((_, i) => (
                  <button
                    type="button"
                    className="bg-slate-400 border border-white hover:bg-slate-300 select-none"
                    onClick={handleTileClick(i)}
                    onContextMenu={handlePlaceFlag(i)}
                    key={i}
                  >
                    {currentFields[i]}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div>click 'New Game' to start</div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleNewGame}
            className="rounded-md bg-green-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            New Game
          </button>
          <button
            type="button"
            disabled={gameFinished}
            onClick={revealAllFields}
          >
            Reveal All
          </button>
        </div>
      </section>
    </main>
  );
}
