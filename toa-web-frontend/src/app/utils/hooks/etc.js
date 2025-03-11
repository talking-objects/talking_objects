export function formatTime(seconds) {
    const totalSeconds = Math.round(seconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secondsLeft = totalSeconds % 60;

    const paddedHours = hours.toString().padStart(2, "0");
    const paddedMinutes = minutes.toString().padStart(2, "0");
    const paddedSeconds = secondsLeft.toString().padStart(2, "0");

    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
}

export const getRandomPlaceHolder = () => {
    const randomList = [
        "/assets/placeholder-playground/placeholder-playground_1.svg",
        "/assets/placeholder-playground/placeholder-playground_2.svg",
        "/assets/placeholder-playground/placeholder-playground_3.svg",
        "/assets/placeholder-playground/placeholder-playground.svg",
      ]
    return randomList[Math.floor(Math.random() * randomList.length)]
}
export const getRandomAniPlaceHolder = () => {
    const randomList = [
        "/assets/loading-animations/placeholder-playground_A.svg",
        "/assets/loading-animations/placeholder-playground-animated_b.svg",
       
      ]
    return randomList[Math.floor(Math.random() * randomList.length)]
}