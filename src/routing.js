import path1 from "./path1.js";
import path2 from "./path2.js";
import nearestPointOnLine from '@turf/nearest-point-on-line';
import { lineString, point, distance} from "@turf/turf";

var incre = 1;

// const startRoom = [ -97.15388509288465, 33.25476053520956 ]; // Example point coordinates
// const endRoom = [ -97.15353978483283, 33.254924324421239 ];
export function startRoute(startRoom, endRoom) {
var source = projectPoint(startRoom);
var destination = projectPoint(endRoom);


// The `nearestPoint` variable now contains the nearest point on the MultiLineString to the given point
console.log("source point: ",source.point);
console.log("destination point: ", destination.point);



// const r1 = new mapboxgl.Marker()
// .setLngLat(startRoom)
// .addTo(map);
// Sample point

// Initialize variables to store the closest line and its projection point
function projectPoint(pointToCheck) {
    let closestLine = null;
    let closestProjection = null;
    let minDistance = Infinity;
    // Loop through each feature in your GeoJSON data
    if (pointToCheck.floor == 1) {
    path1.features.forEach(feature => {
        // Check if the feature represents a LineString
        if (feature.geometry.type === 'LineString') {
            // Convert GeoJSON LineString to Turf LineString
            const turfLine = lineString(feature.geometry.coordinates);
            // Find the nearest projection of the sample point on the line
            const nearestPoint = nearestPointOnLine(turfLine, pointToCheck.coordinates);
            // Calculate the distance between the original point and the projection point
            const dis = nearestPoint.properties.dist;
            // Update closestLine and closestProjection if this line's projection is closer
            if (dis < minDistance) {
                minDistance = dis;
                closestLine = turfLine;
                closestProjection = nearestPoint;
            }
        }
    });
}
if (pointToCheck.floor == 2) {
    path2.features.forEach(feature => {
        // Check if the feature represents a LineString
        if (feature.geometry.type === 'LineString') {
            // Convert GeoJSON LineString to Turf LineString
            const turfLine = lineString(feature.geometry.coordinates);
            // Find the nearest projection of the sample point on the line
            const nearestPoint = nearestPointOnLine(turfLine, pointToCheck.coordinates);
            // Calculate the distance between the original point and the projection point
            const dis = nearestPoint.properties.dist;
            // Update closestLine and closestProjection if this line's projection is closer
            if (dis < minDistance) {
                minDistance = dis;
                closestLine = turfLine;
                closestProjection = nearestPoint;
            }
        }
    });
}
    return {point: closestProjection, line: closestLine};
}

function floor1to2(source, f1, destination, f2) {
    var pathFromSource;
    var pathFromDest;
    var minPathCost = Infinity;
    var bestPath1, bestPath2, c1, c2;
    for (var i=0; i<stairsAndElevs.length; i++) {
        console.log(stairsAndElevs[i]);
        var pointOn1 = { coordinates: stairsAndElevs[i], floor: f1};
        var pointOn2 = { coordinates: stairsAndElevs[i], floor: f2};
        var coord1 = projectPoint(pointOn1);
        var coord2 = projectPoint(pointOn2);
        console.log("coord: ", coord1);
        pathFromSource = findRoute(source, coord1);
        pathFromDest = findRoute(coord2, destination);

        if (pathFromSource.dist+pathFromDest.dist < minPathCost) {
            bestPath1 = pathFromSource;
            bestPath2 = pathFromDest;
            c1 = coord1;
            c2 = coord2;
        }
    }
    // const startMarker = new mapboxgl.Marker({ "color": "#b40219" })
    // .setLngLat(c1.point.geometry.coordinates)
    // .addTo(map);

    // const endMarker = new mapboxgl.Marker({ "color": "#b40219" })
    // .setLngLat(c2.point.geometry.coordinates)
    // .addTo(map);
    
    if (bestPath1.path != null) {
        drawRoute(bestPath1.path, source, coord1);
    }
    else {
        console.log("Climb stairs");
    }

    let turnTypeHTML = `<div id="eachturn">
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-120 320-280l56-56 64 63v-414l-64 63-56-56 160-160 160 160-56 57-64-64v414l64-63 56 56-160 160Z"/></svg>
    Next floor </div>`;
    let turnTypeElement = document.createElement('div');
    turnTypeElement.innerHTML = turnTypeHTML;
    document.getElementById('turnbyturn-dir').appendChild(turnTypeElement);

    let continueStraightHTML = `<div id="eachturn">
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-120v-567l-64 63-56-56 160-160 160 160-56 56-64-63v567h-80Z"/></svg>
    Continue straight </div>`;
    let continueStraightElement = document.createElement('div');
    continueStraightElement.innerHTML = continueStraightHTML;
    document.getElementById('turnbyturn-dir').appendChild(continueStraightElement);

    if (bestPath2.path != null) {
        drawRoute(bestPath2.path, coord2, destination);
    }
    else {
        console.log("Continue straight");
    }
    // drawRoute(bestPath1.path);
    console.log("final path is: ", bestPath1.path);
    console.log("cont: ", bestPath2.path);
    // drawRoute(bestPath2.path);
}

// function samePathLine(p1, p2) {
//     addPathsLayer(p1.point.geometry.coordinates, p2.point.geometry.coordinates);
// }

function findRoute(source, destination) {
    
    var bestPathCost = Infinity;
    var bestPath = [];

    if (source.line.geometry.coordinates == destination.line.geometry.coordinates) {
        addPathsLayer(source.point.geometry.coordinates, destination.point.geometry.coordinates);
        return { path: null, dist: 0 };
    }

    for (var i=0; i<2; i++){
        for (var j=0; j<2; j++) {
            //console.log(findNodeByCoordinate(source.line.geometry.coordinates[i]));
            //console.log(findNodeByCoordinate(destination.line.geometry.coordinates[j]));
            var result = dijkstra(paths, String(findNodeByCoordinate(source.line.geometry.coordinates[i])), String(findNodeByCoordinate(destination.line.geometry.coordinates[j])));
            //console.log("cost is: ", result.totalCost);
            if (result.totalCost < bestPathCost) {
                bestPathCost = result.totalCost;
                bestPath = result.shortestPath;
            }
        }
    }
    //console.log("final path is: ", bestPath);
    return { path: bestPath, dist: bestPathCost};
}



// Output the closest projection point
// console.log('Closest projection point:', closestProjection);
//console.log('Destination line: ', destination.line);

// const startMarker = new mapboxgl.Marker()
// .setLngLat(source.point.geometry.coordinates)
// .addTo(map);

// const endMarker = new mapboxgl.Marker()
// .setLngLat(destination.point.geometry.coordinates)
// .addTo(map);

window.layerids = [];
function addPathsLayer(point1, point2) {

    var layerid = String(incre);

    map.addLayer({
        "id": layerid,
        "type": "line",
        "source": {
            "type": "geojson",
            "data": {
                "type": "Feature", // GeoJSON feature type
                "geometry": {
                    "type": "LineString",
                    "coordinates": [point1, point2]
                }
            }
        },
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
            "line-color": "#0066ff", // Adjust color as needed
            "line-width": 8 // Adjust width as needed
        }
    });

    //console.log('Paths layer added to the map.');
    layerids.push(layerid);
    incre++;
    return layerid;
}


function removeLayer(layerid) {
    if (map.getLayer(layerid)) { // Check if the layer exists
        map.removeLayer(layerid); // Remove the layer
    }
}

// Function to handle paths layer loading
function handlePathsLayer(point1, point2) {
    //console.log("p1: ", point1);
    //console.log("p2: ", point2);
    if (map.loaded()) {
        // Map has finished loading, add paths layer
        const layerid = addPathsLayer(point1, point2);

    } else {
        // Map is still loading, wait for load event
        map.on('load', () => {
            // Map has finished loading, add paths layer
            const layerid = addPathsLayer(point1, point2);

        });
    }
    addPathsLayer(point1, point2);
}


function drawRoute(path, source, destination) {
    //int startNode = 1;
    var firstLoop = 1;
    var bearing1, bearing2;

    for (var i=0; i<path.length; i++) {
        //console.log("i is: ", i);
        if (firstLoop == 1) {
            var point1 = source.point.geometry.coordinates;
            var point2 = NodeToCoordinates[(parseInt(path[i]-1))];
            handlePathsLayer(point1, point2);
            bearing1 = calculateBearing(point1, point2);
            point1 = point2;
            if (path.length == 1) {
                point2 = destination.point.geometry.coordinates;
            }
            else {
                point2 = NodeToCoordinates[(parseInt(path[i+1]-1))];
            }
            bearing2 = calculateBearing(point1,point2);
            firstLoop = 0;
            i--;
        }
        else if (i == (path.length-1)) {
            var point1 = NodeToCoordinates[(parseInt(path[i])-1)];
            var point2 = destination.point.geometry.coordinates;
            bearing1 = bearing2;
            bearing2= calculateBearing(point1, point2);
            handlePathsLayer((point1), point2);
        }
        else {
            var point1 = NodeToCoordinates[(parseInt(path[i]-1))];
            var point2 = NodeToCoordinates[(parseInt(path[i+1]-1))];
            handlePathsLayer(point1, point2);
            bearing1 = bearing2;
            bearing2 = calculateBearing(point1, point2);
        }
        var angle = bearing1-bearing2;

        displayTurnbyTurn(angle);

    }
    
}


var finalPath;
if (startRoom.floor != endRoom.floor) {
    finalPath = floor1to2(source, startRoom.floor, destination, endRoom.floor);
}
else {
    finalPath = findRoute(source, destination);
    drawRoute(finalPath.path, source, destination);
}


// Event listener for back button click
document.getElementById('backbutton').addEventListener('click', function() {
    layerids.forEach(layerId => {
        removeLayer(layerId); // Remove each layer
    });
    const turnByTurnDivs = document.querySelectorAll('#turnbyturn-dir #eachturn');
    turnByTurnDivs.forEach(div => {
        div.remove(); // Remove each div
    });
});

// displayTurnbyTurn function
function displayTurnbyTurn(angle) {
    const turnType = determineTurnType(angle);
    const turnTypeHTML = `<div id="eachturn">${getSVGForTurnType(turnType)} ${turnType}</div>`;
    const turnTypeElement = document.createElement('div');
    turnTypeElement.innerHTML = turnTypeHTML;
    document.getElementById('turnbyturn-dir').appendChild(turnTypeElement);
}


// Function to get SVG based on turn type
function getSVGForTurnType(turnType) {
    if (turnType === 'Continue straight') {
        return `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-120v-567l-64 63-56-56 160-160 160 160-56 56-64-63v567h-80Z"/></svg>`;
    } else if (turnType === 'Turn left') {
        return `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M600-160v-360H272l64 64-56 56-160-160 160-160 56 56-64 64h328q33 0 56.5 23.5T680-520v360h-80Z"/></svg>`;
    } else {
        return `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-160v-360q0-33 23.5-56.5T360-600h328l-64-64 56-56 160 160-160 160-56-56 64-64H360v360h-80Z"/></svg>`;
    }
}


}

export function projectLiveCoordinates(pointToCheck) {
    let closestLine = null;
    let closestProjection = null;
    let minDistance = Infinity;
    // Loop through each feature in your GeoJSON data
    if (pointToCheck.floor == 1) {
    path1.features.forEach(feature => {
        // Check if the feature represents a LineString
        if (feature.geometry.type === 'LineString') {
            // Convert GeoJSON LineString to Turf LineString
            const turfLine = lineString(feature.geometry.coordinates);
            // Find the nearest projection of the sample point on the line
            const nearestPoint = nearestPointOnLine(turfLine, pointToCheck.coordinates);
            // Calculate the distance between the original point and the projection point
            const dis = nearestPoint.properties.dist;
            // Update closestLine and closestProjection if this line's projection is closer
            if (dis < minDistance) {
                minDistance = dis;
                closestLine = turfLine;
                closestProjection = nearestPoint;
            }
        }
    });
}
if (pointToCheck.floor == 2) {
    path2.features.forEach(feature => {
        // Check if the feature represents a LineString
        if (feature.geometry.type === 'LineString') {
            // Convert GeoJSON LineString to Turf LineString
            const turfLine = lineString(feature.geometry.coordinates);
            // Find the nearest projection of the sample point on the line
            const nearestPoint = nearestPointOnLine(turfLine, pointToCheck.coordinates);
            // Calculate the distance between the original point and the projection point
            const dis = nearestPoint.properties.dist;
            // Update closestLine and closestProjection if this line's projection is closer
            if (dis < minDistance) {
                minDistance = dis;
                closestLine = turfLine;
                closestProjection = nearestPoint;
            }
        }
    });
}
    return closestProjection.geometry.coordinates;
}
