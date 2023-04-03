function addParticipation(id, value){
  meet.registerParticipation(id, value);
  meet.toTableString(); 
  updateMeet(meet)//function from loadMeetingsFiles.js
  .then(console.log(meet.toTableString()));
}
