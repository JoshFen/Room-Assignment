class TenantPair {

    constructor(firstStudent, secondStudent) {
        this.firstStudent = firstStudent;
        this.secondStudent = secondStudent;
    }

    getFirstStudent() {
        return this.firstStudent;
    }

    getSecondStudent() {
        return this.secondStudent;
    }
}

module.exports = TenantPair;