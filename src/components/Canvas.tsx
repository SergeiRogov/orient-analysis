import React, { useEffect, useRef } from "react";
import { OrientCourse } from "./../App"

type CanvasProps = React.DetailedHTMLProps<
    React.CanvasHTMLAttributes<HTMLCanvasElement>, 
    HTMLCanvasElement> 
    & {draw: (context: CanvasRenderingContext2D) => void};

type ExtendedCanvasProps = CanvasProps & {
    orientCourse: OrientCourse;
    };

const Canvas: React.FC<ExtendedCanvasProps> = ({ draw, orientCourse, ...props }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if(!canvas) {
            return;
        }
        const ctx = canvas.getContext('2d');
        if(!ctx) {
            return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw(ctx);
    }, [draw, orientCourse]);

    return <canvas 
        width={props.width} 
        height={props.height} 
        ref = { canvasRef }
    />
}

export default Canvas;
