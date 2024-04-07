// Sample object mapping coordinates to node integers
paths = {
    1: {2: 0.008344323389469933},
    2: {1: 0.008344323389469933, 3: 0.011136547705110002, 5: 0.009132750716852798},
    3: {2: 0.011136547705110002, 4: 0.009175614102171591},
    4: {3: 0.009175614102171591, 5: 0.011049808648029114},
    5: {2: 0.009132750716852798, 4: 0.011049808648029114, 6: 0.007908485012840343},
    6: {5: 0.007908485012840343}
};

const NodeToCoordinates = [
    [ -97.15387406945061, 33.25485939795162 ],
    [ -97.15375011751058, 33.25479742198161 ],
    [ -97.15358493105212, 33.25471436857528 ],
    [ -97.15350361689489, 33.25482843924073 ],
    [ -97.15366789275183, 33.25491032086014 ],
    [ -97.15359717116993, 33.25500830865747 ]
  ];
  
function findNodeByCoordinate(coordinate) {
    for (let i = 0; i < NodeToCoordinates.length; i++) {
        const currentCoordinate = NodeToCoordinates[i];
        if (currentCoordinate[0] === coordinate[0] && currentCoordinate[1] === coordinate[1]) {
            return i + 1; // Return the index plus one to match the node numbering
        }
    }
    return null; // Return null if coordinate is not found in the array
}

// Example usage

// const coordinateToNode = {
//     "[ -97.15387406945061, 33.25485939795162 ]": 1,
//     "[ -97.15375011751058, 33.25479742198161 ]": 2,
//     "[ -97.15358493105212, 33.25471436857528 ]": 3,
//     "[ -97.15350361689489, 33.25482843924073 ]": 4,
//     "[ -97.15366811, 33.25491042 ]": 5,
//     "[ -97.15359717116993, 33.25500830865747 ]": 6
//     // Add more mappings as needed
// };

// // Function to find the integer corresponding to a given coordinate
// function findNodeByCoordinate(coordinate) {
//     //const key = JSON.stringify(coordinate);
//     const key = `[ ${coordinate[0]}, ${coordinate[1]} ]`; 
//     console.log("integer key:",coordinateToNode[key]);
//     return coordinateToNode[key] || null;
// }

// Example usage
// const coordinate = [ -97.15387406945061, 33.25485939795162 ];
// const node = findNodeByCoordinate(coordinate);
// console.log('Node corresponding to coordinate:', node);
