/*
This function add the participants in the menu that currently opened, and sets a new mutator for it
*/
async function loadParticipationButtons(){
  let participantsContainer = await waitForElm('div[aria-label="Participants"]');
  checkForNewMembers.observe(participantsContainer, {childList: true, subtree: true});
  addParticipants();
}

/* 
Every time the member list is updated, it loads the participation button on everyone.

Even when a single user gets added or deleted, the whole list gets updated, so it is
necessary to re draw the participation buttons

@param entries
A list of actions that mutated the menu
*/
const checkForNewMembers = new MutationObserver(entries => {
  if (addElements){
    addElements = false
    addParticipants();
    addElements = true;
  }
})

function addParticipants(){
  let participantsContainer = document.querySelector('div[aria-label="Participants"]');
  participantsContainer.childNodes.forEach(participantContainer =>{
    addParticipant(participantContainer);
  });
}


async function addParticipant(participantContainer){
  await delay(1500); //this compensates the time it takes to load the HTML file as resource
  var buttons = participantContainer.querySelector('#MeetMas_ButtonsContainer');
  if(buttons == null){
    let id= participantContainer.childNodes[0].childNodes[1].childNodes[0].childNodes[0].innerHTML;
    //let rol= participantContainer.childNodes[0].childNodes[1].childNodes[1].innerHTML;
    var participationButtons = await createParticipationButtons();    
    participantContainer.appendChild(participationButtons);
    setEventListeners_Participant(participationButtons, id)
    addParticipant_CurrentMeet(id);
    console.log(currentMeet)
  }
}

async function createParticipationButtons(){
  var participationButtons = document.createElement('div');
  participationButtons.setAttribute("class", "MeetMas_ButtonsContainer");
  participationButtons.setAttribute("id", "MeetMas_ButtonsContainer");
  participationButtons.innerHTML = await getTextContent('src/participationButtons/participationButtons.html');
  participationButtons.appendChild( await getCSS('src/participationButtons/participationButtons.css') );   
  return participationButtons
}


function addParticipant_CurrentMeet(participantId){
  // participants:
  // {
  //     p1: {d1:t1, d2:t2 },
  //     p2: {d1:t1, d2:t2 }
  // }
  let participants = currentMeet["participants"];

  //if participant don't exists yet, add them
  if(!participants.hasOwnProperty(participantId))
    currentMeet["participants"][participantId] = {};

  //then, if today's date has not been registered, add it
  let todayDate = getDate_YYYYMMDD();
  if(!currentMeet["participants"][participantId].hasOwnProperty(todayDate))
    currentMeet["participants"][participantId][todayDate] = 0;
}
