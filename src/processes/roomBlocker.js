const fs = require('fs'); 

function isValidLLCQueue(studentPairs, LLCName) {
    return studentPairs["LLCs"] != undefined && studentPairs["LLCs"][LLCName] != undefined && studentPairs["LLCs"][LLCName].length > 0;
}

function LLCBlocking(LLCInfo, blueprint, upperMalePairs, upperFemalePairs, lowerMalePairs, lowerFemalePairs) {
    // 1. Iterate for each LLCInfo key
    //      a. Check floor and access floorplan[key]
    //      b. Iterate for each person in each list ex. upperMale[key] and fill a room with that group
    // 2. If a list is exhausted fill with remaining groups

    for(const LLCName in LLCInfo) { // Iterate for each LLC from user input.
        let floorNum = LLCInfo[LLCName]; // Assuming LLC info is obj 
        for(const room in blueprint["floor"][floorNum]["rooms"]) { // Iterates for each room on the floor given for current LLC.
            if( blueprint["floor"][floorNum]["rooms"][room]["roommates"].length < 1) { // Checks if the room has students already (RA assignment).
                let counter = 1;
                let roomies = [] // Each array will hold the roommates to fill an entire room.
                let roomSize = blueprint["floor"][floorNum]["rooms"][room]["roomSize"]; // Retrieves the room roomSize for current room.
                if(isValidLLCQueue(upperMalePairs, LLCName) || isValidLLCQueue(upperFemalePairs, LLCName) || isValidLLCQueue(lowerMalePairs, LLCName) || isValidLLCQueue(lowerFemalePairs, LLCName)) {
                    for(let i = 0; i < (roomSize / 2); i++) { // Iterates for each room spot to add students as pairs.
                        // use counter to decide which student group to operate on.
                        let unassigned = true;
                        while(unassigned) {// NEEDS TO STOP WHEN LISTS ARE EMPTY
                            if(counter % 4 == 0) {
                                if(isValidLLCQueue(lowerFemalePairs, LLCName)) {
                                    roomies.push(lowerFemalePairs["LLCs"][LLCName].pop());
                                    unassigned = false;
                                }
                                else if(i > 0) {
                                    if(isValidLLCQueue(upperFemalePairs, LLCName)) {
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
                                if(isValidLLCQueue(lowerMalePairs, LLCName)) {
                                    roomies.push(lowerMalePairs["LLCs"][LLCName].pop());
                                    unassigned = false;
                                }
                                else if(i > 0) {
                                    if(isValidLLCQueue(upperMalePairs, LLCName)) {
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
                                if(isValidLLCQueue(upperFemalePairs, LLCName)) {
                                    roomies.push(upperFemalePairs["LLCs"][LLCName].pop());
                                    unassigned = false;
                                }
                                else if(i > 0) {
                                    if(isValidLLCQueue(lowerFemalePairs, LLCName)) {
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
                                if(isValidLLCQueue(upperMalePairs, LLCName)) {
                                    roomies.push(upperMalePairs[LLCName].pop());
                                    unassigned = false;
                                }
                                else if(i > 0) {
                                    if(isValidLLCQueue(lowerMalePairs, LLCName)) {
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
                    } // End of room roomSize for loop.
                    blueprint["floor"][floorNum]["rooms"][room]["roommates"] = roomies;
                    counter += 1;
                } // End of if to check if roommates have been assigned.

            } // End of student check while loop. 
        } // End of rooms for loop.
    } // End of LLC for loop.
    const bp = JSON.stringify(blueprint)
      fs.writeFile("outputd.json", bp, err => {
          if(err){
            console.log(err)
              throw err;
          }
      })// End of fs.writeFile function.
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
