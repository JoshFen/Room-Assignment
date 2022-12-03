
function runRoomAssignment(blueprintCopy, unfilledRooms, queuesUM, queuesUF, queuesLM, queuesLF) {
    [blueprintCopy, unfilledRooms] = raRoomAssign(blueprintCopy, unfilledRooms, queuesUF['ra'].concat(queuesUM['ra']));   
    [blueprintCopy, unfilledRooms, queuesUM, queuesUF, queuesLM, queuesLF] = LLCRoomAssign({"LLC FirstGen" : 2, "LLC Global Village": 2}, blueprintCopy, unfilledRooms, queuesUM, queuesUF, queuesLM, queuesLF);
    [blueprintCopy, unfilledRooms, queuesUM, queuesUF, queuesLM, queuesLF] = locationRoomAssign(blueprintCopy, unfilledRooms, queuesUM, queuesUF, queuesLM, queuesLF);
    [blueprintCopy, unfilledRooms, queuesUM, queuesUF, queuesLM, queuesLF] = completeUnfilledRooms(blueprintCopy, unfilledRooms, queuesUM, queuesUF, queuesLM, queuesLF);
    [blueprintCopy, unfilledRooms, queuesUM, queuesUF, queuesLM, queuesLF] = roomAssign(blueprintCopy, unfilledRooms, "roommate", queuesUM, queuesUF, queuesLM, queuesLF);
    [blueprintCopy, unfilledRooms, queuesUM, queuesUF, queuesLM, queuesLF] = completeUnfilledRooms(blueprintCopy, unfilledRooms, queuesUM, queuesUF, queuesLM, queuesLF);
    [blueprintCopy, unfilledRooms, queuesUM, queuesUF, queuesLM, queuesLF] = roomAssign(blueprintCopy, unfilledRooms, "noPref", queuesUM, queuesUF, queuesLM, queuesLF);
}

function makeUnfilledRooms(blueprint, unfilledRooms) {
    for(const floorNum in blueprint['floor']) {
        for(const roomNum in blueprint['floor'][floorNum]['rooms']) {
            unfilledRooms['empty'][roomNum] = {"sex": "", "group-type": ""};
        }
    }
    return unfilledRooms
}

///////////////////////////////////// RA room assignment functions. /////////////////////////////////////
function raRoomAssign(blueprint, unfilledRooms, RAQueue) {

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
                blueprint["floor"][1]["rooms"][112]["full"] = true;
                raRooms[112] = RAStudent;
                delete unfilledRooms['empty'][112]
            }
            else {
                noPref.push(RAStudent);
            }
        }
        else if(RAStudent["Requested_Floor_1"] == "Second") {

            if(blueprint["floor"][2]["rooms"][212]["roommates"].length < 1) {

                blueprint["floor"][2]["rooms"][212]["roommates"].push(RAStudent);
                blueprint["floor"][2]["rooms"][212]["full"] = true;
                raRooms[212] = RAStudent;
                delete unfilledRooms['empty'][212]
            }
            else if(blueprint["floor"][2]["rooms"]["roommates"].length < 1) {

                blueprint["floor"][2]["rooms"][216]["roommates"].push(RAStudent);
                blueprint["floor"][2]["rooms"][216]["full"] = true;
                raRooms[216] = RAStudent;
                delete unfilledRooms['empty'][216]
            }
            else {
                noPref.push(RAStudent);
            }
        }
        else if(RAStudent["Requested_Floor_1"] == "Third") {

            if(blueprint["floor"][3]["rooms"][312]["roommates"].length < 1) {

                blueprint["floor"][3]["rooms"][312]["roommates"].push(RAStudent);
                blueprint["floor"][3]["rooms"][312]["full"] = true;
                raRooms[312] = RAStudent;
                delete unfilledRooms['empty'][312]
            }
            else if(blueprint["floor"][3]["rooms"][315]["roommates"].length < 1) {

                blueprint["floor"][3]["rooms"][315]["roommates"].push(RAStudent);
                blueprint["floor"][3]["rooms"][315]["full"] = true;
                raRooms[315] = RAStudent;
                delete unfilledRooms['empty'][315]
            } 
            else {
                noPref.push(RAStudent);
            }  
        }
        else if(RAStudent["Requested_Floor_1"] == "Fourth") {

            if(blueprint["floor"][4]["rooms"][412]["roommates"].length < 1) {

                blueprint["floor"][4]["rooms"][412]["roommates"].push(RAStudent);
                blueprint["floor"][4]["rooms"][412]["full"] = true;
                raRooms[412] = RAStudent;
                delete unfilledRooms['empty'][412]
            }
            else if(blueprint["floor"][4]["rooms"][415]["roommates"].length < 1) {

                blueprint["floor"][4]["rooms"][415]["roommates"].push(RAStudent);
                blueprint["floor"][4]["rooms"][415]["full"] = true;
                raRooms[415] = RAStudent;
                delete unfilledRooms['empty'][415]
            } 
            else {
                noPref.push(RAStudent);
            } 
        }
        else if(RAStudent["Requested_Floor_1"] == "Fifth") {

            if(blueprint["floor"][5]["rooms"][512]["roommates"].length < 1) {

                blueprint["floor"][5]["rooms"][512]["roommates"].push(RAStudent);
                blueprint["floor"][5]["rooms"][512]["full"] = true;
                raRooms[512] = RAStudent;
                delete unfilledRooms['empty'][512]
            }
            else if(blueprint["floor"][5]["rooms"][515]["roommates"].length < 1) {

                blueprint["floor"][5]["rooms"][515]["roommates"].push(RAStudent);
                blueprint["floor"][5]["rooms"][515]["full"] = true;
                raRooms[515] = RAStudent;
                delete unfilledRooms['empty'][515]
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
                blueprint["floor"][fNum]["rooms"][room]["full"] = true;
                delete unfilledRooms['empty'][room]
                index++;
            }
        }
    }
    return [blueprint, unfilledRooms];
}

///////////////////////////////////// LLC room assignment functions. /////////////////////////////////////

// Function to ensure the queue is valid and not empty to continue with room assignments.
function isValidLLCQueue(studentPairs, LLCName) {
    return studentPairs["LLCs"] != undefined && studentPairs["LLCs"][LLCName] != undefined && studentPairs["LLCs"][LLCName].length > 0;
} // End of isValidLLCQueue function.

function LLCRoomAssign(LLCInfo, blueprint, unfilledRooms, upperMalePairs, upperFemalePairs, lowerMalePairs, lowerFemalePairs) {

    let counter = 1; // Keeps track of what gender/student year to assign to a room.

    for(const LLCName in LLCInfo) { // Iterate for each LLC from user input.

        let floorNum = LLCInfo[LLCName]; // Assuming LLC info is obj 

        for(const roomNum in blueprint["floor"][floorNum]["rooms"]) { // Iterates for each room on the floor given for current LLC.

            if(blueprint["floor"][floorNum]["rooms"][roomNum]["roommates"].length < 1) { // Checks if the room has students already (RA assignment).

                let roomies = []; // Array will hold the roommates to fill an entire room.
                let roomSize = blueprint["floor"][floorNum]["rooms"][roomNum]["roomSize"]; // Retrieves the room roomSize for current room.
                let sex = "";
                let groupType = "";

                if(isValidLLCQueue(upperMalePairs, LLCName) || isValidLLCQueue(upperFemalePairs, LLCName) || isValidLLCQueue(lowerMalePairs, LLCName) || isValidLLCQueue(lowerFemalePairs, LLCName)) {
                    
                    for(let i = 0; i < (roomSize / 2); i++) { // Iterates for each room spot to add students as pairs.
                        
                        let unassigned = true; // Tracks whether a pair has been assigned to current room.

                        while(unassigned) {  // Iterates until a pair is assigned to the room.

                            if(counter % 4 == 0) { // Assign lower class females to current room.
                                if(isValidLLCQueue(lowerFemalePairs, LLCName)) { // Validate lower female pairs queue.
                                    roomies.push(lowerFemalePairs["LLCs"][LLCName].pop());
                                    unassigned = false; // Exit while loop.
                                    sex = "F";
                                    groupType = "lowerFemale";
                                }
                                else if(i > 0) { // There are no more lf pairs but the rooms already has some assigned.
                                    if(isValidLLCQueue(upperFemalePairs, LLCName)) { // Validate upper female pairs queue.
                                        counter += 2; // Move counter to upper female pairs queue.
                                    }
                                    else {
                                        console.log('Room Incomplete', groupType);
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
                                    sex = "M";
                                    groupType = "lowerMale";
                                }
                                else if(i > 0) { // There are no more lm pairs but the rooms already has some assigned.
                                    if(isValidLLCQueue(upperMalePairs, LLCName)) {
                                        counter += 2; // Move counter to lower male pairs queue.
                                    }
                                    else {
                                        console.log('Room Incomplete', groupType);
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
                                    sex = "F";
                                    groupType = "upperFemale";
                                }
                                else if(i > 0) { // There are no more uf pairs but the rooms already has some assigned.
                                    if(isValidLLCQueue(lowerFemalePairs, LLCName)) { // Validate lower female pairs queue.
                                        counter += 2; // Move counter to lower female pairs queue.
                                    }
                                    else {
                                        console.log('Room Incomplete', groupType);
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
                                    sex = "M";
                                    groupType = "upperMale";
                                }
                                else if(i > 0) { // There are no more um pairs but the rooms already has some assigned.
                                    if(isValidLLCQueue(lowerMalePairs, LLCName)) { // Validate lower male pairs queue.
                                        counter += 2; // Goes to lower male.
                                    }
                                    else{
                                        console.log('Room Incomplete', groupType); 
                                        break; // The remained of the room will be empty.
                                    }
                                }
                                else {
                                    counter += 1; // Goes to upper female.
                                }  
                            }

                        } // End of while loop.

                    } // End of room roomSize for loop.

                    blueprint["floor"][floorNum]["rooms"][roomNum]["roommates"] = roomies; // Current room roommates array is assigned in blueprint.
                    blueprint["floor"][floorNum]["rooms"][roomNum]["sex"] = sex
                    blueprint["floor"][floorNum]["rooms"][roomNum]["group-type"] = groupType
 
                    if (roomies.length == (blueprint["floor"][floorNum]["rooms"][roomNum]["roomSize"] / 2)) {
                        blueprint["floor"][floorNum]["rooms"][roomNum]["full"] = true;

                        if(unfilledRooms["empty"][roomNum] != undefined) {
                            delete unfilledRooms["empty"][roomNum];
                        }
                    }
                    else {
                        if(unfilledRooms["empty"][roomNum] != undefined) {
                            delete unfilledRooms["empty"][roomNum];
                        }
                        unfilledRooms["incomplete"][roomNum] = {"sex": sex, "group-type": groupType};
                    }

                    counter += 1; // Increment counter to next student group.

                } // End of if to check if roommates have been assigned.

            } // End of student check while loop. 

        } // End of rooms for loop.

    } // End of LLC for loop.

    return [blueprint, unfilledRooms, upperMalePairs, upperFemalePairs, lowerMalePairs, lowerFemalePairs] // Returns edited floorplan with rooms assigned.

} // End of LLCRoomAssign function.

///////////////////////////////////// Location room assignment functions. /////////////////////////////////////

function isValidLocationQueue(studentPairs, floorNum) {
    return studentPairs["floors"] != undefined && studentPairs["floors"][floorNum] != undefined && studentPairs["floors"][floorNum].length > 0;
} // End of isValidLocationQueue function.

function locationRoomAssign(blueprint, unfilledRooms, upperMalePairs, upperFemalePairs, lowerMalePairs, lowerFemalePairs) {
    
    let counter = 1

    for(const floorNum in blueprint["floor"]) {

        for(const roomNum in blueprint["floor"][floorNum]["rooms"]) {

            let roomies = []
            let roomSize = blueprint["floor"][floorNum]["rooms"][roomNum]["roomSize"]
            let sex = ""

            if(blueprint["floor"][floorNum]["rooms"][roomNum]["roommates"].length < 1) { 

                if(isValidLocationQueue(upperMalePairs, floorNum) || isValidLocationQueue(upperFemalePairs, floorNum) || isValidLocationQueue(lowerMalePairs, floorNum) || isValidLocationQueue(lowerFemalePairs, floorNum)) {

                    for(let i = 0; i < (roomSize / 2); i++) { // Iterates for each room spot to add students as pairs.
                        
                        let unassigned = true; // Tracks whether a pair has been assigned to current room.

                        while(unassigned) {  // Iterates until a pair is assigned to the room.

                            if(counter % 4 == 0) { // Assign lower class females to current room.
                                if(isValidLocationQueue(lowerFemalePairs, floorNum)) { // Validate lower female pairs queue.
                                    roomies.push(lowerFemalePairs["floors"][floorNum].pop());
                                    unassigned = false; // Exit while loop.
                                    sex = "F";
                                    groupType = "lowerFemale";
                                }
                                else if(i > 0) { // There are no more lf pairs but the rooms already has some assigned.
                                    break;
                                }
                                else {
                                    counter += 1; // Goes to upper male.
                                }
                            }
                            else if(counter % 3 == 0) { // Assign lower class males to current room.
                                if(isValidLocationQueue(lowerMalePairs, floorNum)) { // Validate lower male pairs queue.
                                    roomies.push(lowerMalePairs["floors"][floorNum].pop());
                                    unassigned = false; // Exit while loop.
                                    sex = "M";
                                    groupType = "lowerMale";
                                }
                                else if(i > 0) { // There are no more lm pairs but the rooms already has some assigned.
                                    break;
                                }
                                else {
                                    counter += 1; // Goes to lower female.
                                }
                            }
                            else if(counter % 2 == 0) { // Assign upper class females to current room.
                                if(isValidLocationQueue(upperFemalePairs, floorNum)) { // Validate upper female pairs queue.
                                    roomies.push(upperFemalePairs["floors"][floorNum].pop());
                                    unassigned = false; // Exit while loop.
                                    sex = "F";
                                    groupType = "upperFemale";
                                }
                                else if(i > 0) { // There are no more uf pairs but the rooms already has some assigned.
                                    break; // The remained of the room will be empty.
                                }
                                else {
                                    counter += 1; // Goes to lower male.
                                }
                            }
                            else { // Assign upper class males to current room.
                                if(isValidLocationQueue(upperMalePairs, floorNum)) { // Validate upper male pairs queue. 
                                    roomies.push(upperMalePairs["floors"][floorNum].pop());
                                    unassigned = false; // Exit while loop.
                                    sex = "M";
                                    groupType = "upperMale";
                                }
                                else if(i > 0) { // There are no more um pairs but the rooms already has some assigned. 
                                    break; // The remained of the room will be empty.
                                }
                                else {
                                    counter += 1; // Goes to upper female.
                                }  
                            }

                        } // End of while loop.

                    } // End of room roomSize for loop.

                    blueprint["floor"][floorNum]["rooms"][roomNum]["roommates"] = roomies; // Current room roomates array is assigned in blueprint.
                    blueprint["floor"][floorNum]["rooms"][roomNum]["sex"] = sex
                    blueprint["floor"][floorNum]["rooms"][roomNum]["group-type"] = groupType

                    if (roomies.length == (blueprint["floor"][floorNum]["rooms"][roomNum]["roomSize"] / 2)) {
                        blueprint["floor"][floorNum]["rooms"][roomNum]["full"] = true;

                        if(unfilledRooms["empty"][roomNum] != undefined) {
                            delete unfilledRooms['empty'][roomNum];
                        }
                    }
                    else {
                        if(unfilledRooms["empty"][roomNum] != undefined) {
                            delete unfilledRooms["empty"][roomNum];
                        }
                        unfilledRooms['incomplete'][roomNum] = {"sex": sex, "group-type": groupType};
                    }

                    counter += 1; // Increment counter to next student group.
                }

            } // End of if to check if roommates have been assigned.

        } // End of rooms for loop.

    } // End of floors for loop.
    return [blueprint, unfilledRooms, upperMalePairs, upperFemalePairs, lowerMalePairs, lowerFemalePairs]
} // End of roommate locationRoomAssign function.

///////////////////////////////////// Unfilled room assignment functions. /////////////////////////////////////

function isValidQueue(studentPairs, queueType) {
    return studentPairs[queueType] != undefined &&  studentPairs[queueType].length > 0;
} // End of isValidQueue function.

function completeUnfilledRooms(blueprint, unfilledRooms, upperMalePairs, upperFemalePairs, lowerMalePairs, lowerFemalePairs) {

    for (const unfilledRoomNumber in unfilledRooms["incomplete"]) {
        const floorNum = unfilledRoomNumber.charAt(0);
        const groupType = unfilledRooms["incomplete"][unfilledRoomNumber]["group-type"]

        switch(groupType) {
            case "lowerFemale":
                [blueprint, lowerFemalePairs, unfilledRooms] = fillRoom(blueprint, floorNum, unfilledRoomNumber, lowerFemalePairs, "roommate", unfilledRooms);
                [blueprint, lowerFemalePairs, unfilledRooms] = fillRoom(blueprint, floorNum, unfilledRoomNumber, lowerFemalePairs, "noPref", unfilledRooms);

            case "lowerMale":
                [blueprint, lowerMalePairs, unfilledRooms] = fillRoom(blueprint, floorNum, unfilledRoomNumber, lowerMalePairs, "roommate", unfilledRooms);
                [blueprint, lowerMalePairs, unfilledRooms] = fillRoom(blueprint, floorNum, unfilledRoomNumber, lowerMalePairs, "noPref", unfilledRooms);

            case "upperFemale":
                [blueprint, upperFemalePairs, unfilledRooms] = fillRoom(blueprint, floorNum, unfilledRoomNumber, upperFemalePairs, "roommate", unfilledRooms);
                [blueprint, upperFemalePairs, unfilledRooms] = fillRoom(blueprint, floorNum, unfilledRoomNumber, upperFemalePairs, "noPref", unfilledRooms);

            case "upperMale":
                [blueprint, upperMalePairs, unfilledRooms] = fillRoom(blueprint, floorNum, unfilledRoomNumber, upperMalePairs, "roommate", unfilledRooms)
                [blueprint, upperMalePairs, unfilledRooms] = fillRoom(blueprint, floorNum, unfilledRoomNumber, upperMalePairs, "noPref", unfilledRooms)

        }
    }
    return [blueprint, unfilledRooms, upperMalePairs, upperFemalePairs, lowerMalePairs, lowerFemalePairs]
} // End of completeUnfilledRooms function.

function fillRoom(blueprint, floorNum, roomNum, studentPairs, queueType, unfilledRooms) {

    roomSize = blueprint["floor"][floorNum]["rooms"][roomNum]["roomSize"];
    curNumPairs = blueprint["floor"][floorNum]["rooms"][roomNum]["roommates"].length;
    if((roomSize / 2) > curNumPairs) {
        for(let i = curNumPairs; i < roomSize / 2; i++) {
            if(isValidQueue(studentPairs, queueType)) {
                blueprint["floor"][floorNum]["rooms"][roomNum]["roommates"].push(studentPairs[queueType].pop())  
            }
            else {
                console.log("Not enough matching student types to fill room.")
            }
        }
    
        if(blueprint["floor"][floorNum]["rooms"][roomNum]["roommates"].length == (roomSize / 2)) {
            blueprint["floor"][floorNum]["rooms"][roomNum]["full"] = true
            
            if(unfilledRooms["incomplete"][roomNum] != undefined) {
                delete unfilledRooms["incomplete"][roomNum]
            }
            if(unfilledRooms["empty"][roomNum] != undefined) {
                delete unfilledRooms["empty"][roomNum]
            }
        } 
    }

    return [blueprint, studentPairs, unfilledRooms]
} // End of fillRoom function.

///////////////////////////////////// Roommate room assignment functions. /////////////////////////////////////

function roomAssign(blueprint, unfilledRooms, queueType, upperMalePairs, upperFemalePairs, lowerMalePairs, lowerFemalePairs) {

    let counter = 1; // Keeps track of what gender/student year to assign to a room.

    for(const roomNum in unfilledRooms['empty']) {
        const floorNum = roomNum.charAt(0);


            if(blueprint['floor'][floorNum]['rooms'][roomNum]['full'] != true) {
            
                if(isValidQueue(upperMalePairs, queueType) || isValidQueue(upperFemalePairs, queueType) || isValidQueue(lowerMalePairs, queueType) || isValidQueue(lowerFemalePairs, queueType)) {

                    let roomies = []; // Array will hold the roommates to fill an entire room.
                    let roomSize = blueprint["floor"][floorNum]["rooms"][roomNum]["roomSize"]; // Retrieves the room roomSize for current room.
                    let sex = "";
                    let groupType = "";

                    for(let i = 0; i < (roomSize / 2); i++) { // Iterates for each room spot to add students as pairs.
                        
                        let unassigned = true; // Tracks whether a pair has been assigned to current room.

                        while(unassigned) {  // Iterates until a pair is assigned to the room.
                            if(counter > 4) {
                                counter = 1;
                            }
                            if(counter % 4 == 0) { // Assign lower class females to current room.
                                if(isValidQueue(lowerFemalePairs, queueType)) { // Validate lower female pairs queue.
                                    roomies.push(lowerFemalePairs[queueType].pop());
                                    unassigned = false; // Exit while loop.
                                    sex = "F";
                                    groupType = "lowerFemale";
                                }
                                else if(i > 0) { // There are no more lf pairs but the rooms already has some assigned.
                                    break;
                                }
                                else {
                                    counter += 1; // Goes to upper male.
                                }
                            }
                            else if(counter % 3 == 0) { // Assign lower class males to current room.
                                if(isValidQueue(lowerMalePairs, queueType)) { // Validate lower male pairs queue.
                                    roomies.push(lowerMalePairs[queueType].pop());
                                    unassigned = false; // Exit while loop.
                                    sex = "M";
                                    groupType = "lowerMale";
                                }
                                else if(i > 0) { // There are no more lm pairs but the rooms already has some assigned.
                                    break;
                                }
                                else {
                                    counter += 1; // Goes to lower female.
                                }
                            }
                            else if(counter % 2 == 0) { // Assign upper class females to current room.
                                if(isValidQueue(upperFemalePairs, queueType)) { // Validate upper female pairs queue.
                                    roomies.push(upperFemalePairs[queueType].pop());
                                    unassigned = false; // Exit while loop.
                                    sex = "F";
                                    groupType = "upperFemale";
                                }
                                else if(i > 0) { // There are no more uf pairs but the rooms already has some assigned.
                                    break; // The remained of the room will be empty.

                                }
                                else {
                                    counter += 1; // Goes to lower male.
                                }
                            }
                            else { // Assign upper class males to current room.
                                if(isValidQueue(upperMalePairs, queueType)) { // Validate upper male pairs queue. 
                                    roomies.push(upperMalePairs[queueType].pop());
                                    unassigned = false; // Exit while loop.
                                    sex = "M";
                                    groupType = "upperMale";
                                }
                                else if(i > 0) { // There are no more um pairs but the rooms already has some assigned. 
                                    break; // The remained of the room will be empty.
                                }
                                else {
                                    counter += 1; // Goes to upper female.
                                }  
                            }

                        } // End of while loop.
                    } // End of roomsize loop.

                    blueprint["floor"][floorNum]["rooms"][roomNum]["roommates"] = roomies; // Current room roomates array is assigned in blueprint.
                    blueprint["floor"][floorNum]["rooms"][roomNum]["sex"] = sex
                    blueprint["floor"][floorNum]["rooms"][roomNum]["group-type"] = groupType

                    if (roomies.length == (blueprint["floor"][floorNum]["rooms"][roomNum]["roomSize"] / 2)) {
                        blueprint["floor"][floorNum]["rooms"][roomNum]["full"] = true;

                        if(unfilledRooms["empty"][roomNum] != undefined) {
                            delete unfilledRooms["empty"][roomNum];
                        }
                    }
                    else {
                        if(unfilledRooms["empty"][roomNum] != undefined) {
                            delete unfilledRooms["empty"][roomNum];
                        }
                        unfilledRooms["incomplete"][roomNum] = {"sex": sex, "group-type": groupType};
                    }

                    counter += 1; // Increment counter to next student group.
                } // End of queue check.

            } // End of if full check.

    } // End of floor loop. 2

    return [blueprint, unfilledRooms, upperMalePairs, upperFemalePairs, lowerMalePairs, lowerFemalePairs]
}// End of roommateRoomAssign function.

///////////////////////////////////// Exports. /////////////////////////////////////
module.exports = {
    makeUnfilledRooms,
    raRoomAssign, 
    LLCRoomAssign,
    locationRoomAssign,
    completeUnfilledRooms,
    roomAssign
  };