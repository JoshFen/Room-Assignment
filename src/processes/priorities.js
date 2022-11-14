
const { PSU_ID, GROUP_TYPE_FIRST_YEAR, REQUESTED_LLC_1, ROOMMATE_1, PRIORITY, LOCATION, LLC, ROOMMATE_1_MATCH, MUTUAL_ROOMMATE, GROUP_TYPE, GROUP_TYPE_RES_LIFE, REQUESTED_FLOOR_1 } = require("../constants");
const RoommatePair = require("../entities/RoommatePair");
const fs = require('fs');
const { pairStudents } = require("./studentPairer");

function determineStudentPriority(studentArray){
    let [raQueue, roommateQueue, LLCQueue, locationQueue, noPrefQueue]   = [[], [], [], [], []];

    // Iterate through array of student objects
    let processedStudent = {}
    for(const student in studentArray) {
        if(processedStudent[student] != true) {
            if (studentArray[student][GROUP_TYPE] == GROUP_TYPE_RES_LIFE) {
                raQueue.push(studentArray[student]);
            }
            else if(studentArray[student][ROOMMATE_1_MATCH] == MUTUAL_ROOMMATE && studentArray[student][ROOMMATE_1] != studentArray[student]["PSU_ID"]) {
                roommateQueue.push(new RoommatePair(studentArray[student], studentArray[studentArray[student][ROOMMATE_1]]));
                processedStudent[studentArray[student][ROOMMATE_1]] = true;
            } 
            else if((studentArray[student][PRIORITY] == LLC && studentArray[student][REQUESTED_LLC_1] !== "") 
                    || (studentArray[student][PRIORITY] == LOCATION && studentArray[student][REQUESTED_LLC_1] !== "")) {
                LLCQueue.push(studentArray[student]);
            }  
            else if(studentArray[student][PRIORITY] == LOCATION) {
                locationQueue.push(studentArray[student])
            }
            else {
                noPrefQueue.push(studentArray[student])
            }
            processedStudent[student] = true;  
        }   
    } // End for loop.

    const LLCs = LLCPriority(LLCQueue);
    const roommates = doRoommatesBelongInLLC(roommateQueue);
    const [f1, f2, f3, f4, f5, floorExtras] = locationPriority(locationQueue);
    const [noPrefPairs, noPrefExtras] = pairStudents(noPrefQueue);
    const extraStudents = {'LLC': LLCs['extras'], 'Floor': floorExtras, 'noPrefExtras': noPrefExtras}
    const finalLLCs = putRoommatesInLLC(roommates['toLLC'], LLCs['paired'])
    return {
        ra: raQueue, 
        roommate: roommates['notToLLC'], 
        LLCs: finalLLCs, 
        floors: {
            f1: f1, 
            f2: f2, 
            f3: f3, 
            f4: f4, 
            f5: f5
        },
        noPref: noPrefPairs, 
        extras: extraStudents
    }
} // End  determineStudentPriority function.


function LLCPriority(LLCQueue) {
    if (LLCQueue.length === 0) {
        return [[], []];
    }

    const unpairedLLCs = {};
    for (const student in LLCQueue) {
        if (LLCQueue[student][REQUESTED_LLC_1] === undefined) continue;
        unpairedLLCs[LLCQueue[student][REQUESTED_LLC_1]] && LLCQueue[student][REQUESTED_LLC_1] !== undefined ? unpairedLLCs[LLCQueue[student][REQUESTED_LLC_1]].push(LLCQueue[student]) : unpairedLLCs[LLCQueue[student][REQUESTED_LLC_1]] = [LLCQueue[student]]
    }

    const allLLCs = {};
    const extraLLCStudents = {}
    for (const LLC in unpairedLLCs) {
        const [paired, unpaired]  = pairStudents(unpairedLLCs[LLC]);
        allLLCs[LLC] = paired;
        extraLLCStudents[LLC] = [unpaired];
    }
    return {paired: allLLCs, extras: extraLLCStudents};
} // End of LLCPriority function.

function doRoommatesBelongInLLC(roommatesArray) {
    let pairsToLLC = []
    let pairsNotToLLC = []
    for (const roommatePair of roommatesArray) {
        if (roommatePair["firstStudent"][REQUESTED_LLC_1] === roommatePair["secondStudent"][REQUESTED_LLC_1] && roommatePair["firstStudent"][REQUESTED_LLC_1] != "") {
            pairsToLLC.push(roommatePair);
        }
        else {
            pairsNotToLLC.push(roommatePair);
        }
    }
    return {toLLC: pairsToLLC, notToLLC: pairsNotToLLC};
}

function putRoommatesInLLC(roommates, LLCs) {
    for (const roommatePair of roommates) {
        LLCs[roommatePair["firstStudent"][REQUESTED_LLC_1]] = [roommatePair].concat(LLCs[roommatePair["firstStudent"][REQUESTED_LLC_1]]);
    }
    return LLCs;
}

function locationPriority(locationQueue) {
    if (locationQueue.length === 0) {
        return [];
    }

    let floor1Floor = [] // Queue for students requesting first floor rooms.
    let floor2Floor = [] // Queue for students requesting second floor rooms.
    let floor3Floor = [] // Queue for students requesting third floor rooms.
    let floor4Floor = [] // Queue for students requesting fourth floor rooms.
    let floor5Floor = [] // Queue for students requesting fifth floor rooms.

    // Iterate through array of student objects
    for(const student in locationQueue) {
        if(locationQueue[student][REQUESTED_FLOOR_1] == "First" || locationQueue[student][REQUESTED_FLOOR_1] == "Ground" || locationQueue[student][REQUESTED_FLOOR_1] == '') {
            floor1Floor.push(locationQueue[student])
        }
        else if(locationQueue[student][REQUESTED_FLOOR_1] == "Second") {
            floor2Floor.push(locationQueue[student])
        }
        else if(locationQueue[student][REQUESTED_FLOOR_1] == "Third") {
            floor3Floor.push(locationQueue[student])
        }
        else if(locationQueue[student][REQUESTED_FLOOR_1] == "Fourth") {
            floor4Floor.push(locationQueue[student])
        }
        else if(locationQueue[student][REQUESTED_FLOOR_1] == "Fifth") {
            floor5Floor.push(locationQueue[student])
        }
    } // End of for loop

    let [floor1Pairs, floor1Extra] = pairStudents(floor1Floor);
    let [floor2Pairs, floor2Extra] = pairStudents(floor2Floor);
    let [floor3Pairs, floor3Extra] = pairStudents(floor3Floor);
    let [floor4Pairs, floor4Extra] = pairStudents(floor4Floor);
    let [floor5Pairs, floor5Extra] = pairStudents(floor5Floor);

    return [floor1Pairs, floor2Pairs, floor3Pairs, floor4Pairs, floor5Pairs, {
        floor1ExtraStudent: floor1Extra, 
        floor2ExtraStudent: floor2Extra, 
        floor3ExtraStudent: floor3Extra,
        floor4ExtraStudent: floor4Extra, 
        floor5ExtraStudent: floor5Extra
    }];
} // End of locationPriority function.

///////////////////////////////////// Exports. /////////////////////////////////////
module.exports = {
    determineStudentPriority
  };