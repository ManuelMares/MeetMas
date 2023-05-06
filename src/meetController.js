/*
This script is in charge of managing a meet JSON object as it interacts with the interface.
This means that this script will listen for, and register:
    New participations
    New participation dates
    Delete students
    Modify students
*/


function setEventListeners_Participant(participationButtons, name){
    let positiveP_Button = participationButtons.childNodes[0];
    let negativeP_Button = participationButtons.childNodes[2];

    let positiveId = name + "_Positive";
    let negativeId = name + "_Negative";

    positiveP_Button.setAttribute("id",positiveId);
    negativeP_Button.setAttribute("id", negativeId);

    positiveP_Button.addEventListener('click', e => {
        addParticipation(name, 1); 
        nofity("Positive participation added to: " + name);
    });
    negativeP_Button.addEventListener('click', e => {
        addParticipation(name, -1); 
        nofity("Negative participation added to: " + name);
    });
}



function addParticipation(participantId, value){
    let todayDate = getDate_YYYYMMDD();
    currentMeet["participants"][participantId][todayDate] += value;
    updateMeetInStorage(currentMeet)
    .then(() => {});
}














