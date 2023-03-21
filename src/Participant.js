//import Participation from './Participation';

class Participant {
    constructor(name) {
      this.participations = [];
      this.name = name;
    }
    get getName(){
      return this.name;
    }
    addParticipation(participation){
      if(participation)
        this.participations.push(participation);      
      else
        throw new Error('New Participation is not a valid object. At Participant>addParticipation');
    }
    getParticipation(index = this.participations.length -1){
      if(this.participations.length == 0)
        throw new Error('There are no participations at Participant>getParticipation');
      if(index < 0 || index > this.participations.length - 1)
        throw new Error('Invalid index at Participant>getParticipation');
      return this.participations[index];
    }
    deleteParticipation(index = this.participations.length-1){
      if(index < 0 || index > this.participations.length-1)
        throw new Error('Invalid index at Participant>deleteParticipation');
      //second parameter indicates how many elements to delete
      this.participations.splice(index, 1);
    }
    gradeParticipation(index = this.participations.length-1, grade){
      if(index < 0 || index > this.participations.length-1)
        throw new Error('Invalid index at Participant>gradeParticipation');
      this.participations[index].setGrade(grade);
    }
    modifyTypeOfParticipation(index = this.participations.length-1, type){
      if(index < 0 || index > this.participations.length-1)
        throw new Error('Invalid index at Participant>gradeParticipation');
      if(type == null || type == "")
        throw new Error('Invalid grade type at Participant>gradeParticipation');
      this.participations[index].setGrade(type);
    } 
    get getAllParticipations(){
      return this.participations;
    }

}