import React, { useState, useEffect, useContext } from 'react'
import { Option } from "../App"
import axios from 'axios'
import { AppContext } from "../App"

interface Props {
    options: Option[];
    orientEvent: string;
    setOrientEvent: React.Dispatch<React.SetStateAction<string>>;
}

export const Dropdown = ({options, orientEvent, setOrientEvent}: Props) => {
    const appContext = useContext(AppContext);

    if (!appContext) {
        // Handle when the context is undefined (optional)
        return <div>Loading...</div>;
    }

    const splitData = appContext;

    const [orientCourse, setOrientCourse] = useState<string>(splitData.courses[0]);
    
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

            { orientEvent &&(
            <div className="CourseMenu">
                <h3>Select a Course:</h3>
                <select 
                    className="form-select" 
                    defaultValue={ orientCourse }
                    onChange={(event) => setOrientCourse(event.target.value)}>
                    {splitData.courses.map((course: string) => (
                        <option>{ course }</option>
                    ))}
                </select>
            </div>
            )}
        </div>
    );
}

export {}