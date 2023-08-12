import React, { useState, useEffect, createContext } from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import './App.css';
import { Navbar } from './components/Navbar';
import { Dropdown } from './components/Dropdown';
import { Graphs } from './pages/Graphs';
import { SplitsTable } from './pages/SplitsTable';
import axios from 'axios';

export interface Option {
  label: string;
  value: string;
}

interface Runner {
  name: string;
  course: string;
  place: number;
  bib: number;
  age_group: string;
  overall_time: string; 
  splits: string[];
}

interface SplitInfo {
  title:string;
  courses:string[];
  controls:string[][];
  runners: Runner[][];
}

// interface AppContext {
//   userId: Option[];
//   username: SplitInfo;
// }

interface OrientCourse {
  name:string;
  key:number;
}

const options: Option[] = [
  { label: 'Kato Drys 19 Jan 2023', value: 'Kato Drys 19 Jan 2023.html' },
  { label: 'Kouris Dam 20 Feb 2023', value: 'Kouris Dam 20 Feb 2023.html' },
  { label: 'Pikni Forest 5 Mar 2023', value: 'Pikni Forest 5 Mar 2023.html' },
  { label: 'Sia 26 Mar 2023', value: 'Sia Mathiatis 26 Mar 2023 splits.html' },
]

export const SplitContext = createContext<SplitInfo | undefined>(undefined);

function App() {

  const [orientEvent, setOrientEvent] = useState<string>(options[options.length - 1].value);
  const [splitData, setSplitData] = useState<SplitInfo | undefined>(undefined);
  const [orientCourse, setOrientCourse] = useState<string>('');

  useEffect(() => {
    // API Gateway endpoint 
    axios.get('https://8cb9vtn6xb.execute-api.eu-west-3.amazonaws.com/Stage1/extract-orienteering-splits', {
        params: {
          'file_to_retrieve': orientEvent
        }
    })
    .then(response => {
      setSplitData(response.data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  }, [orientEvent]);

  return (
    <div className="App">
      <SplitContext.Provider value={ splitData }>
      <Router>
      <Dropdown 
        options={ options } 
        orientEvent={ orientEvent } 
        setOrientEvent={ setOrientEvent }
        orientCourse={ orientCourse }
        setOrientCourse={ setOrientCourse } />
      <Navbar/>
        <Routes>
          <Route path="/" element={<SplitsTable orientCourse={ orientCourse }/>}/>
          <Route path="/graphs" element={<Graphs />}/>
        </Routes>
      </Router>
      </SplitContext.Provider>
    </div>
  );
}

export default App;
