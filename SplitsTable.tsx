import { useState, useEffect, useContext } from "react";
import { SplitContext } from "../App"

interface Props {
    orientCourse: string;
}

export const SplitsTable = ({ orientCourse }: Props) => {
    const splitData = useContext(SplitContext);

    const orientCourseIndex = splitData ? splitData.courses.indexOf(orientCourse) : 0;

    const COLUMNS = [
        {Header: 'Place'},
        {Header: 'Runner'},
        splitData?.controls[orientCourseIndex].map((control: string) => (
            {Header: control}
        ))
    ]

    return (
        <div>
            {splitData?.title}
        </div>)
}