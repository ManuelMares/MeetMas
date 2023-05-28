/*
This function add the participants in the menu that currently opened, and sets a new mutator for it
*/
async function loadParticipationButtons(){
  //add styles
  let cssParticipationButtons = await getCSS('src/MeetMas/participationButtons/participationButtons.css');
  let cssMessageMas = await getCSS('src/messageMas/messageMas.css');
  document.body.appendChild(cssParticipationButtons);
  document.body.appendChild(cssMessageMas);
  
  //add buttons dynamically
  loadParticipants_ParticipationButtons();
  loadMessages_ParticipationButtons();
}

let participantsContainer_query = 'div[aria-label="Participants"]';
let messagesContainer_query = 'div[jsname="xySENc"]';
async function getParticipantsContainer(){
  let participantsContainer = await asyncQuery(participantsContainer_query);
  return participantsContainer;
}
async function getMessagesContainer(){
  let messagesContainer = await asyncQuery(messagesContainer_query);  
  return messagesContainer;
}


function appendHTMLNode(HTMLFather, HTMLChild){  
  return new Promise(async (resolve, reject) => {  
    HTMLFather.append(HTMLChild);
    await waitUntilElementIsAdded(HTMLFather, HTMLChild);
    return resolve();
  })
}

async function createParticipationButtons(){
  var participationButtons = document.createElement('div');
  participationButtons.setAttribute("class", "MeetMas_ButtonsContainer");
  participationButtons.setAttribute("id", "MeetMas_ButtonsContainer");
  participationButtons.innerHTML = await getTextContent('src/MeetMas/participationButtons/participationButtons.html'); 
  return participationButtons
}


function setEventListeners_Participant(participationButtons, name){
  let positiveP_Button = participationButtons.childNodes[0];
  let negativeP_Button = participationButtons.childNodes[2];

  let positiveId = name + "_Positive";
  let negativeId = name + "_Negative";

  positiveP_Button.setAttribute("id",positiveId);
  negativeP_Button.setAttribute("id", negativeId);

  positiveP_Button.addEventListener('click', e => {
      addParticipation(name, 1); 
      notify("Positive participation added to: " + name, name);
  });
  negativeP_Button.addEventListener('click', e => {
      addParticipation(name, -1); 
      notify("Negative participation added to: " + name, name);
  });
}



function addParticipation(participantId, value){
  let todayDate = getDate_YYYYMMDD();
  if( !(todayDate in currentMeet["participants"][participantId]) )
      currentMeet["participants"][participantId][todayDate] = 0;
  currentMeet["participants"][participantId][todayDate] += value;
  updateMeetInStorage(currentMeet)
  .then(() => {});
}


//=========================================================================================

async function loadParticipants_ParticipationButtons(){
  participantsContainer = await getParticipantsContainer();
  checkForNewMembers.observe(participantsContainer, {childList: true, subtree: true});
  addParticipationButton_Participants(participantsContainer);
}

/* 
Every time the member list is updated, it loads the participation button on everyone.

Even when a single user gets added or deleted, the whole list gets updated, so it is
necessary to re draw the participation buttons

@param entries
A list of actions that mutated the menu
*/
const checkForNewMembers = new MutationObserver(async entries => {
  checkForNewMembers.disconnect();
   //to avoid over rendering participation buttons, the mutator is deactivated for 2 seconds once that it is triggered.
   //it can be manually forced to re render the interface
  await delay(2000)

  participantsContainer = await getParticipantsContainer();
  await addParticipationButton_Participants(participantsContainer);

  await delay(2000)
  //await cleanButtons(participantsContainer);
  checkForNewMembers.observe(participantsContainer, {childList: true, subtree: true});
})

async function addParticipationButton_Participants(participantsContainer){
  for (let index = 0; index < participantsContainer.childNodes.length; index++) {
    await addParticipationButton_Participant(participantsContainer.childNodes[index]);
  }
}


async function addParticipationButton_Participant(participantContainer){
  //await delay(100); //give to the html file of the buttons to load and
  let buttons = participantContainer.querySelector('#MeetMas_ButtonsContainer');
  
  if(isValidHTML(buttons))
    return

  
  //add buttons
  var participationButtons = await createParticipationButtons();    
  participantContainer.appendChild(participationButtons);
  
  //add participant to list if necessary
  let id= participantContainer.childNodes[0].childNodes[1].childNodes[0].childNodes[0].innerHTML;
  await addParticipant_CurrentMeet(id);

  //add event listener
  setEventListeners_Participant(participationButtons, id)
}



function addParticipant_CurrentMeet(participantId){
  // participants:
  // {
  //     p1: {d1:t1, d2:t2 },
  //     p2: {d1:t1, d2:t2 }
  // }
  let participants = currentMeet["participants"];

  //if participant don't exists yet, add them
  if(!participants.hasOwnProperty(participantId)){
    currentMeet["participants"][participantId] = {};
    currentMeet["metaData"]["totalParticipants"] += 1
  }

  //then, if today's date has not been registered, add it
  let todayDate = getDate_YYYYMMDD();
  if(!currentMeet["participants"][participantId].hasOwnProperty(todayDate)){
    currentMeet["participants"][participantId][todayDate] = 0;
    currentMeet["metaData"]["totalDates"] += 1
  }
}







//=========================================================================
async function loadMessages_ParticipationButtons(){
  let messagesContainer = await getMessagesContainer();
  checkForNewMessages.observe(messagesContainer, {childList: true, subtree: true});
  await addMessageMasButtons_messages(messagesContainer);
}

const checkForNewMessages = new MutationObserver(async entries => {
  checkForNewMembers.disconnect();
  //to avoid over rendering participation buttons, the mutator is deactivated for 2 seconds once that it is triggered.
  //it can be manually forced to re render the interface
  await delay(1000)  

  let messagesContainer = await getMessagesContainer();
  await addMessageMasButtons_messages(messagesContainer)

  await delay(2000)  
  checkForNewMembers.observe(participantsContainer, {childList: true, subtree: true});
})

async function addMessageMasButtons_messages(messagesContainer){
  for (let index = 0; index < messagesContainer.childNodes.length; index++) {
    let messageContainer = messagesContainer.childNodes[index];
    await addMessageMasButtons(messageContainer);
  }
}

async function addMessageMasButtons(messageContainer){
  let buttonsContainer = messageContainer.querySelector('#MeetMas_messages_buttonsContainer');
  if(isValidHTML(buttonsContainer))
    return

  await addButtonsContainer_Message(messageContainer);
  await addMessageMasButtons_message(messageContainer);
  await addParticipationButton_Message(messageContainer);

}

async function addButtonsContainer_Message(messageContainer){
  messageContainer.setAttribute("class", "MeetMas_messages_buttonsContainer_Father");

  let buttonsContainer = document.createElement("div");
  buttonsContainer.setAttribute("class", "MeetMas_messages_buttonsContainer");
  buttonsContainer.setAttribute("id", "MeetMas_messages_buttonsContainer");
  messageContainer.childNodes[0].appendChild(buttonsContainer);
  await delay(100);
}


async function addParticipationButton_Message(messageContainer){    
  //get id adn exclude youself from the list because the name is "you"
  let id= messageContainer.childNodes[0].childNodes[0].innerHTML;
  if(id.localeCompare("You") == 0)
    return

  //create container for buttons
  let buttonsContainer = messageContainer.querySelector("#MeetMas_messages_buttonsContainer");


  //add buttons
  var participationButtons = await createParticipationButtons();   
  buttonsContainer.appendChild(participationButtons);
    
  //add event listener
  setEventListeners_Participant(participationButtons, id)  
}

