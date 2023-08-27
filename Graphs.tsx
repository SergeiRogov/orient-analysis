import { useState, useEffect, useContext, useRef } from "react";
import { SplitContext, OrientCourse, Runner } from "./../App"
import Canvas from "../components/Canvas"
import { CheckBoxes } from "../components/checkboxes/CheckBoxes"
import { useCheckBoxContext } from '../components/checkboxes/CheckboxContext';
import { divideSegment } from "../Utils/divideSegment"
import { secondsToTime } from "../Utils/secondsToTime"

const CANVAS_HEIGHT = 500;
const CANVAS_WIDTH = 800;

const MARGIN_TOP = 40;
const MARGIN_BOTTOM = 40;
const MARGIN_LEFT = 50;
const MARGIN_RIGHT = 40;

const BEHIND_LINES_COUNT = 10;

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

    useEffect(() => {
        
    }, [orientCourse]);

    const lineColors = ['red', 'blue', 'green', 'purple', 'orange'];

    const drawGraph = (ctx: CanvasRenderingContext2D) => {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // Clear the canvas

        const graphWidth = CANVAS_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
        const graphHeight = CANVAS_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM;

        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        // control coordinates 
        const verticalLinesCoordinates = divideSegment(bestSplits, graphWidth)
        
        ctx.strokeStyle = 'grey';
        ctx.lineWidth = 1;
        // control vertical lines
        verticalLinesCoordinates.forEach((x: number) => {
            ctx.beginPath();
            ctx.moveTo(x + MARGIN_LEFT, MARGIN_TOP);
            ctx.lineTo(x + MARGIN_LEFT, MARGIN_TOP + graphHeight);
            ctx.stroke();
        });

        ctx.fillStyle = 'black';
        ctx.font = '11px Arial';
        verticalLinesCoordinates.slice(1).forEach((x: number, index: number) => {
            ctx.fillText(
                index === verticalLinesCoordinates.length - 2 ? "F" : (index + 1).toString() , 
                x + MARGIN_LEFT, 
                graphHeight + MARGIN_TOP + 20);
        });

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;

        // top horizontal border
        ctx.beginPath();
        ctx.moveTo(MARGIN_LEFT, MARGIN_TOP);
        ctx.lineTo(MARGIN_LEFT + graphWidth, MARGIN_TOP);
        ctx.stroke();

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 6;

        // bottom horizontal border
        ctx.beginPath();
        ctx.moveTo(MARGIN_LEFT, MARGIN_TOP + graphHeight);
        ctx.lineTo(MARGIN_LEFT + graphWidth, MARGIN_TOP + graphHeight);
        ctx.stroke();

        // left vertical border
        ctx.beginPath();
        ctx.moveTo(MARGIN_LEFT, MARGIN_TOP);
        ctx.lineTo(MARGIN_LEFT, MARGIN_TOP + graphHeight);
        ctx.stroke();
        
        // right vertical border
        ctx.beginPath();
        ctx.moveTo(MARGIN_LEFT + graphWidth, MARGIN_TOP);
        ctx.lineTo(MARGIN_LEFT + graphWidth, MARGIN_TOP + graphHeight);
        ctx.stroke();

        ctx.strokeStyle = 'grey';
        ctx.lineWidth = 1;
        const interval = graphHeight / BEHIND_LINES_COUNT;
        const timeInterval = maxBehind/BEHIND_LINES_COUNT;
        // 'behind' horizontal lines
        for(let i = 0; i <= 10; i++){
            ctx.beginPath();
            ctx.moveTo(MARGIN_LEFT, i*interval + MARGIN_TOP);
            ctx.lineTo(MARGIN_LEFT + graphWidth, i*interval + MARGIN_TOP);
            ctx.stroke();
            ctx.fillStyle = 'black';
            ctx.font = '11px Arial';
            ctx.fillText('+' + secondsToTime(Math.floor(i*timeInterval)).toString(), MARGIN_LEFT/10, i*interval + MARGIN_TOP + 5);
        }

        // runners
        ctx.lineWidth = 2;
        runnersToDisplay.forEach((runner: Runner, runnerIndex) => {
            const colorIndex = runnerIndex % lineColors.length;
            ctx.strokeStyle = lineColors[colorIndex];
            let startY = 0;
            runner.splits.forEach((split, index) => {
                ctx.beginPath();
                ctx.moveTo(verticalLinesCoordinates[index] + MARGIN_LEFT, startY + MARGIN_TOP);
                const behindBestCumul = split[6] - bestCumulSelected[index];
                const Ycoordinate = behindBestCumul / maxBehind * graphHeight;
                ctx.lineTo(verticalLinesCoordinates[index+1] + MARGIN_LEFT, Ycoordinate + MARGIN_TOP);
                startY = Ycoordinate;
                ctx.stroke();

                // Draw a small circle at the data point
                ctx.beginPath();
                ctx.arc(verticalLinesCoordinates[index + 1] + MARGIN_LEFT, Ycoordinate + MARGIN_TOP, 3, 0, Math.PI * 2);
                ctx.fillStyle = lineColors[colorIndex];
                ctx.fill();
            })
        })
        ctx.restore();
    }

    return (
<div style={{ position: 'relative', display: 'flex' }}>
        <div style={{ position: 'absolute', width: '400px', height: '100%', top: 0 }}>
                <CheckBoxes orientCourse={ orientCourse }/>
            </div>
            <div style={{ marginLeft: '300px' }}>
                <Canvas draw={(ctx) => drawGraph(ctx)} orientCourse={orientCourse} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}/>
            </div>
        </div>
      
    )
}