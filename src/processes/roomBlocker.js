function LLCBlocking(LLCs, floorplan, upperMaleLLC, upperFemaleLLC, lowerMaleLLC, lowerFemaleLLC) {
    
}


function totalStudentsForEachLLC(uM, uF, lM, lF) {
    let LLCTotalStudents = {};
    for (LLC of uM) {
        LLCTotalStudents[LLC] = uM[LLC].length + uF[LLC].length + lM[LLC].length + lF[LLC].length;
    }   
    return LLCTotalStudents; 
}

module.exports = {
    LLCBlocking
  };