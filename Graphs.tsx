import { useState, useEffect, useContext, useRef } from "react";
import { SplitContext, OrientCourse, Runner } from "./../App"
import Canvas from "../components/Canvas"
import { CheckBoxes } from "../components/checkboxes/CheckBoxes"
import { useCheckBoxContext } from '../components/checkboxes/CheckboxContext';
import { divideSegment } from "../Utils/divideSegment"

const CANVAS_HEIGHT = 400;
const CANVAS_WIDTH = 900;

interface Props {
    orientCourse: OrientCourse;
}

export const Graphs = ({ orientCourse }: Props) => {
    const splitData = useContext(SplitContext);

    const { selectedRunners } = useCheckBoxContext();

    // control coordinates 
    const bestSplits = splitData.controls[orientCourse.key].map((_ , index) => {
        return splitData.runners[orientCourse.key].reduce((minValue, runner) => {
            const splitTime = runner?.splits?.[index]?.[5];
            return splitTime !== undefined ? Math.min(minValue, splitTime) : minValue;
        }, Infinity);
    });

    const runnersToDisplay = splitData.runners[orientCourse.key].filter(
        runner => selectedRunners[orientCourse.key].includes(runner.id)
    );

    const verticalLinesCoordinates = divideSegment(bestSplits, CANVAS_WIDTH)

    useEffect(() => {
        
    }, [orientCourse]);

    const drawGraph = (ctx: CanvasRenderingContext2D) => {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // Clear the canvas

        ctx.fillStyle = 'orange'
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);


        verticalLinesCoordinates.forEach((x: number) => {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, CANVAS_HEIGHT);
        });

        ctx.fillStyle = 'black'
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    return (
        <>           
            <h4>{splitData.title + " " + orientCourse.name}</h4>
            {/* {runnersToDisplay.map((runner) => runner.name)} */}
            {bestSplits.map((split) => split + " ")}
            <CheckBoxes 
                orientCourse={ orientCourse }/>
            <Canvas draw={(ctx) => drawGraph(ctx)} orientCourse={orientCourse} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}/>
        </>
    )
}