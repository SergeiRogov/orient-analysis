import { Link } from "react-router-dom";
import { useState, useEffect } from 'react'

export const Navbar = () => {
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);

    useEffect(() => {
      const handleResize = () => {
        setIsSmallScreen(window.innerWidth <= 768);
      };
  
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    return (
      <div className={`links ${isSmallScreen ? 'vertical' : 'horizontal'}`} style={{ fontFamily: 'Open Sans', fontWeight: 300 }}>
            <Link to="/">Splits</Link>
            <Link to="/graphs">Graphs</Link>
        </div>
    )
}