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

    get getType(){
        return this.type;
    }
    get getGrade(){
        return this.grade;
    }
}