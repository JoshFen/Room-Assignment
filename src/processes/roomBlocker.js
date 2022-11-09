function LLCBlocking(LLCInfo, floorplan, upperMalePairs, upperFemalePairs, lowerMalePairs, lowerFemalePairs) {
    // 1. Iterate for each LLCInfo key
    //      a. Check floor and access floorplan[key]
    //      b. Iterate for each person in each list ex. upperMale[key] and fill a room with that group
    // 2. If a list is exhausted fill with remaining groups

    for(LLCName in LLCInfo) { // Iterate for each LLC from user input.
        let floorNum = LLCInfo[LLCName]; // Assuming LLC info is obj like: "LLCName": "Floor Number"

        for(room in floorplan[floorNum]["rooms"]) { // Iterates for each room on the floor given for current LLC.
            let counter = 1;
            roomies = [] // Each array will hold the roomates to fill an entire room.
            roomSize = floorplan[floor]["rooms"][room]["size"]; // Retrieves the room size for current room.
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
                                    break; // The reamined of the room will be empty.
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
                                    break; // The reamined of the room will be empty.
                                }
                            }
                            else {
                                counter += 1; // Goes to lower feamle.
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
                                    break; // The reamined of the room will be empty.
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
                                    break; // The reamined of the room will be empty.
                                }
                            }
                            else {
                                counter += 1; // Goes to upper female.
                            }  
                        }
    
                    } // End of while loop.
                    floorplan[floor]["rooms"][room]["roommates"] = roomies;
                } // End of roomsize for loop.
            } // End of student check while loop.
            counter += 1; 
        } // End of rooms for loop.
    } // End of LLC for loop.
    return floorplan // Returns edited floorplan with rooms assigned.
} // End of LLCBlocking function.


function totalStudentsForEachLLC(uM, uF, lM, lF) {
    let LLCTotalStudents = {};
    for (LLC of uM) {
        LLCTotalStudents[LLC] = uM[LLC].length + uF[LLC].length + lM[LLC].length + lF[LLC].length;
    }   
    return LLCTotalStudents; 
}

module.exports = {
    LLCBlocking
  };