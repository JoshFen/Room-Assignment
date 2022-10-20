function determinePriority(studentArray){

    let roommateQueue = [] // Queue for students with roommate priority.
    let LLCQueue = [] // Queue for students with LLC priority.
    let locationQueue = [] // Queue for students with location priority.
    let noPrefQueue = [] // Queue for students with no priority.

    // Iterate through array of student objects
    for(const student in studentArray) {

       if(student["Roommate1Match"] == "1MutualWith1" && student["Roommate_1"] != student["PSU_ID"]) {
            roommateQueue.push([student, studentArray["Roommate_1"]])
        }  
        else if(student["Priority"] == "LLC") {
            LLCQueue.push(student)
        }  
        else if(student["Priority"] == "Location") {
            locationQueue.push(student)
        }
        else {
            noPrefQueue.push(student)
        }     
    } // End for loop.

    return {roomate: roommateQueue, LLC: LLCQueue, location: locationQueue, noPref: noPrefQueue}
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

    LLC1Queue = [] // Queue for students requesting LLC 1 rooms.
    LLC2Queue = [] // Queue for students requesting LLC 2 rooms.

    // Iterate through array of student objects
    for(const student in LLCQueue) {
        if(student["Requested_LLC_1"] == "LLC Global Village") {
                LLC1Queue.push(student)
        }
        else {
            LLC2Queue.push(student)
        }
    } // End of for loop.

    return [LLC1Queue, LLC2Queue]
} // End of LLCPriority function.

function locationPriority(locationQueue) {

    floor1Floor = [] // Queue for students requesting first floor rooms.
    floor2Floor = [] // Queue for students requesting second floor rooms.
    floor3Floor = [] // Queue for students requesting third floor rooms.
    floor4Floor = [] // Queue for students requesting fourth floor rooms.
    floor5Floor = [] // Queue for students requesting fifth floor rooms.

    // Iterate through array of student objects
    for(const student in locationQueue) {
        if(student["Requested_Floor_1"] == "First" || student["Request_Floor_1"] == "Ground") {
            floor1Floor.push(student)
        }
        else if(student["Requested_Floor_1"] == "Second") {
            floor2Floor.push(student)
        }
        else if(student["Requested_Floor_1"] == "Third") {
            floor3Floor.push(student)
        }
        else if(student["Requested_Floor_1"] == "Fourth") {
            floor4Floor.push(student)
        }
        else if(student["Requested_Floor_1"] == "Fifth") {
            floor5Floor.push(student)
        }
    } // End of for loop.

    return [floor1Floor, floor2Floor, floor3Floor, floor4Floor, floor5Floor]
} // End of locationPriority function.
