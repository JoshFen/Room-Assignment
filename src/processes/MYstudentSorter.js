function determinePriority(studentArray){
    // Iterate through array of student objects
    let queued = {}
    for(const key in studentArray) {
        if(queued.has(key)){ // Checks if the student was already sorted; i.e. Found as roommate pair.
            break; 
        }
        else {
            if(key["Roomate1Match"] == "1MutualWith1" && key["Roomate_1"] != ley["PSU_ID"]) {
                // Call roomate prioirty
            }  
            else if(key['Priority'] == "LLC") {
                
            }      
        }

    }
    //First check if they're priority is roomate & check if they have a match that is not themselves.
    
    // Second check for LLC priority

    //Check for floor priiortity
}

function LLCPriority(){

}