function determinePriority(studentArray){

    let roommateQueue = []
    let LLCQueue = []
    let locationQueue = []
    let noPrefQueue = []

    // Iterate through array of student objects
    for(const key in studentArray) {

       if(key["Roomate1Match"] == "1MutualWith1" && key["Roomate_1"] != ley["PSU_ID"]) {
            roommateQueue.push(key)
        }  
        else if(key['Priority'] == "LLC") {
            LLCQueue.push(key)
        }  
        else if(key['Priority'] == 'Location') {
            locationQueue.push(key)
        }
        else {
            noPrefQueue.push(key)
        }     
    } // End for loop.

    return [roommateQueue, LLCQueue, locationQueue, noPrefQueue]
} // End  determinePriority function.

function LLCPriority(studentArray) {
    if(student["Requested_LLC_1"] == "LLC Global Village") {
        if(LLC1Queue.length < LLCFloorSize) {
            LLCQueue.push(student);
        }
        else {
              
        }
    }
    else if(student["Requested_LLC_2"] == "LLC First Gen") {

    }
} // End of LLCPriority function.

function roommatePriority(studentArray) {

} // End of roomatePriority function.

function locationPrioriy(studentArray) {
    
} // End of locationPriority function.
