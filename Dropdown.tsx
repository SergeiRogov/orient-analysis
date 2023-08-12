import React, { useState, useEffect, useContext } from 'react'
import { Option, SplitContext } from "../App"

interface Props {
    options: Option[];
    orientEvent: string;
    setOrientEvent: React.Dispatch<React.SetStateAction<string>>;
    orientCourse: string;
    setOrientCourse: React.Dispatch<React.SetStateAction<string>>;

}

export const Dropdown = ({options, orientEvent, setOrientEvent, orientCourse, setOrientCourse}: Props) => {
    const splitData = useContext(SplitContext);

    useEffect(() => {
        if (splitData) {
            const defaultOrientCourse = splitData.courses.length > 0 ? splitData.courses[0] : '';
            setOrientCourse(defaultOrientCourse);
        } 
    }, [splitData])
    
    return (
        <div className="Event-Course-Menu">
            <h3>Select an event:</h3>
            <select 
                className="form-select" 
                defaultValue={ orientEvent }
                onChange={(event) => setOrientEvent(event.target.value)}>
                {options.map((opt: Option) => (
                    <option value={opt.value}>{ opt.label }</option>
                ))}
            </select>

            { splitData ? (
            <div className="CourseMenu">
                <h3>Select a Course:</h3>
                <select 
                    className="form-select" 
                    defaultValue={ orientCourse }
                    onChange={(event) => setOrientCourse(event.target.value)}>
                    {splitData.courses.map((course: string) => (
                        <option key={ course }>{ course }</option>
                    ))}
                </select>
            </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}
