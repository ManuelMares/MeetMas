class Participation {
    constructor(grade=0, date=new Date().getFullYear() + "-" +new Date().getMonth() + "-" + new Date().getDay()) {
        this.grade = Number(grade);
        this.date = date;
    }
    toString(){
        let answer = "("+ this.date+","+ this.grade +")";
        return answer;
    }

    setGrade(grade){
        this.grade = Number(grade);
    }
    getGrade(){
        return this.grade;
    }
    setDate(date){
        this.date = date;
    }
    getDate(){
        return this.date;
    }
}