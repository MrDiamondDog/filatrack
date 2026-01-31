"use client";

import { randomFrom, randomInt } from "@/lib/util/random";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

const randomColors = [
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
    "#ffffff",
];

function initCanvas(ctx: CanvasRenderingContext2D) {
    const grid: {
        color: string;
        opacity: number;
        decay: number;
    }[][] = [];
    const squareSize = 25;

    for (let col = 0; col < Math.ceil(ctx.canvas.width / squareSize); col++) {
        grid.push([]);

        for (let row = 0; row < Math.ceil(ctx.canvas.height) / squareSize; row++) {
            grid[col].push({
                color: "#f00",
                opacity: 0,
                decay: 0.01,
            });
        }
    }

    function drawGrid() {
        if (!document.hasFocus())
            return void requestAnimationFrame(drawGrid);

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.strokeStyle = "#16191d";
        ctx.lineWidth = .5;
        for (let x = 0; x < grid.length; x++) {
            for (let y = 0; y < grid[x].length; y++) {
                ctx.fillStyle = grid[x][y].color;

                ctx.globalAlpha = grid[x][y].opacity;
                if (grid[x][y].opacity > 0)
                    grid[x][y].opacity = Math.max(grid[x][y].opacity - grid[x][y].decay, 0);
                if (grid[x][y].opacity <= 0)
                    grid[x][y].decay = 0.01;

                ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);

                ctx.globalAlpha = 1;
                ctx.strokeRect(x * squareSize, y * squareSize, squareSize, squareSize);
            }
        }

        requestAnimationFrame(drawGrid);
    }

    drawGrid();

    setInterval(() => {
        const randX = randomInt(0, grid.length - 1);
        const randY = randomInt(0, grid[0].length - 1);
        const randColor = randomFrom(randomColors);

        grid[randX][randY].color = randColor;
        grid[randX][randY].opacity = 1;
    }, 250);

    let prevX = 0;
    let prevY = 0;
    window.addEventListener("mousemove", e => {
        const x = e.clientX;
        const y = e.clientY - ctx.canvas.getBoundingClientRect().top;

        const gridX = Math.floor(x / squareSize);
        const gridY = Math.floor(y / squareSize);

        if (prevX === gridX && prevY === gridY)
            return;

        prevX = gridX;
        prevY = gridY;

        if (!grid[gridX]?.[gridY])
            return;

        grid[gridX][gridY].color = randomFrom(randomColors);
        grid[gridX][gridY].opacity = 1;
        grid[gridX][gridY].decay = 0.05;
    });

    const maxDepth = 3;
    window.addEventListener("mousedown", e => {
        const x = e.clientX;
        const y = e.clientY - ctx.canvas.getBoundingClientRect().top;

        const gridX = Math.floor(x / squareSize);
        const gridY = Math.floor(y / squareSize);

        const traversed: { x: number, y: number }[] = [];

        function effect(x: number, y: number, depth: number) {
            if (depth <= 0)
                return;

            const newSquares = [
                { x: x + 1, y },
                { x, y: y + 1 },
                { x: x - 1, y },
                { x, y: y - 1 },
            ];

            if (depth % 2 === 0)
                newSquares.push(
                    { x: x + 1, y: y + 1 },
                    { x: x + 1, y: y - 1 },
                    { x: x - 1, y: y - 1 },
                    { x: x - 1, y: y + 1 },
                );

            for (const square of newSquares) {
                const gridSquare = grid[square.x]?.[square.y];

                if (!gridSquare || traversed.find(v => v.x === square.x && v.y === square.y))
                    continue;

                grid[square.x][square.y].color = randomFrom(randomColors);
                grid[square.x][square.y].opacity = 1;
                grid[square.x][square.y].decay = 0.05;

                traversed.push(square);

                setTimeout(() => {
                    effect(square.x, square.y, depth - 1);
                }, 75);
            }
        }

        grid[gridX][gridY].color = randomFrom(randomColors);
        grid[gridX][gridY].opacity = 1;
        grid[gridX][gridY].decay = 0.075;

        effect(gridX, gridY, maxDepth);
        // grid[gridX][gridY].color = "#fff";
        // grid[gridX][gridY].opacity = 1;
        // grid[gridX][gridY].decay = 0;
    });
}

function LandingBackground() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const hasInit = useRef(false);

    useEffect(() => {
        if (!canvasRef.current || hasInit.current)
            return;

        canvasRef.current.width = canvasRef.current.clientWidth;
        canvasRef.current.height = canvasRef.current.clientHeight;

        window.addEventListener("resize", () => {
            canvasRef.current!.width = canvasRef.current!.clientWidth;
            canvasRef.current!.height = canvasRef.current!.clientHeight;
        });

        initCanvas(canvasRef.current.getContext("2d")!);

        hasInit.current = true;
    }, [canvasRef.current]);

    return <canvas ref={canvasRef} className="bottom-fade absolute-center w-full h-full motion-reduce:hidden opacity-50" />;
}

export default dynamic(() => Promise.resolve(LandingBackground), { ssr: false });
