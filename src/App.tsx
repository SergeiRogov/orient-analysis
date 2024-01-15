import { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Navbar } from './components/Navbar';
import { Dropdown } from './components/Dropdown';
import { Graphs } from './pages/Graphs';
import { SplitsTable } from './pages/SplitsTable/SplitsTable';
import { CheckBoxProvider } from './components/checkboxes/CheckboxContext';
import axios from 'axios';
import CyprusOrienteeringLogo from './styles/CyprusOrienteeringLogo.png';
import './styles/styles.css';
import './App.css';

export interface Option {
  label: string;
  value: string;
}

export interface Runner {
  name: string;
  course: string;
  place: string;
  bib: string;
  age_group: string;
  overall_time: string; 
  splits: [string, number, number, number, number, number, number, string, string][]; 
  id: number;
}

interface SplitInfo {
  title: string;
  courses: string[];
  controls: string[][];
  runners: Runner[][];
}

export interface OrientCourse {
  name: string;
  key: number;
}

const options: Option[] = [
  { label: 'Kato Drys 19 Jan 2023', value: 'HTML Kato Drys 22 Jan 23 splits.html' },
  { label: 'Kouris Dam 20 Feb 2023', value: 'HTML Kouris 26 Feb 23 Splits.html' },
  { label: 'Pikni Forest 5 Mar 2023', value: 'HTML - Pikni Forest 05 Mar 23 Splits.html' }, 
  { label: 'Sia 26 Mar 2023', value: 'Sia Mathiatis 26 Mar 2023 splits.html' },
  { label: 'Palechori 7 May 2023', value: 'HTML - Palechori 07 May 23 splits.html' },
  { label: 'Olympus 16 June 2023', value: 'HTML - Mt Olympus 16 June 2023 splits.html' },
  { label: 'Troodos 16 Jul 2023', value: 'HTML Troodos 16 Jul 23 splits.html' }, 
  { label: 'Piale Pasha 19 Aug 2023', value: 'HTML - Piale Pasha 19 Aug 23 splits.html' }, 
  { label: 'Kalavasos 30 Sep 2023', value: 'Kalavasos30_09_23splits.html' }, 
  { label: 'Souni 22 Oct 2023', value: 'Souni splits as HTML.html' }, 
  { label: 'Delikipos 3 Dec 2023', value: 'Splits Championships 2023.html'}, 
]

export const SplitContext = createContext<SplitInfo>(undefined!);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [orientEvent, setOrientEvent] = useState<string>(options[options.length - 1].value);
  const [splitData, setSplitData] = useState<SplitInfo>(undefined!);
  const [orientCourse, setOrientCourse] = useState<OrientCourse>({name:'Blue', key: 0});

  useEffect(() => {
    setIsLoading(true);

    // API Gateway endpoint 
    axios.get('https://8cb9vtn6xb.execute-api.eu-west-3.amazonaws.com/Stage1/extract-orienteering-splits', {
        params: {
          'file_to_retrieve': orientEvent
        }
    })
    .then(response => {
      setSplitData(response.data);
      setIsLoading(false);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    });
  }, [orientEvent]);

  return (
    <div>

      {isLoading ? (

        <div className="loading-container" 
          style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
          <img src={ CyprusOrienteeringLogo } alt="Spinning" className="spinning-image" 
            style={{
            width: "140px",
            height: "140px",
          }} />
        </div>

      ) : (

        <div className="App">
          
          {splitData ? (
            
            <SplitContext.Provider value={ splitData }>
            <CheckBoxProvider numOfCourses={splitData ? splitData.controls?.length : 1}>
            <Router basename="/">
            <div className="upper-part">

              <div className="left-content">

                <div className="dropdown">
                  <Dropdown 
                      options={ options } 
                      orientEvent={ orientEvent } 
                      setOrientEvent={ setOrientEvent }
                      orientCourse={ orientCourse }
                      setOrientCourse={ setOrientCourse } 
                      />
                </div>

                <div className="navbar">
                  <Navbar />
                </div>

              </div>

                <div className="logo">
                  <img
                    src={CyprusOrienteeringLogo}
                    alt="Logo"
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: "100px", // Width of the logo
                      height: "auto", // Maintain aspect ratio
                    }}
                  />
                </div>

            </div>
              <Routes>
                <Route path="/" element={<SplitsTable orientCourse={ orientCourse } isLoading={isLoading} />}/>
                <Route path="/graphs" element={<Graphs orientCourse={ orientCourse }/>}/>
              </Routes>
            </Router>
            </CheckBoxProvider>
            </SplitContext.Provider>
            
          ) : (
            <p>Data is not available</p> // Render a message when splitData is undefined
          )}
        </div>
      )}
    </div>
  );
}

export default App;
