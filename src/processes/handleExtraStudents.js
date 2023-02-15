const { PSU_ID, REQUESTED_LLC_1, ROOMMATE_1, GROUP_TYPE, REQUESTED_FLOOR_1 } = require("../constants");

function handleAnExtra(extraStudent, extraStudentPriority) {
    if (extraStudent.length > 0) {
        switch (extraStudentPriority) {
            case 'roommate':
                return { 
                    PSU_ID: extraStudent[0][PSU_ID], 
                    Priority: extraStudent[0][ROOMMATE_1], 
                    Gender: extraStudent[0]["Gender"],
                    GroupType: extraStudent[0][GROUP_TYPE] 
                };
            case 'LLC':
                return { 
                    PSU_ID: extraStudent[0][PSU_ID], 
                    Priority: extraStudent[0][REQUESTED_LLC_1], 
                    Gender: extraStudent[0]["Gender"],
                    GroupType: extraStudent[0][GROUP_TYPE] 
                };
            case 'floor':
                return { 
                    PSU_ID: extraStudent[0][PSU_ID], 
                    Priority: extraStudent[0][REQUESTED_FLOOR_1], 
                    Gender: extraStudent[0]["Gender"],
                    GroupType: extraStudent[0][GROUP_TYPE]
                };
            case 'noPref':
                return { 
                    PSU_ID: extraStudent[0][PSU_ID], 
                    Priority: 'No Preference', 
                    Gender: extraStudent[0]["Gender"],
                    GroupType: extraStudent[0][GROUP_TYPE] 
                };
        }
    }
}

function handleExtraStudents(studentQueues) {
    const extraStudents = [...studentQueues[0].extras, ...studentQueues[1].extras, ...studentQueues[2].extras, ...studentQueues[3].extras];
    studentQueues.forEach((queue) => {
        queue.roommate.forEach((studentPair) => {
            extraStudents.push(handleAnExtra([studentPair.firstStudent], 'roommate'));
            extraStudents.push(handleAnExtra([studentPair.secondStudent], 'roommate'));
        })
        queue.noPref.forEach((studentPair) => {
            extraStudents.push(handleAnExtra([studentPair.firstStudent], 'noPref'));
            extraStudents.push(handleAnExtra([studentPair.secondStudent], 'noPref'));
        })
        
        for (const LLC in queue.LLCs) {
            if (queue.LLCs[LLC].length > 0) {
                queue.LLCs[LLC].forEach((studentPair) => {
                    extraStudents.push(handleAnExtra([studentPair.firstStudent], 'LLC'));
                    extraStudents.push(handleAnExtra([studentPair.secondStudent], 'LLC'));
                })
            }
        }

        for (const floor in queue.floors) {
            if (queue.floors[floor].length > 0) {
                queue.floors[floor].forEach((studentPair) => {
                    extraStudents.push(handleAnExtra([studentPair.firstStudent], 'floor'));
                    extraStudents.push(handleAnExtra([studentPair.secondStudent], 'floor'));
                })
            }
        }
    })

    return extraStudents
}

///////////////////////////////////// Exports. /////////////////////////////////////
module.exports = {
    handleAnExtra,
    handleExtraStudents
  };