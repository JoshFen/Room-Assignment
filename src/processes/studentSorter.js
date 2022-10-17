const { readExcel } = require("./processes/fileReader");

function assignStudents(inputFile) {
    let fileData = readExcel(inputFile);
    const [upperMale, lowerMale, upperFemale, lowerFemale] = genderSort(fileData);
    const [umRoomatePrio, umLLCPrio, umFloorPrio, umNoPrio] = determinePriority(upperMale);
    const [ufRoomatePrio, ufLLCPrio, ufFloorPrio, ufNoPrio] = determinePriority(upperFemale);
    const [lmRoomatePrio, lmLLCPrio, lmFloorPrio, lmNoPrio] = determinePriority(lowerMale);
    const [lfRoomatePrio, lfLLCPrio, lfFloorPrio, lfNoPrio] = determinePriority(lowerFemale);


}


function genderSort(){
 // Accept JSON file and seperate students by gender attribute into a list of male/female students.
 // Used both to call below functions
 let data = readExcel('data\students.xls');
 let Male = []
 let Female = []
 for (let i = 0; i < data.length; i++) {
    data[i]
    if (data[i].Gender == 'M') { 
        Male.push(data[i])
    }
    else {
        Female.push(data[i])
    }
    return [Male, Female]
 }

}

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

function roommatePriority(studentArray){

}

function floorPriority(){

}

