import { type NextPage } from "next";
import { useEffect, useReducer, useState } from "react";

const ROWS = 20;
const COLS = 20;

type PlayerLocation = {
  row: number;
  col: number;
};

type PlayerMovement = { row: number } | { col: number };

type TMapCell = {
  colour: string;
};

const initialCell = {
  colour: "bg-white",
  value: 0,
};

const Home: NextPage = () => {
  const [cell, setCell] = useState(
    new Array<TMapCell>(ROWS)
      .fill(initialCell)
      .map(() => new Array<TMapCell>(COLS).fill(initialCell))
  );

  const [playerState, updatePlayerState] = useReducer(
    (state: PlayerLocation, action: PlayerMovement) => {
      // if player is out of the map, don't update
      if (
        state.row < 0 ||
        state.col < 0 ||
        state.row >= ROWS ||
        state.col >= COLS
      )
        return state;

      const newState = { ...state };

      // prevent player from going out of the map
      if ("row" in action) {
        if (state.row + action.row < 0 || state.row + action.row >= ROWS) {
          return state;
        }

        newState.row += action.row;
      } else {
        if (state.col + action.col < 0 || state.col + action.col >= COLS) {
          return state;
        }

        newState.col += action.col;
      }

      return newState;
    },
    {
      row: Math.floor(Math.random() * (ROWS - 1)),
      col: Math.floor(Math.random() * (COLS - 1)),
    }
  );

  const [colour, setColour] = useState("bg-red-500");

  // game loop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          updatePlayerState({ row: -1 });
          break;
        case "ArrowDown":
          updatePlayerState({ row: 1 });
          break;
        case "ArrowLeft":
          updatePlayerState({ col: -1 });
          break;
        case "ArrowRight":
          updatePlayerState({ col: 1 });
          break;
        default:
          break;
      }
    };

    cellLogic(playerState.row, playerState.col);

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [playerState.col, playerState.row]);

  const cellLogic = (row: number, col: number): void => {
    if (row < 0 || col < 0 || row >= ROWS || col >= COLS) return;

    setCell((prevState) => {
      const newState = [...prevState];
      console.log(prevState);
      newState[row][col] = { colour: "bg-red-500" };
      return newState;
    });
  };

  return (
    <div className="grid grid-flow-col content-center justify-center">
      <div className="aspect-square w-full">
        {cell.map((row, rIdx) => {
          return (
            <div key={rIdx} className="flex">
              {row.map((cell, cIdx) => (
                <div
                  key={cIdx}
                  className={`aspect-square w-10 border-2 border-solid ${cell.colour}`}
                ></div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
