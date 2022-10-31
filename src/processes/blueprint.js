const fs = require('fs')

function createBlueprint(floorplanJSON){ // Function to create blueprint from stored floorplan.json.

    fs.readFile(floorplanJSON, 'utf8', (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err)
        return
    }

    let data = JSON.parse(jsonString)
    // Create empty blueprint JSON for simulating LionsGate.
    let blueprint = {
        floor: {
            1:{
                rooms: {

                }
            },
            2:{
                rooms: {
                
                }
            },
            3:{
                rooms: {
                
                }
            },
            4:{
                rooms: {
                
                }
            },
            5:{
                rooms: {
                
                }
            },
        
        }

    }
    // Iterate for each object in floorplan.json.

    for(var i = 0; i < data.length; i++){ 
        // Check if the object is from the first floor.
        if(data[i]["roomNumber"] < 200){
            ra = isRARoom(data[i]["roomNumber"], 100);
            roomSize = getRoomSize(data[i]["roomSize"]);
            blueprint["floor"][1]["rooms"][data[i]["roomNumber"]] = {
                "roomNumber": data[i]["roomNumber"],
                "roomSize": roomSize,
                "RARoom" : ra,
                "LLC": false,
                "sex": ""
            }
        }
        // Check if the object is from the second floor.
        else if(data[i]["roomNumber"] < 300){
            ra = isRARoom(data[i]["roomNumber"], 200);
            roomSize = getRoomSize(data[i]["roomSize"]);
            blueprint["floor"][2]["rooms"][data[i]["roomNumber"]] = {
                "roomNumber": data[i]["roomNumber"],
                "roomSize": roomSize,
                "RARoom" : ra,
                "LLC": false,
                "sex": ""
            }
        }
        // Check if the object is from the third floor.
        else if(data[i]["roomNumber"] < 400){
            ra = isRARoom(data[i]["roomNumber"], 300);
            roomSize = getRoomSize(data[i]["roomSize"]);
            blueprint["floor"][3]["rooms"][data[i]["roomNumber"]] = {
                "roomNumber": data[i]["roomNumber"],
                "roomSize": roomSize,
                "RARoom" : ra,
                "LLC": false,
                "sex": ""
            }
        }
        // Check if the object is from the fourth floor.
        else if(data[i]["roomNumber"] < 500){
            ra = isRARoom(data[i]["roomNumber"], 400);
            roomSize = getRoomSize(data[i]["roomSize"]);
            blueprint["floor"][4]["rooms"][data[i]["roomNumber"]] = {
                "roomNumber": data[i]["roomNumber"],
                "roomSize": roomSize,
                "RARoom" : ra,
                "LLC": false,
                "sex": ""
            }
        }
        // Check if the object is from the fifth floor.
        else if(data[i]["roomNumber"] < 600){
            ra = isRARoom(data[i]["roomNumber"], 500);
            roomSize = getRoomSize(data[i]["roomSize"]);
            blueprint["floor"][5]["rooms"][data[i]["roomNumber"]] = {
                "roomNumber": data[i]["roomNumber"],
                "roomSize": roomSize,
                "RARoom" : ra,
                "LLC": false,
                "sex": ""
            }
        }
    } // End of for loop.
        // Stringify JSON and create file for storage on app.
        const bp = JSON.stringify(blueprint)
        fs.writeFile("blueprint.json", bp, err => {
            if(err){
                throw err;
            }
            console.log("Blueprint successfuly created.")
        })// End of fs.writeFile function.
    console.log(blueprint.length)

    }) // End of fs.readfile function. (Moved to widen scope of jsonString to be called in for loop)

} // End of createBlueprint function.

function genderBlocking(floorplanJSON, totalMale, totalFemale) {
    fs.readFile(floorplanJSON, 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err);
            return;
        }
    
        let floorplan = JSON.parse(jsonString);
    })
    // 1. Find the difference in the # of males vs. # of female
    // ex. if (totalMale > totalFemale) diff = totalMale - totalFemale

    //2. Using the difference, figure out how many rooms needs to be changed;
    // assume that half the rooms are male and half the rooms are female to start
    // ex. if 12 students then 2 rooms of 6 should be changed or if 7 then 2 rooms of 4
}

function isRARoom(roomNum, floor) {
    if(roomNum % 100 == 12) { // Every floor has an RA room at _12.
        return true
    }
    else if(floor == 200) { // Floor 2s second RA room is 216.
        if(roomNum % 200 == 16) {
            return true
        }
    }
    else if(floor > 200) { // Floors 3, 4 & 5 have a second RA room at _15.
        if(roomNum % 100 == 15) {
            return true
        }
    }
    return false // This room is not an RA room.
}

function getRoomSize(jsonRoomSize) {
    if(jsonRoomSize == "2BD") {
        return 4;
    }
    else if(jsonRoomSize == "3BD") {
        return 6;
    }
    else if(jsonRoomSize == "3BD ADA") {
        return 4;
    }
    else if(jsonRoomSize == "STUDIO") {
        return 1
    }
    return 0;
}


function createRooms(blueprintJSON) {
    let rooms = []
    for(floor in blueprintJSON["floor"]){
        for(room in floor['rooms']){
            let newRoom =  new Room(room, floor, room["roomSize"], room["LLC"], room["RARoom"], room["sex"] )
            rooms.push(newRoom)
        }
    }
}
//---------------------------------Exports---------------------------------
module.exports = {
    createBlueprint
}