import React, { useState, useEffect, createContext } from 'react'
import { Option } from "../App"
import axios from 'axios'

interface Props {
    options: Option[];
    setOrientEvent: React.Dispatch<React.SetStateAction<string>>;
}

export const Dropdown = ({options, setOrientEvent}: Props) => {
    return (
        <div className="menu">
            <div className="menu">
                <h3>Choose event:</h3>
                <select 
                    className="form-select" 
                    defaultValue={options[options.length - 1].value}
                    onChange={(event) => setOrientEvent(event.target.value)}>
                    {options.map((opt: Option) => (
                        <option value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>
        </div>
    )
}

export {}