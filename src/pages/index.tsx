import { useEffect, useReducer, useState } from "react";
import NoSsrWrapper from "../components/no-ssr-wrapper";
import { ROWS, COLS, PLAYER_COLOR, PAST_PLAYER } from "../constants";

type PlayerLocation = {
  row: number;
  col: number;
  prevRow: number;
  prevCol: number;
};

type PlayerMovement = { row: number } | { col: number };

type TMapCell = {
  bgColor: string;
};

const initialCell = {
  bgColor: "#ffffff",
  fgColor: "#ffffff",
  value: 0,
  player: false,
};

const Home = () => {
  const [gameMap, setGameMap] = useState(
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

        newState.prevRow = state.row;
        newState.prevCol = state.col;
        newState.row += action.row;
      } else {
        if (state.col + action.col < 0 || state.col + action.col >= COLS) {
          return state;
        }

        newState.prevRow = state.row;
        newState.prevCol = state.col;
        newState.col += action.col;
      }

      return newState;
    },
    {},
    () => {
      const newState = {
        row: Math.floor(Math.random() * (ROWS - 1)),
        col: Math.floor(Math.random() * (COLS - 1)),
        prevRow: 0,
        prevCol: 0,
      };
      newState.prevRow = newState.row;
      newState.prevCol = newState.col;
      return newState;
    }
  );

  // game loop
  useEffect(() => {
    const mapLogic = (playerLocation: PlayerLocation): void => {
      if (
        playerLocation.row < 0 ||
        playerLocation.col < 0 ||
        playerLocation.row >= ROWS ||
        playerLocation.col >= COLS
      )
        return;

      setGameMap((prevState) => {
        const newState: TMapCell[][] = [...prevState];

        newState[playerLocation.prevRow][playerLocation.prevCol] = {
          bgColor: PAST_PLAYER,
        };
        newState[playerLocation.row][playerLocation.col] = {
          bgColor: PLAYER_COLOR,
          // bgColor: "#3b82f6",
        };
        return newState;
      });
    };
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

    console.log(playerState)

    mapLogic(playerState);

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [playerState]);

  return (
    <NoSsrWrapper>
      <div className="grid grid-flow-col content-center justify-center">
        <div className="aspect-square w-full">
          {gameMap.map((row, rIdx) => {
            return (
              <div key={rIdx} className="flex">
                {row.map((cell, cIdx) => (
                  <div
                    key={cIdx}
                    className={`aspect-square w-10 border-2 border-solid ${cell.bgColor}`}
                  ></div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </NoSsrWrapper>
  );
};

export default Home;
