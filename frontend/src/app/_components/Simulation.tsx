'use client';
import { useCallback, useState } from "react";
import { Steps } from "../_types";

interface SimulationProps {
    steps: Steps;
    setSteps: (steps: Steps) => void
}

export const DEFAULT_LAYOUT = [
    ["R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R",],
    ["R", "X", "X", "R", "X", "X", "X", "X", "R", "X", "X", "X", "X", "R", "X", "X", "R"],
    ["R", "X", "X", "R", "X", "X", "O", "O", "O", "O", "O", "X", "X", "R", "X", "X", "R"],
    ["R", "X", "X", "R", "X", "X", "O", "X", "X", "X", "O", "X", "X", "R", "X", "X", "R"],
    ["I", "R", "R", "I", "R", "R", "O", "X", "X", "X", "O", "R", "R", "I", "R", "R", "I"],
    ["R", "X", "X", "R", "X", "X", "O", "X", "X", "X", "O", "X", "X", "R", "X", "X", "R"],
    ["R", "X", "X", "R", "X", "X", "O", "O", "O", "O", "O", "X", "X", "R", "X", "X", "R"],
    ["R", "X", "X", "R", "X", "X", "X", "X", "R", "X", "X", "X", "X", "R", "X", "X", "R"],
    ["R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R",],
];

const RoadTile = () => {
    return (
        <div className="w-16 h-12 bg-blue-500"></div>
    )
}

const IntersectionTile = () => {
    return (
        <div className="w-16 h-12 bg-yellow-500"></div>
    )
}

const RoundaboutTile = () => {
    return (
        <div className="w-16 h-12 bg-purple-500"></div>
    )
}

const EmptyTile = () => {
    return (
        <div className="w-16 h-12 border border-gray-100 bg-white"></div>
    )
}

const CarTile = () => {
    return (
        <div className="w-16 h-12 bg-gray-500"></div>
    )
}

export default function Simulation({ steps, setSteps }: SimulationProps) {
    const [idx, setIdx] = useState(0);

    const getTile = (symbol: string, key: string) => {
        switch(symbol) {
            case 'R':{
                return <RoadTile key={key} />;
            }
            case 'I': {
                return <IntersectionTile key={key} />;
            }
            case 'O': {
                return <RoundaboutTile key={key} />;
            }
            case 'X': {
                return <EmptyTile key={key} />;
            }
            case 'C': {
                return <CarTile key={key} />;
            }
            default: {
                return <CarTile key={key} />;
            }
        }
    }

    const getDefault = useCallback(() => (
        <div className="flex flex-col flex-nowrap justify-center items-center gap-1">
            {DEFAULT_LAYOUT.map((row, rowIndex) => (
                <div key={rowIndex} className="flex flex-row flex-nowrap gap-1">
                    {row.map((symbol, columnIndex) => getTile(symbol, `${rowIndex}${columnIndex}`))}
                </div>
            ))}
        </div>
    ), []);

    const renderStep = () => {
        if (idx >= steps.length) {
            setSteps([]);
            return getDefault();
        }

        const nextRow = steps[idx];

        setTimeout(() => { setIdx(idx + 1) }, 1000);

        return (
            <div className="flex flex-col flex-nowrap justify-center items-center gap-1">
                {nextRow.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex flex-row flex-nowrap gap-1">
                        {row.map((symbol, columnIndex) => getTile(symbol, `${rowIndex}${columnIndex}`))}
                    </div>
                ))}
            </div>
        );
    }


    if (steps.length === 0) {
        return getDefault();
    }

    return renderStep();
}
