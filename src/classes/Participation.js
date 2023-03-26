class Participation {
    constructor(type = "regular", grade=0) {
      this.type = type;
      this.grade = grade;
    }

    setGrade(grade){
        this.grade = grade;
    }
    setType(type){
        this.type = type;
    }

    getType(){
        return this.type;
    }
    getGrade(){
        return this.grade;
    }
}