import React, { useState, useEffect, createContext } from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import './App.css';
import { Navbar } from './components/Navbar';
import { Graphs } from './pages/Graphs';
import { SplitsTable } from './pages/SplitsTable';
import axios from 'axios';
import { Dropdown,  } from './components/Dropdown';

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

interface Props {
  title:string;
  courses:string[];
  controls:string[][];
  runners: Runner[][];
}

// interface Splits {
//   data: Props;
// }

const options: Option[] = [
  { label: 'Kato Drys 19 Jan 2023', value: 'Kato Drys 19 Jan 2023.html' },
  { label: 'Kouris Dam 20 Feb 2023', value: 'Kouris Dam 20 Feb 2023.html' },
  { label: 'Pikni Forest 5 Mar 2023', value: 'Pikni Forest 5 Mar 2023.html' },
  { label: 'Sia 26 Mar 2023', value: 'Sia Mathiatis 26 Mar 2023 splits.html' },
]

export const AppContext = createContext<Props | undefined>(undefined);

function App() {

  const [orientEvent, setOrientEvent] = useState<string>(options[options.length - 1].value);
  const [splitData, setSplitData] = useState<Props | undefined>(undefined);
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
      <AppContext.Provider value={ splitData }>
      <Router>
      <Dropdown options={options} setOrientEvent={setOrientEvent} />
      <Navbar/>
        <Routes>
          <Route path="/" element={<SplitsTable />}/>
          <Route path="/graphs" element={<Graphs />}/>
        </Routes>
      </Router>
      </AppContext.Provider>
    </div>
  );
}

export default App;
