export const getColor = (percentOfBest: number) => {
    const colorRanges = [
        { min: 100, max: 110, color: '#4be116' },      
        { min: 110, max: 120, color: '#8ae100' },
        { min: 120, max: 140, color: '#b7e100' }, 
        { min: 140, max: 160, color: '#dddf00' },
        { min: 160, max: 180, color: '#ffdc00' }, 

        { min: 180, max: 210, color: '#ffbe00' }, 
        { min: 210, max: 240, color: '#ff9f00' }, 
        { min: 240, max: 270, color: '#ff7e0c' },  
        { min: 270, max: 300, color: '#ff5c23' }, 
        { min: 300, max: Number.POSITIVE_INFINITY, color: '#f73333' }, 
      ];

      for (const range of colorRanges) {
        if (percentOfBest >= range.min && percentOfBest <= range.max) {
          return range.color;
        }
      }
  }