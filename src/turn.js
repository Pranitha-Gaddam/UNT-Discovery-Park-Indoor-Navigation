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
    if (angle > 180) {
        angle = angle - (360);
    }
    if (angle <= 10 && angle >= -10) {
        return "Continue straight";
    }
    else if (angle>80 && angle<=100) {
        return "Turn left";
    }
    else if (angle<=-80 && angle>=-100) {
        return "Turn right";
    }
}

// const turnByTurnDirections = generateTurnByTurnDirections(geoRoute);
// console.log(turnByTurnDirections);
