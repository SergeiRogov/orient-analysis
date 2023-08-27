import React, { useState, useEffect, useContext } from 'react'
import { Option, SplitContext, OrientCourse  } from "../../App"
import "./Dropdown.css"

interface Props {
    options: Option[];
    orientEvent: string;
    setOrientEvent: React.Dispatch<React.SetStateAction<string>>;
    orientCourse: OrientCourse ;
    setOrientCourse: React.Dispatch<React.SetStateAction<OrientCourse>>;
}

export const Dropdown = ({options, orientEvent, setOrientEvent, orientCourse, setOrientCourse}: Props) => {
    const splitData = useContext(SplitContext);

    useEffect(() => {
        if (splitData) {
            const defaultOrientCourse = splitData.courses.length > 0 ? {name: splitData.courses[0], key: 0} : {name: '', key: 0};
            setOrientCourse(defaultOrientCourse);
        } 
    }, [splitData])
    
    return (
        <div className="Event-Course-Menu" style={{ fontFamily: 'Open Sans', fontWeight: 300 }}>
            <div className="Row">
                <h3>Select an event:</h3>
            
                <select 
                    className="form-select"  
                    defaultValue={ orientEvent }
                    onChange={(event) => setOrientEvent(event.target.value)}
                    style={{ flex: 1 }}>
                    {options.map((opt: Option) => (
                        <option value={ opt.value }>{ opt.label }</option>
                    ))}
                </select>
            </div>

            { splitData ? (
            <div className="Row">
                <h3>Select a course:</h3>
                <select 
                    className="form-select" 
                    defaultValue={ orientCourse.name }
                    onChange={(event) => 
                        setOrientCourse({
                            name: event.target.value, 
                            key: splitData.courses.indexOf(event.target.value)
                        })
                    } style={{ flex: 2 }}>
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
