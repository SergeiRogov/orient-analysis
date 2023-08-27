export const getColor = (percentOfBest: number) => {
    const colorRanges = [
        { min: 100, max: 110, color: '#4be116' },      
        { min: 110, max: 120, color: '#86e500' },
        { min: 120, max: 140, color: '#b2e900' }, 
        { min: 140, max: 160, color: '#d8ec01' },
        { min: 160, max: 180, color: '#fbee23' }, 

        { min: 180, max: 210, color: '#ffc400' }, 
        { min: 210, max: 240, color: '#ffc400' }, 
        { min: 240, max: 270, color: '#ff9900' },  
        { min: 270, max: 300, color: '#ff6a1c' }, 
        { min: 300, max: Number.POSITIVE_INFINITY, color: '#f73333' }, 
      ];

      for (const range of colorRanges) {
        if (percentOfBest >= range.min && percentOfBest <= range.max) {
          return range.color;
        }
      }
    
  }