// class Participants {
//     constructor() {
//       this.participantsList = [];
//       this.totalParticipations = 0;
//       this.date = String(new Date());
//     }

//     toString_single(name){
//       //TODO: GET INDEX, GET PARTICIPANT, PRINT ID
//       return name;
//     }
//     toString_all(){
//       console.log("printing something" + this.participantsList)
//       let answer = "[";
//       this.participantsList.forEach(p => {
//         answer += p.getName() + ", ";
//       });
//       answer += "]";
//       return answer;
//     }
//     csvFormat_single(){      
//     }
//     toString_all(){
//     }
//     csvFormat_all(){  
//       let participationsSummary = [];    
//       participationsSummary.push([this.date]);
//       let title = ["Names"];
//       for (let j = 0; j < this.totalParticipations; j++) {
//         title.push( "P" + j );
//       }
//       title.push("Total");
//       participationsSummary.push(title);


//       for (let index = 0; index < this.participantsList.length; index++) {
//         let temp = []
//         let sumParticipations = 0;
//         temp.push(this.participantsList[index].getName() );


//         let participations  = this.participantsList[index].getParticipations();
//         for (let j = 0; j < this.totalParticipations; j++) {
//           if(j < participations.length){
//             temp.push(participations[j].getGrade())
//             sumParticipations += participations[j].getGrade()
//           }
//           else{
//             temp.push(0)
//           }
//         }

//         temp.push(sumParticipations);
//         participationsSummary.push(temp);
//       }
//       console.log(participationsSummary);
//       let csvContent = "data:text/csv;charset=utf-8," + participationsSummary.map(e => e.join(",")).join("\n");
//       return csvContent;
//     }















//     async addParticipant(name){
//       if(name == null || name == "")
//         throw new Error('Invalid data string at Participants>addParticipant');
        
//       let index = this.getParticipantIndex(name);
//       if(index > -1)
//         return;
      
//       let newParticipant = new Participant(name);
//       this.participantsList.push(newParticipant);
//     }
//     getParticipant(index = this.participantsList.length -1){ 
//       if(index < 0 || index > this.participantsList.length - 1)
//         throw new Error('Invalid index at Participants>getParticipant');

//       return this.participantsList[index];
//     }
//     getParticipantIndex(name){
//       if(name == null || name == "")
//         throw new Error('Invalid data string at Participants>getParticipantIndex');

//       if(this.participantsList.length == 0){
//         return -1;
//       }
        
//       for (let index = 0; index < this.participantsList.length; index++) {
//         if (this.participantsList[index].getName() === name) {
//           return index;        
//         }
//       }
//       return -1; 
//     }
//     deleteParticipant(){      
//     }


//     addParticipation(name, type="Regular", grade=0){
//       let index = this.getParticipantIndex(name);
//       if(index == -1)
//         throw new Error('Invalid index(userName) at Participants>addParticipation');
      
//       let newParticipation = new Participation(type, grade);
//       this.participantsList[index].addParticipation(newParticipation)

//       if(this.participantsList[index].getParticipations().length >  this.totalParticipations){

//         this.totalParticipations = this.participantsList[index].getParticipations().length;
//       }
//     }
//     deleteParticipation(){
//       //TODO what's the criteria? probably an index
//     }
//     editParticipation_grade(){  
//       //TODO what's the criteria? probably an index 
//     }
//     editParticipation_type(){  
//       //TODO what's the criteria? probably an index   
//     }


// }