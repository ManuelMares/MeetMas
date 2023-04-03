class Participant {
    constructor(name, participations = []) {
      this.participations = participations;
      this.name = name;
    }
    getParticipationsArray(){
      let answer = [];
      let total = 0;
      for (let index = 0; index < this.participations.length; index++) {
        let participationValue = this.participations[index].getGrade();
        total += participationValue;
        answer.push(participationValue);        
      }
      answer.push(total);
      return answer;
    }

    toString(){
      let answer = this.name + ": [";
      for (let index = 0; index < this.participations.length; index++) {
        answer += this.participations[index].toString() + ", ";
      }
      answer += "]";
      return answer;
    }
    getParticipations(){
      return this.participations;
    }
    getName(){
      return this.name;
    }
    setName(n){
      this.name = n;
    }
    addParticipation(participation){
      this.participations.push(participation);
    }
    upgradeLastParticipation(value){
      if(this.participations.length == 0)
        throw new Error('There are no participations at Participant>getParticipation');

      let p = this.getParticipation();
      let v = p.getGrade();
      
      p.setGrade(Number(v) + Number(value));
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
}