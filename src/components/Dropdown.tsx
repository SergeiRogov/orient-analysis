import React, { useEffect, useContext } from 'react'
import { Option, SplitContext, OrientCourse  } from "../App"
import '../styles/styles.css';

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
            const defaultOrientCourse = splitData.courses.length > 0 ? {name: splitData.courses[0], key: 0} : {name: 'Blue', key: 0};
            setOrientCourse(defaultOrientCourse);
        } 
    }, [splitData])
    
    return (
        <div className="Event-Course-Menu" >

            <div className="label">
                <h4 className="label event" style={{ marginLeft: '10px', marginRight: '10px' }}>Event:</h4>
            </div>

            <select 
                className="form-select"  
                value={ orientEvent }
                onChange={(event) => setOrientEvent(event.target.value)}
                style={{ width: '160px', marginRight: '20px' }}
            >
                {options.map((opt: Option) => (
                    <option value={ opt.value }>{ opt.label }</option>
                ))}
            </select>
            
            
            <div className="label">
                <h4 className="label course" style={{ marginRight: '10px' }}>Course:</h4>
            </div>

            <select 
                className="form-select" 
                value={ orientCourse.name }
                onChange={(event) => 
                    setOrientCourse({
                        name: event.target.value, 
                        key: splitData.courses.indexOf(event.target.value)
                    })
                } style={{ width: '160px' }}
            >
                {splitData.courses.map((course: string) => (
                    <option key={ course }>{ course }</option>
                ))}
            </select>
        
        </div>
    );
}
