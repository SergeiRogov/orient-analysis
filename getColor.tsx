export const getColor = (percentOfBest: number) => {
    const colorRanges = [
        { min: 100, max: 105, color: '#66FF66' },      
        { min: 105, max: 115, color: '#7FFF7F' },
        { min: 115, max: 125, color: '#99FF99' }, 
        { min: 125, max: 135, color: '#B3FFB3' },
        { min: 135, max: 145, color: '#CCFFCC' }, 
        { min: 145, max: 165, color: '#FFFF99' }, 
        { min: 165, max: 185, color: '#FFFF7F' }, 
        { min: 185, max: 205, color: '#FFFF66' },  
        { min: 205, max: 225, color: '#FFFF33' }, 
        { min: 225, max: 255, color: '#FFFF00' }, 
        { min: 255, max: 275, color: '#FFCC00' },  
        { min: 275, max: 295, color: '#FF9900' },   
        { min: 295, max: 315, color: '#FF8000' },
        { min: 315, max: 335, color: '#FF6600' },
        { min: 335, max: 10000000, color: '#FF3300' },   
      ];

      for (const range of colorRanges) {
        if (percentOfBest >= range.min && percentOfBest <= range.max) {
          return range.color;
        }
      }
    
  }