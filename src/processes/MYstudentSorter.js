function raRoomAssign(blueprint, RAQueue) {

    rooms = {
        112: '',
        212: '',
        216: '',
        312: '',
        315: '',
        412: '',
        415: '',
        512: '',
        515: ''
    };

    let noPref = []

    for(const RAStudent of RAQueue) {
        if(RAStudent["Requested_Floor_1"] == "First") {
            if(blueprint["floor"][1]["rooms"][112]["roommates"].length < 1){
                blueprint["floor"][1]["rooms"][112]["roommates"].push(RAStudent);
                rooms[112] = RAStudent;
            }
            else {
                noPref.push(RAStudent);
            }
        }
        else if(RAStudent["Requested_Floor_1"] == "Second") {
            if(blueprint["floor"][2]["rooms"][212]["roommates"].length < 1) {
                blueprint["floor"][2]["rooms"][212]["roommates"].push(RAStudent);
                rooms[212] = RAStudent;
            }
            else if(blueprint["floor"][2]["rooms"]["roommates"].length < 1) {
                blueprint["floor"][2]["rooms"][216]["roommates"].push(RAStudent);
                rooms[216] = RAStudent;
            }
            else {
                noPref.push(RAStudent);
            }
        }
        else if(RAStudent["Requested_Floor_1"] == "Third") {
            if(blueprint["floor"][3]["rooms"][312]["roommates"].length < 1) {
                blueprint["floor"][3]["rooms"][312]["roommates"].push(RAStudent);
                rooms[312] = RAStudent;
            }
            else if(blueprint["floor"][3]["rooms"][315]["roommates"].length < 1) {
                blueprint["floor"][3]["rooms"][315]["roommates"].push(RAStudent);
                rooms[315] = RAStudent;
            } 
            else {
                noPref.push(RAStudent);
            }  
        }
        else if(RAStudent["Requested_Floor_1"] == "Fourth") {
            if(blueprint["floor"][4]["rooms"][412]["roommates"].length < 1) {
                blueprint["floor"][4]["rooms"][412]["roommates"].push(RAStudent);
                rooms[412] = RAStudent;
            }
            else if(blueprint["floor"][4]["rooms"][415]["roommates"].length < 1) {
                blueprint["floor"][4]["rooms"][415]["roommates"].push(RAStudent);
                rooms[415] = RAStudent;
            } 
            else {
                noPref.push(RAStudent);
            } 
        }
        else if(RAStudent["Requested_Floor_1"] == "Fifth") {
            if(blueprint["floor"][5]["rooms"][512]["roommates"].length < 1) {
                blueprint["floor"][5]["rooms"][512]["roommates"].push(RAStudent);
                rooms[512] = RAStudent;
            }
            else if(blueprint["floor"][5]["rooms"][515]["roommates"].length < 1) {
                blueprint["floor"][5]["rooms"][515]["roommates"].push(RAStudent);
                rooms[515] = RAStudent;
            } 
            else {
                noPref.push(RAStudent);
            }
        }
        else {
            noPref.push(RAStudent);
        }
    }

    if(noPref.length > 0) {
        let index = 0;
        for(room in rooms){
            if(rooms[room] == '') {
                fNum = Math.floor(room / 100);
                rooms[room] = noPref.pop()
                blueprint["floor"][fNum]["rooms"][room] = noPref[index];
                index++;
            }
        }
    }
    return blueprint;
}

module.exports = {
    raRoomAssign
}