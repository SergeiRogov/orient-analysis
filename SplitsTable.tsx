import { useState, useEffect, useContext } from "react";
import { SplitContext, OrientCourse, Runner } from "../App"


interface Props {
    orientCourse: OrientCourse;
}

export const SplitsTable = ({ orientCourse }: Props) => {
    const splitData = useContext(SplitContext);

    const orientCourseIndex = splitData ? splitData.courses.indexOf(orientCourse.name) : 0;
    console.log(splitData)
    const COLUMNS = [
        {Header: 'Place'},
        {Header: 'Runner'},
        splitData?.controls[orientCourse.key].map((control: string) => (
            {Header: control}
        ))
    ]
    

    return (
        <div>
            <h4>{splitData?.title}</h4>
            <h4>{splitData?.courses[orientCourse.key]}</h4>
            <h6>{splitData?.controls[orientCourse.key]}</h6>
            {splitData?.runners[orientCourse.key]?.map((runner: Runner) => (
                <h6 key={runner.id}>{runner.name}</h6>
            ))}
        </div>)
}