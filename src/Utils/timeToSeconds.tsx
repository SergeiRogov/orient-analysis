export const timeToSeconds= (time : string) => {
    // Split the time into minutes and seconds
    const [minutes, seconds] = time.split(":").map(Number);
  
    // Calculate the total seconds
    const totalSeconds = minutes * 60 + seconds;
  
    return totalSeconds;
}
