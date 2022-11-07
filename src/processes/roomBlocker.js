function LLCBlocking(LLCInfo, floorplan, upperMaleLLC, upperFemaleLLC, lowerMaleLLC, lowerFemaleLLC) {
    // 1. Iterate for each LLCInfo key
    //      a. Check floor and access floorplan[key]
    //      b. Iterate for each person in each list ex. upperMale[key] and fill a room with that group
    // 2. If a list is exhausted fill with remaining groups

    for(LLCName in LLCInfo) { // Iterate for each LLC from user input.
        let floorNum = LLCInfo[LLCName]; // Assuming LLC info is obj like: "LLCName": "Floor Number"

        for(room in floorplan[floorNum]["rooms"]) { // Iterates for each room on the floor given for current LLC.
            let counter = 0
            //roomies = []
            roomSize = [floorplan][floor]["rooms"][room]["size"]; // Retrieves the room size for current room.
            for(let i = 0; i < (roomSize / 2); i++) { // Iterates for each room spot to add students as pairs.
                // use counter to decide which student group to operate on.
                
            }
            counter += 1; 
        }
    }
}


function totalStudentsForEachLLC(uM, uF, lM, lF) {
    let LLCTotalStudents = {};
    for (LLC of uM) {
        LLCTotalStudents[LLC] = uM[LLC].length + uF[LLC].length + lM[LLC].length + lF[LLC].length;
    }   
    return LLCTotalStudents; 
}

function totalStudentsForEachFloor(uM, uF, lF, lM) {
    let floorNumberTotalStudents = {};
    for (Floor of uF) {
        FloorNumberTotalStudents[Floor] = uF[Floor].length + uM[Floor].length + lF[Floor].length + lM[Floor].length;
    }
    return floorNumberTotalStudents;
}  

module.exports = {
    LLCBlocking
  };
