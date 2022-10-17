const { readExcel } = require("./processes/fileReader");

function genderSort(){
 // Accept JSON file and seperate students by gender attribute into a list of male/female students.
 // Used both to call below functions
 let data = readExcel('data\students.xls');
 let upperMale = []
 let upperFemale = []
 let lowerMale = []
 let lowerFemale = []
 for (let i = 0; i < data.length; i++) {
    data[i]
    if (data[i].Gender == 'M') { 
        if (data[i].Grouptype=='First-Year') {
            lowerMale.push[data[i]]
        }
        else {
            upperMale.push(data[i])
        } 
    }
    else {
        if (data[i].Grouptype == 'First-Year') { 
            lowerFemale.push(data[i])
        }
        else {
            upperFemale.push(data[i])
        }
    }
return [Male, Female]
}

}

function determinePriority(studentArray){
    // Iterate through array of student objects

    //First check if they're priority is roomate & check if they have a match that is not themselves.
    
    // Second check for LLC priority

    //Check for floor priiortity
}

function roommatePriority(studentArray){

}

function floorPriority(){

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

