export const divideSegment = (numbers: number[], width: number) => {
    const sum = numbers.reduce((total, num) => total + num, 0);
    const proportionalParts = numbers.map(num => (num / sum) * width);
    
    const ranges = [];
    let startPoint = 0;
    ranges.push(0)
    for (const part of proportionalParts) {
        const endPoint = startPoint + part;
        ranges.push(endPoint);
        startPoint = endPoint;
    }
    
    return ranges;
}