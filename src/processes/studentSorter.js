
const RoommatePair = require("../entities/RoommatePair");
const { readExcel } = require("./fileReader");
const fs = require('fs');

function genderSort(file){
    // Accept JSON file and separate students by gender attribute into a list of male/female students.
    // Used both to call below functions
    let data = readExcel(file);
    let upperMale = {}
    let upperFemale = {}
    let lowerMale = {}
    let lowerFemale = {}
    for (let i = 0; i < data.length; i++) {
        if (data[i].Gender == 'M') { 
            if (data[i].Group_Type=='First-Year') {
                lowerMale[data[i]['PSU_ID']] = data[i];
            }
            else {
                upperMale[data[i]['PSU_ID']] = data[i];
            } 
        }
        else {
            if (data[i].Group_Type == 'First-Year') { 
                lowerFemale[data[i]['PSU_ID']] = data[i];
            }
            else {
                upperFemale[data[i]['PSU_ID']] = data[i];
            }
        }
    }
    return [upperMale, lowerMale, upperFemale, lowerFemale]
}

function pairStudents(queue) {
    let extraPerson;
    if ((queue.length % 2) != 0) {
        extraPerson = queue.pop();
    }
    let pairs = [];
    for (let index = 0; index < queue.length; index += 2) { 
        pairs.push(new RoommatePair(queue[index], queue[index + 1]))
    }
    return [pairs, extraPerson];
}

function determinePriority(studentArray){
    let raQueue = []
    let roommateQueue = [] // Queue for students with roommate priority.
    let LLCQueue = [] // Queue for students with LLC priority.
    let locationQueue = [] // Queue for students with location priority.
    let noPrefQueue = [] // Queue for students with no priority.
    // Iterate through array of student objects
    let processedStudent = {}
    for(const student in studentArray) {
        if(processedStudent[student] != true) {
            if (studentArray[student]['Group_Type'] == 'Res Life') {
                raQueue.push(studentArray[student]);
            }
            else if(studentArray[student]["Roommate1Match"] == "1MutualWith1" && studentArray[student]["Roommate_1"] != studentArray[student]["PSU_ID"]) {
                roommateQueue.push(new RoommatePair(studentArray[student], studentArray[studentArray[student]['Roommate_1']]));
                processedStudent[studentArray[student]['Roommate_1']] = true;
            } 
            else if((studentArray[student]["Priority"] == "LLC" && studentArray[student]["Requested_LLC_1"] !== "") 
                    || (studentArray[student]["Priority"] == "Location" && studentArray[student]["Requested_LLC_1"] !== "")) {
                LLCQueue.push(studentArray[student]);
            }  
            else if(studentArray[student]["Priority"] == "Location") {
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
} // End  determinePriority function.


function LLCPriority(LLCQueue) {
    if (LLCQueue.length === 0) {
        return [[], []];
    }

    const unpairedLLCs = {};
    for (const student in LLCQueue) {
        if (LLCQueue[student]["Requested_LLC_1"] === undefined) continue;
        unpairedLLCs[LLCQueue[student]["Requested_LLC_1"]] && LLCQueue[student]["Requested_LLC_1"] !== undefined ? unpairedLLCs[LLCQueue[student]["Requested_LLC_1"]].push(LLCQueue[student]) : unpairedLLCs[LLCQueue[student]["Requested_LLC_1"]] = [LLCQueue[student]]
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
        if (roommatePair["firstStudent"]["Requested_LLC_1"] === roommatePair["secondStudent"]["Requested_LLC_1"] && roommatePair["firstStudent"]["Requested_LLC_1"] != "") {
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
        LLCs[roommatePair["firstStudent"]["Requested_LLC_1"]] = [roommatePair].concat(LLCs[roommatePair["firstStudent"]["Requested_LLC_1"]]);
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
        if(locationQueue[student]["Requested_Floor_1"] == "First" || locationQueue[student]["Requested_Floor_1"] == "Ground" || locationQueue[student]['Requested_Floor_1'] == '') {
            floor1Floor.push(locationQueue[student])
        }
        else if(locationQueue[student]["Requested_Floor_1"] == "Second") {
            floor2Floor.push(locationQueue[student])
        }
        else if(locationQueue[student]["Requested_Floor_1"] == "Third") {
            floor3Floor.push(locationQueue[student])
        }
        else if(locationQueue[student]["Requested_Floor_1"] == "Fourth") {
            floor4Floor.push(locationQueue[student])
        }
        else if(locationQueue[student]["Requested_Floor_1"] == "Fifth") {
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

//---------------------------------------------------------------------------
module.exports = {
    genderSort,
    determinePriority
  };