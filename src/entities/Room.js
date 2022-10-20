class Room {

    constructor(roomNumber, floorNumber, roomSize, LLC, RARoom, sex) {
        this.roomNumber = roomNumber; 
        this.floorNumber = floorNumber; 
        this.roomSize = roomSize;
        this.tenants = []; // Array to hold students assigned to this room
        this.isLearningLiving = LLC;
        this.RARoom = RARoom;
        this.sex = sex

    }

    setLearningLiving() {
        this.isLearningLiving = true;
    }

    assignPairedTenants(tenants) {
        if (this.isRoomFull() || this.isRoomAbleToFit()) {
            return false;
        }
        this.tenants.push(tenants.tenant1, tenants.tenant2);
        return true;
    }

    assignSingleTenant(tenant) {
        if (this.isRoomFull()) {
            return false;
        }
        this.tenants.push(tenant);
        return true;
    }

    isRoomFull () {
        return this.tenants.length >= this.roomSize;
    }

    isRoomAbleToFit() {
        return this.tenants.length + 2 > this.roomSize;
    }
}