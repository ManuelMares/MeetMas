//import Participant from './Participant';
//import Participation from './Participation';

class Participants {
    constructor() {
      this.participantsList = [];
    }

    toString_single(){
      if(participantsList.length == 0)
        return "[]"

      answer = "[";
      participantsList.forEach(p => {
        answer += p.getName() + ", ";
      });
      answer += "]";
      return answer;
    }
    toString_all(){
      answer = "[";
      participantsList.forEach(p => {
        answer += p.getName() + ", ";
      });
      answer += "]";
      return answer;
    }
    csvFormat_single(){      
    }
    toString_all(){
    }
    csvFormat_all(){      
    }

    addParticipant(name){
      if(name == null || name == "")
        throw new Error('Invalid data string at Participants>addParticipant');
      
        
      index = getParticipantIndex(name);
      if(index > -1)
        return;

      let newParticipant = Participant(name);
      this.participantsList.push(newParticipant);
    }
    getParticipant(index = this.participantsList.length -1){ 
      if(index < 0 || index > this.participations.length - 1)
        throw new Error('Invalid index at Participants>getParticipant');

      return this.participantsList[index];
    }
    getParticipantIndex(name){
      if(name == null || name == "")
        throw new Error('Invalid data string at Participants>getParticipantIndex');

      counter = 0;
      this.participantsList.forEach(p => {
        if (p.getName() == name) 
          return counter;        
        counter += 1;
      });     
      return -1; 
    }
    deleteParticipant(){      
    }


    addParticipation(name="Regular", grade=0){
      index = getParticipantIndex(name);
      if(index == -1)
        throw new Error('Invalid index(userName) at Participants>addParticipation');
      
      let newParticipation = Participation(name, grade);
      this.participantsList[index].addParticipation(newParticipation)
    }
    deleteParticipation(){
      //TODO what's the criteria? probably an index
    }
    editParticipation_grade(){  
      //TODO what's the criteria? probably an index 
    }
    editParticipation_type(){  
      //TODO what's the criteria? probably an index   
    }


}