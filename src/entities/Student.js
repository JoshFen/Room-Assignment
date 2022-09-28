class Student{

    constructor(sID, fName, lName, preferences){
        this.sId = sID; // Student ID number.
        this.fName = fName; // Student first name.
        this.lName = lName; // Student last name.
        this.preferences = preferences; // Object of student assignment preferences.
    }

    getSID(){
        return this.sID;
    }

    getFName(){
        return this.fName;
    }

    getLName(){
        return this.lName;
    }

    getPreferences(){
        return this.preferences;
    }

    // Getters for individual assignment preferences from preferences object attribute.
    getRoommatePref(){
        return this.preferences.roommateID;
    }

    getLLPref(){
        return this.preferences.learningLiving;
    }

    getFloorNumPref(){
        return this.preferences.floorNum;
    }

}