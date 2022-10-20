const { readExcel } = require("./processes/fileReader");

function genderSort(){
    // Accept JSON file and separate students by gender attribute into a list of male/female students.
    // Used both to call below functions
    let data = readExcel('data\students.xls');
    let upperMale = []
    let upperFemale = []
    let lowerMale = []
    let lowerFemale = []
    for (let i = 0; i < data.length; i++) {
        data[i]
        if (data[i].Gender == 'M') { 
            if (data[i].Group_Type=='First-Year') {
                lowerMale.push[data[i]]
            }
            else {
                upperMale.push(data[i])
            } 
        }
        else {
            if (data[i].Group_Type == 'First-Year') { 
                lowerFemale.push(data[i])
            }
            else {
                upperFemale.push(data[i])
            }
        }
    }
    return [upperMale, lowerMale, upperFemale, lowerFemale]
}

function assignStudents() {
    const [uM, lM, uF, lF] = genderSort();
    const uMQueues = determinePriority(uM);
    const UFQueues = determinePriority(uF);
    const lMQueues = determinePriority(lM);
    const lfQueues = determinePriority(lF);
}

function pairStudents(queue) {
    let pairs = [];
    let counter = 0;
    for (let index = 0; index < queue.length; index + 2) {
        pairs.push(new TenantPair(queue[index][index + 1]))
        counter++;
    }
    if (counter < queue.length - 1) {
        // put them somewhere
    }
    return pairs;
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
}

