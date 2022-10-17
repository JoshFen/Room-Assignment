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

