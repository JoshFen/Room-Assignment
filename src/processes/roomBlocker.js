function LLCBlocking(LLCInfo, blueprint, upperMalePairs, upperFemalePairs, lowerMalePairs, lowerFemalePairs) {
    // 1. Iterate for each LLCInfo key
    //      a. Check floor and access floorplan[key]
    //      b. Iterate for each person in each list ex. upperMale[key] and fill a room with that group
    // 2. If a list is exhausted fill with remaining groups

    for(LLCName in LLCInfo) { // Iterate for each LLC from user input.
        let floorNum = LLCInfo[LLCName]; // Assuming LLC info is obj like: "LLCName": "Floor Number"

        for(room in blueprint[floorNum]["rooms"]) { // Iterates for each room on the floor given for current LLC.
            if( blueprint[floorNum]["roommates"].length < 1) { // Checks if the room has students already (RA assignment).
                let counter = 1;
                roomies = [] // Each array will hold the roomates to fill an entire room.
                roomSize = blueprint[floor]["rooms"][room]["size"]; // Retrieves the room size for current room.
                while(upperMalePairs["LLC"][LLCName].length > 0 || upperFemalePairs["LLC"][LLCName].length > 0 || lowerMalePairs[LLCName]["LLC"].length > 0 || lowerFemalePairs[LLCName]["LLC"].length > 0 ) {
                    for(let i = 0; i < (roomSize / 2); i++) { // Iterates for each room spot to add students as pairs.
                        // use counter to decide which student group to operate on.
                        let unassigned = true;
                        while(unassigned) {// NEEDS TO STOP WHEN LISTS ARE EMPTY
                            if(counter % 4 == 0) {
                                if(lowerFemalePairs["LLC"][LLCName] > 0) {
                                    //ASSIGN POPO TENANT
                                    roomies.push(lowerFemalePairs["LLC"][LLCName].pop());
                                    unassigned = false;
                                }
                                else if(i > 0) {
                                    if(upperFemalePairs["LLC"][LLCName].length > 0) {
                                        counter += 2;
                                    }
                                    else {
                                        break; // The remained of the room will be empty.
                                    }
                                }
                                else {
                                    counter += 1; // Goes to upper male.
                                }
                            }
                            else if(counter % 3 == 0) {
                                if(lowerMalePairs["LLC"][LLCName].length > 0) {
                                    roomies.push(lowerMalePairs["LLC"][LLCName].pop());
                                    unassigned = false;
                                }
                                else if(i > 0) {
                                    if(upperMalePairs["LLC"][LLCName].length > 0) {
                                        counter += 2;
                                    }
                                    else {
                                        break; // The remained of the room will be empty.
                                    }
                                }
                                else {
                                    counter += 1; // Goes to lower female.
                                }
                            }
                            else if(counter % 2 == 0) {
                                if(upperFemalePairs["LLC"][LLCName] > 0) {
                                    roomies.push(upperFemalePairs["LLC"][LLCName].pop());
                                    unassigned = false;
                                }
                                else if(i > 0) {
                                    if(lowerFemalePairs["LLC"][LLCName].length > 0) {
                                        counter += 2;
                                    }
                                    else {
                                        break; // The remained of the room will be empty.
                                    }
                                }
                                else {
                                    counter += 1; // Goes to lower male.
                                }
                            }
                            else {
                                if(upperMalePairs[LLCName].length > 0) {
                                    roomies.push(upperMalePairs[LLCName].pop());
                                    unassigned = false;
                                }
                                else if(i > 0) {
                                    if(lowerMalePairs[LLCName].length > 0) {
                                        counter += 2; // Goes to lower male.
                                    }
                                    else{ 
                                        break; // The remained of the room will be empty.
                                    }
                                }
                                else {
                                    counter += 1; // Goes to upper female.
                                }  
                            }
                        } // End of while loop.
                        blueprint[floor]["rooms"][room]["roommates"] = roomies;
                    } // End of roomsize for loop.
                } // End of if to check if roommates have been assigned.
            } // End of student check while loop.
            counter += 1; 
        } // End of rooms for loop.
    } // End of LLC for loop.
    return blueprint // Returns edited floorplan with rooms assigned.
} // End of LLCBlocking function.


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
