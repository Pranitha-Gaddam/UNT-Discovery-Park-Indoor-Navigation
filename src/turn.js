// Function to calculate the bearing between two geographical points
function calculateBearing(point1, point2) {
    const lat1 = point1[1] * Math.PI / 180;
    const lon1 = point1[0] * Math.PI / 180;
    const lat2 = point2[1] * Math.PI / 180;
    const lon2 = point2[0] * Math.PI / 180;

    const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

    let bearing = Math.atan2(y, x) * 180 / Math.PI;
    bearing = (bearing + 360) % 360; // Normalize to 0-360 degrees
    return bearing;
}


function determineTurnType(angle) {
    if (angle <= 10 && angle >= -10) {
        console.log("Continue straight");
    }
    else if (angle>80 && angle<=100) {
        console.log("Turn left");
    }
    else if (angle<=-80 && angle>=-100) {
        console.log("Turn right");
    }
}


// Function to generate turn-by-turn directions
function generateTurnByTurnDirections(route) {
    const turnByTurnDirections = [];
    for (let i = 0; i < route.length - 2; i++) {
        const bearing1 = calculateBearing(route[i], route[i + 1]);
        const bearing2 = calculateBearing(route[i + 1], route[i + 2]);
        const angle = calculateAngle(bearing1, bearing2);
        const turnType = determineTurnType(angle);
        turnByTurnDirections.push(turnType);
    }
    return turnByTurnDirections;
}

// Example usage:
const geoRoute = [
    [-97.15387406945061, 33.25485939795162],
    [-97.15375011751058, 33.25479742198161],
    [-97.15358493105212, 33.25471436857528],
    // Add more points as per your route
];

// const turnByTurnDirections = generateTurnByTurnDirections(geoRoute);
// console.log(turnByTurnDirections);
