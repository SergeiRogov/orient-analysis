import { useState, useEffect, useContext, useRef } from "react";
import { SplitContext, OrientCourse, Runner } from "./../App"
import Canvas from "../components/Canvas"
import { CheckBoxes } from "../components/checkboxes/CheckBoxes"
import { useCheckBoxContext } from '../components/checkboxes/CheckboxContext';
import { divideSegment } from "../Utils/divideSegment"

const CANVAS_HEIGHT = 500;
const CANVAS_WIDTH = 900;

const MARGIN_TOP = 20;
const MARGIN_BOTTOM = 40;
const MARGIN_LEFT = 40;
const MARGIN_RIGHT = 20;

interface Props {
    orientCourse: OrientCourse;
}

export const Graphs = ({ orientCourse }: Props) => {
    const splitData = useContext(SplitContext);

    const { selectedRunners } = useCheckBoxContext();

    const bestSplits = splitData.controls[orientCourse.key].map((_ , index) => {
        return splitData.runners[orientCourse.key].reduce((minValue, runner) => {
            const splitTime: number = runner?.splits?.[index]?.[5];
            return splitTime !== undefined ? Math.min(minValue, splitTime) : minValue;
        }, Infinity);
    });

    const runnersToDisplay = splitData.runners[orientCourse.key].filter(
        runner => selectedRunners[orientCourse.key].includes(runner.id)
    );

    const bestCumulSelected = splitData.controls[orientCourse.key].map((_ , index) => {
        return runnersToDisplay.reduce((minValue, runner) => {
            const cumulTime: number = runner?.splits?.[index]?.[6];
            return cumulTime !== undefined ? Math.min(minValue, cumulTime) : minValue;
        }, Infinity);
    });

    const worstCumulSelected = splitData.controls[orientCourse.key].map((_ , index) => {
        return runnersToDisplay.reduce((maxValue, runner) => {
            const cumulTime = runner?.splits?.[index]?.[6];
            return cumulTime !== undefined ? Math.max(maxValue, cumulTime) : maxValue;
        }, -Infinity); // Initialize with negative infinity
    });

    const differences = splitData.controls[orientCourse.key].map((runner, index) => {
        return worstCumulSelected[index] - bestCumulSelected[index]
    });

    const maxBehind = Math.max(...differences);

    // control coordinates 
    const verticalLinesCoordinates = divideSegment(bestSplits, CANVAS_WIDTH)

    useEffect(() => {
        
    }, [orientCourse]);

    const lineColors = ['red', 'blue', 'green', 'purple', 'orange'];

    const drawGraph = (ctx: CanvasRenderingContext2D) => {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // Clear the canvas

        const graphWidth = CANVAS_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
        const graphHeight = CANVAS_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM;

        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;

        // top horizontal border
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(CANVAS_WIDTH, 0);
        ctx.stroke();

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 6;

        // bottom horizontal border
        ctx.beginPath();
        ctx.moveTo(0, CANVAS_HEIGHT);
        ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.stroke();

        // left vertical border
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, CANVAS_HEIGHT);
        ctx.stroke();
        
        // right vertical border
        ctx.beginPath();
        ctx.moveTo(CANVAS_WIDTH, 0);
        ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.stroke();

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        // control vertical lines
        verticalLinesCoordinates.forEach((x: number) => {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, CANVAS_HEIGHT);
            ctx.stroke();
        });

        ctx.lineWidth = 2;
        runnersToDisplay.forEach((runner: Runner, runnerIndex) => {
            const colorIndex = runnerIndex % lineColors.length;
            ctx.strokeStyle = lineColors[colorIndex];
            let startY = 0;
            runner.splits.forEach((split, index) => {
                ctx.beginPath();
                ctx.moveTo(verticalLinesCoordinates[index], startY);
                const behindBestCumul = split[6] - bestCumulSelected[index];
                const Ycoordinate = behindBestCumul / maxBehind * CANVAS_HEIGHT;
                ctx.lineTo(verticalLinesCoordinates[index+1], Ycoordinate);
                startY = Ycoordinate;
                ctx.stroke();

                // Draw a small circle at the data point
                ctx.beginPath();
                ctx.arc(verticalLinesCoordinates[index + 1], Ycoordinate, 3, 0, Math.PI * 2);
                ctx.fillStyle = lineColors[colorIndex];
                ctx.fill();
            })
            
        })
        ctx.restore();
    }

    return (
        <>           
            <h4>{splitData.title + " " + orientCourse.name}</h4>
            <CheckBoxes orientCourse={ orientCourse }/>
            <Canvas draw={(ctx) => drawGraph(ctx)} orientCourse={orientCourse} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}/>
        </>
    )
}