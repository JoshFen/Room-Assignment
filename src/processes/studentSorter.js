
const TenantPair = require("../entities/TenantPair");
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
        pairs.push(new TenantPair(queue[index], queue[index + 1]))
    }
    return [pairs, extraPerson];
}

function assignRoom(tenantPairs, isLLC) {
    if (isLLC) {
        // put in LLC room
    }
    else {
        let placed = false;
        let checkedFloors = {
            'First': false,
            'Second': false,
            'Third': false,
            'Fourth': false,
            'Fifth': false
        }
        while (!placed)
        for (pair in tenantPairs) {
            let desiredFloor = pair.getFirstStudent()['Requested_Floor_1'];
            if (checkedFloor[desiredFloor]) {
                for (room in floorPlan[desiredFloor]) {
                    if (validRoom(room, pair.getFirstStudent())) {
                        room.assignPairedTenants(pair.getFirstStudent(), pair.getSecondStudent());
                        placed = true;
                    }
                }
                checkedFloors[desiredFloor] = true;
            }
            else {
                desiredFloor = checkedFloors.map((checked, index) => {
                    checked = false;
                })[0]
                for (room in floorPlan[desiredFloor]) {
                    if (validRoom(room, pair.getFirstStudent())) {
                        room.assignPairedTenants(pair.getFirstStudent(), pair.getSecondStudent());
                        placed = true;
                    }
                }
                checkedFloors[desiredFloor] = true;
            }
        }
    }
}

function validRoom(room, student) {
    if (room.isFull() || room.getGender() != student.getGender()) {
        return false;
    }
    return true;
}

function assignToRoom(studentsArray, floorNumber) {
    // Students Array should hold a pair of students
    // 1. access the JSON file where we will write in students to rooms
    let floorFile = fs.readFile(floorPlanJSON, 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err)
            return
        }
    let floorPlan = JSON.parse(jsonString);
    })
    //2.a Iterate through the rooms and try to put the students in one that matches
    /*
     for (room in floorPlan['floor'][floorNumber]) {
        // 2.b check if the room['gender'] matches studentArray[0]['Gender']
        // if they match the add them to floorPlane['floor']['floorNumber'] and return
     }
     // 3. If you make it through the above for loop then recall the function for every other floor
     // assignToRoom(studentArray, 1), assignToRoom(studentArray, 2), etc
     */
    for (room in floorPlan['floor'][floorNumber]) {
        if (room['gender'] == studentsArray[0]['Gender']) {
            room['gender'].push(floorPlan['floor']['floorNumber'])
            return
        }
        assignToRoom(studentArray, 1)
        assignToRoom(studentArray, 2)
        assignToRoom(studentArray, 3)
        assignToRoom(studentArray, 4)
        assignToRoom(studentArray, 5)
    }
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
                roommateQueue.push(new TenantPair(studentArray[student], studentArray[studentArray[student]['Roommate_1']]));
                processedStudent[studentArray[student]['Roommate_1']] = true;
            } 
            else if((studentArray[student]["Priority"] == "LLC" && studentArray[student]["Requested_LLC_1"] != "") 
                    || (studentArray[student]["Priority"] == "Location" && studentArray[student]["Requested_LLC_1"] != "")) {
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
    const [f1, f2, f3, f4, f5, floorExtras] = locationPriority(locationQueue);
    const [noPrefPairs, noPrefExtras] = pairStudents(noPrefQueue);
    const extraStudents = {'LLC': LLCs['extras'], 'Floor': floorExtras, 'noPrefExtras': noPrefExtras}
    return {
        ra: raQueue, 
        roommate: roommateQueue, 
        LLCs: LLCs['paired'], 
        f1: f1, 
        f2: f2, 
        f3: f3, 
        f4: f4, 
        f5: f5, 
        noPref: noPrefPairs, 
        extras: extraStudents
    }
} // End  determinePriority function.

function roommatePriority(roommateQueue) {
    for(pairs in  roommateQueue) {
        if(pairs[0]["Priority"] == pairs[1]["Priority"] && pairs[0]["Priority"] != "Roommate"){
            if(pairs[0]["Priority"] == "LLC") { 

            }
            else if(pairs[0]["Priority"] == "Location") {
            }
        }
    }
} // End of roommatePriority function.

function LLCPriority(LLCQueue) {
    if (LLCQueue.length === 0) {
        return [[], []];
    }
    const bp = JSON.stringify(LLCQueue)
        fs.writeFile("outpsut.json", bp, err => {
            if(err){
                throw err;
            }
            console.log("Blueprint successfully created.")
        })// End of fs.writeFile function.

    const unpairedLLCs = {};
    for (const student in LLCQueue) {
        if (LLCQueue[student]["Requested_LLC_1"] === undefined) console.log(LLCQueue[student])
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