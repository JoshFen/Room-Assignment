const RoommatePair = require("../entities/RoommatePair");

function pairStudents(queue) {
    let extraPerson;
    if ((queue.length % 2) != 0) {
        extraPerson = queue.pop();
    }
    let pairs = [];
    for (let index = 0; index < queue.length; index += 2) { 
        pairs.push(new RoommatePair(queue[index], queue[index + 1]))
    }
    return [pairs, extraPerson];
}

///////////////////////////////////// Exports. /////////////////////////////////////
module.exports = {
    pairStudents
  };