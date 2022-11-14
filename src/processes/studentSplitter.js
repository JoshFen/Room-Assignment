const { GROUP_TYPE_FIRST_YEAR, PSU_ID } = require("../constants");
const { readExcel } = require("./excelFileReader");

function splitStudents(file) {

    let data = readExcel(file);
    let [upperMale, upperFemale, lowerMale, lowerFemale] = [{}, {}, {}, {}];

    for (let i = 0; i < data.length; i++) {
        if (data[i].Gender == 'M') { 
            if (data[i].Group_Type == GROUP_TYPE_FIRST_YEAR) {
                lowerMale[data[i][PSU_ID]] = data[i];
            }
            else {
                upperMale[data[i][PSU_ID]] = data[i];
            } 
        }
        else {
            if (data[i].Group_Type == GROUP_TYPE_FIRST_YEAR) { 
                lowerFemale[data[i][PSU_ID]] = data[i];
            }
            else {
                upperFemale[data[i][PSU_ID]] = data[i];
            }
        }
    }
    return [upperMale, lowerMale, upperFemale, lowerFemale]
}

///////////////////////////////////// Exports. /////////////////////////////////////
module.exports = {
    splitStudents
  };