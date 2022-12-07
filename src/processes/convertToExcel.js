const XLSX = require('xlsx')
const OUTPUT_PATH = 'data/outputFile/';


function getStudentAtIndex(index, studentKey, roommates) {
    return roommates[index] != undefined ? roommates[index][studentKey]['PSU_ID'] : '';
}

function getRAStudent(roommates) {
    return roommates[0]['PSU_ID'];
}

function makeStudentsReadable(blueprintJSON) {

    let newJSON = [];

    for (floorNum in blueprintJSON['floor']) {
        for (roomNum in blueprintJSON['floor'][floorNum]['rooms']) {
            const roommates = blueprintJSON['floor'][floorNum]['rooms'][roomNum]['roommates'];
            if (blueprintJSON['floor'][floorNum]['rooms'][roomNum]['RARoom'] === false) {
                newJSON.push({
                    roomNumber: roomNum,
                    Student_1: getStudentAtIndex(0, 'firstStudent',  roommates),
                    Student_2: getStudentAtIndex(0, 'secondStudent',  roommates),
                    Student_3: getStudentAtIndex(1, 'firstStudent',  roommates),
                    Student_4: getStudentAtIndex(1, 'secondStudent',  roommates),
                    Student_5: getStudentAtIndex(2, 'firstStudent',  roommates),
                    Student_6: getStudentAtIndex(2, 'secondStudent',  roommates)
                })
            }
            else {
                newJSON.push({
                    roomNumber: roomNum,
                    Student_1: getRAStudent(roommates),
                    Student_2: '',
                    Student_3: '',
                    Student_4: '',
                    Student_5: '',
                    Student_6: ''
                })
            }
        }
    }

    return newJSON;
}

function makeExtraStudentsReadable(extraStudents) {
    let newJSON = [];
}

const convertJsonToExcel = (file) => {
    const workSheet = XLSX.utils.json_to_sheet(file);
    const workBook = XLSX.utils.book_new();
    let today = new Date()
    XLSX.utils.book_append_sheet(workBook, workSheet, "LionsGate Room Assignment")

    XLSX.write(workBook,{bookType:"xlsx",type:"buffer"})

    XLSX.write(workBook,{bookType:"xlsx",type:"binary"})

    const filePath = OUTPUT_PATH + "LionsGate_Room_Assignment_"+String(today.getDate())+"-"+String(today.getMonth())+"-"+String(today.getFullYear())+".xlsx";

    XLSX.writeFile(workBook, filePath, )

    return filePath;
  }

///////////////////////////////////// Exports. /////////////////////////////////////
module.exports = {
    makeStudentsReadable,
    convertJsonToExcel
  };