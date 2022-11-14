///////////////////////////////////// RA room assignment functions. /////////////////////////////////////
function raRoomAssign(blueprint, RAQueue) {

    raRooms = {
        112: '',
        212: '',
        216: '',
        312: '',
        315: '',
        412: '',
        415: '',
        512: '',
        515: ''
    };

    let noPref = []

    for(const RAStudent of RAQueue) {
        if(RAStudent["Requested_Floor_1"] == "First") {

            if(blueprint["floor"][1]["rooms"][112]["roommates"].length < 1){

                blueprint["floor"][1]["rooms"][112]["roommates"].push(RAStudent);
                raRooms[112] = RAStudent;
            }
            else {
                noPref.push(RAStudent);
            }
        }
        else if(RAStudent["Requested_Floor_1"] == "Second") {

            if(blueprint["floor"][2]["rooms"][212]["roommates"].length < 1) {

                blueprint["floor"][2]["rooms"][212]["roommates"].push(RAStudent);
                raRooms[212] = RAStudent;
            }
            else if(blueprint["floor"][2]["rooms"]["roommates"].length < 1) {

                blueprint["floor"][2]["rooms"][216]["roommates"].push(RAStudent);
                raRooms[216] = RAStudent;
            }
            else {
                noPref.push(RAStudent);
            }
        }
        else if(RAStudent["Requested_Floor_1"] == "Third") {

            if(blueprint["floor"][3]["rooms"][312]["roommates"].length < 1) {

                blueprint["floor"][3]["rooms"][312]["roommates"].push(RAStudent);
                raRooms[312] = RAStudent;
            }
            else if(blueprint["floor"][3]["rooms"][315]["roommates"].length < 1) {

                blueprint["floor"][3]["rooms"][315]["roommates"].push(RAStudent);
                raRooms[315] = RAStudent;
            } 
            else {
                noPref.push(RAStudent);
            }  
        }
        else if(RAStudent["Requested_Floor_1"] == "Fourth") {

            if(blueprint["floor"][4]["rooms"][412]["roommates"].length < 1) {

                blueprint["floor"][4]["rooms"][412]["roommates"].push(RAStudent);
                raRooms[412] = RAStudent;
            }
            else if(blueprint["floor"][4]["rooms"][415]["roommates"].length < 1) {

                blueprint["floor"][4]["rooms"][415]["roommates"].push(RAStudent);
                raRooms[415] = RAStudent;
            } 
            else {
                noPref.push(RAStudent);
            } 
        }
        else if(RAStudent["Requested_Floor_1"] == "Fifth") {

            if(blueprint["floor"][5]["rooms"][512]["roommates"].length < 1) {

                blueprint["floor"][5]["rooms"][512]["roommates"].push(RAStudent);
                raRooms[512] = RAStudent;
            }
            else if(blueprint["floor"][5]["rooms"][515]["roommates"].length < 1) {

                blueprint["floor"][5]["rooms"][515]["roommates"].push(RAStudent);
                raRooms[515] = RAStudent;
            } 
            else {
                noPref.push(RAStudent);
            }
        }
        else {
            noPref.push(RAStudent);
        }
    }

    if(noPref.length > 0) {
        let index = 0;
        for(room in raRooms){

            if(raRooms[room] == '') {

                fNum = Math.floor(room / 100);
                raRooms[room] = noPref.pop()
                blueprint["floor"][fNum]["rooms"][room]["roommates"].push(raRooms[room]);
                index++;
            }
        }
    }
    return blueprint;
}

///////////////////////////////////// LLC room assignment functions. /////////////////////////////////////

// Function to ensure the queue is valid and not empty to continue with room assignments.
function isValidLLCQueue(studentPairs, LLCName) {
    return studentPairs["LLCs"] != undefined && studentPairs["LLCs"][LLCName] != undefined && studentPairs["LLCs"][LLCName].length > 0;
}

function LLCRoomAssign(LLCInfo, blueprint, upperMalePairs, upperFemalePairs, lowerMalePairs, lowerFemalePairs) {

    for(const LLCName in LLCInfo) { // Iterate for each LLC from user input.

        let floorNum = LLCInfo[LLCName]; // Assuming LLC info is obj 

        for(const roomNum in blueprint["floor"][floorNum]["rooms"]) { // Iterates for each room on the floor given for current LLC.

            if( blueprint["floor"][floorNum]["rooms"][roomNum]["roommates"].length < 1) { // Checks if the room has students already (RA assignment).

                let counter = 1; // Keeps track of what gender/student year to assign to a room.
                let roomies = [] // Array will hold the roommates to fill an entire room.
                let roomSize = blueprint["floor"][floorNum]["rooms"][roomNum]["roomSize"]; // Retrieves the room roomSize for current room.

                if(isValidLLCQueue(upperMalePairs, LLCName) || isValidLLCQueue(upperFemalePairs, LLCName) || isValidLLCQueue(lowerMalePairs, LLCName) || isValidLLCQueue(lowerFemalePairs, LLCName)) {
                    
                    for(let i = 0; i < (roomSize / 2); i++) { // Iterates for each room spot to add students as pairs.
                        
                        let unassigned = true; // Tracks whether a pair has been assigned to current room.

                        while(unassigned) {  // Iterates until a pair is assigned to the room.

                            if(counter % 4 == 0) { // Assign lower class females to current room.
                                if(isValidLLCQueue(lowerFemalePairs, LLCName)) { // Validate lower female pairs queue.
                                    roomies.push(lowerFemalePairs["LLCs"][LLCName].pop());
                                    unassigned = false; // Exit while loop.
                                }
                                else if(i > 0) { // There are no more lf pairs but the rooms already has some assigned.
                                    if(isValidLLCQueue(upperFemalePairs, LLCName)) { // Validate upper female pairs queue.
                                        counter += 2; // Move counter to upper female pairs queue.
                                    }
                                    else {
                                        break; // The remained of the room will be empty.
                                    }
                                }
                                else {
                                    counter += 1; // Goes to upper male.
                                }
                            }
                            else if(counter % 3 == 0) { // Assign lower class males to current room.
                                if(isValidLLCQueue(lowerMalePairs, LLCName)) { // Validate lower male pairs queue.
                                    roomies.push(lowerMalePairs["LLCs"][LLCName].pop());
                                    unassigned = false; // Exit while loop.
                                }
                                else if(i > 0) { // There are no more lm pairs but the rooms already has some assigned.
                                    if(isValidLLCQueue(upperMalePairs, LLCName)) {
                                        counter += 2; // Move counter to lower male pairs queue.
                                    }
                                    else {
                                        break; // The remained of the room will be empty.
                                    }
                                }
                                else {
                                    counter += 1; // Goes to lower female.
                                }
                            }
                            else if(counter % 2 == 0) { // Assign upper class females to current room.
                                if(isValidLLCQueue(upperFemalePairs, LLCName)) { // Validate upper female pairs queue.
                                    roomies.push(upperFemalePairs["LLCs"][LLCName].pop());
                                    unassigned = false; // Exit while loop.
                                }
                                else if(i > 0) { // There are no more uf pairs but the rooms already has some assigned.
                                    if(isValidLLCQueue(lowerFemalePairs, LLCName)) { // Validate lower female pairs queue.
                                        counter += 2; // Move counter to lower female pairs queue.
                                    }
                                    else {
                                        break; // The remained of the room will be empty.
                                    }
                                }
                                else {
                                    counter += 1; // Goes to lower male.
                                }
                            }
                            else { // Assign upper class males to current room.
                                if(isValidLLCQueue(upperMalePairs, LLCName)) { // Validate upper male pairs queue. 
                                    roomies.push(upperMalePairs[LLCName].pop()); 
                                    unassigned = false; // Exit while loop.
                                }
                                else if(i > 0) { // There are no more um pairs but the rooms already has some assigned.
                                    if(isValidLLCQueue(lowerMalePairs, LLCName)) { // Validate lower male pairs queue.
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

                    blueprint["floor"][floorNum]["rooms"][roomNum]["roommates"] = roomies; // Current room roomates array is assigned in blueprint.
                    counter += 1; // Increment counter to next student group.

                } // End of if to check if roommates have been assigned.

            } // End of student check while loop. 

        } // End of rooms for loop.

    } // End of LLC for loop.

    return blueprint // Returns edited floorplan with rooms assigned.

} // End of LLCBlocking function.

///////////////////////////////////// Exports. /////////////////////////////////////
module.exports = {
    raRomAssign: LLCRoomAssign
  };