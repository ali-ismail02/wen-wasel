import calculateDistance from "./CalculateDistance";

const isLess = (a, b, c) => {
    return Math.abs(calculateDistance(a, c)) < Math.abs(calculateDistance(b, c));
}

export default isLess;