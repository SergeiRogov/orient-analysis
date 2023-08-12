import { useState, useEffect } from "react";
import Canvas from "../components/Canvas"

const BASE_CANVAS_HEIGHT = 400;

export const Graphs = () => {
     
    const [count, setCount] = useState(0);

    useEffect(() => {
        fetch("/").then()
    })

    const drawArt = (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = 'orange'
        ctx.fillRect(0, 0, window.innerWidth, BASE_CANVAS_HEIGHT);
        ctx.fillStyle = 'black'
        ctx.moveTo(10*count, 10*count);
        ctx.lineTo(95, 25);
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    return (
        <>
            <h1>Graphs here</h1>
            <button onClick={() => setCount(count+1)}>Increase</button>
            {count}
            <Canvas draw={drawArt} width={window.innerWidth} height={BASE_CANVAS_HEIGHT}/>
            
        </>
    )
}