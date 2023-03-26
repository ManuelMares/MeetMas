var participations = new Participants();
startRegistering();
var addElements = true

async function startRegistering(){  
  //Check when the app loaded completily
  const chatButton = await waitForElm("button[aria-label='Chat with everyone']");
  const membersButton = await waitForElm("button[aria-label='Show everyone']"); 
  const menu = document.querySelector("div[jsname='ME4pNd']")

  //set the menus when the app starts
  triggerMenus(chatButton, membersButton);
  loadParticipant_WhenMenuOpens();

  //add buttons the first time
  let membersMenu = await waitForElm("div[data-tab-id='1']");
  let chatMenu = await waitForElm("div[data-tab-id='2']");   
  membersButton.addEventListener('click', e => {loadParticipant_AfterClick(membersMenu, chatMenu)});
  chatButton.addEventListener('click', e => {loadParticipant_AfterClick(membersMenu, chatMenu)});
}




/* 
This functions opens chat menu and the members menu in google teams sequentially

The menus have to be open at least once before they exist. This functions guarantees they exist.
A delay of aprox a second is necessary for the menus to have time to load

@param chatButton
An HTML node 
@param membersButton
An HTML node 
*/
async function triggerMenus(chatButton, membersButton){
  chatButton.click();
  await delay(1000);
  membersButton.click();
}

/*
Every time the members menu or the chat shows up, participation button must be added to the users

@param memberMenu
An HTML node

@param chatMenu
An HTML node
*/
async function loadParticipant_AfterClick( membersMenu, chatMenu){
  addElements = true;
  await delay(500); //so the properties of the HTML node have time to get updated
  if(!membersMenu.classList.contains("qdulke")){
    loadParticipant_WhenMenuOpens();
  }  
  if(!chatMenu.classList.contains("qdulke")){
  }
}



/*
This function add the participants in the menu that currently opened, and sets a new mutator for it
*/
async function loadParticipant_WhenMenuOpens(){
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
    let rol= participantContainer.childNodes[0].childNodes[1].childNodes[1].innerHTML;
    var participationButtons = await createParticipationButtons();    
    participantContainer.appendChild(participationButtons);
    setEventListeners_Participant(participationButtons, id)
    participations.addParticipant(id)
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


function setEventListeners_Participant(participationButtons, name){
  let positiveP_Button = participationButtons.childNodes[0];
  let negativeP_Button = participationButtons.childNodes[2];
  
  let positiveId = name + "_Positive";
  let negativeId = name + "_Negative";
  
  positiveP_Button.setAttribute("id",positiveId);
  negativeP_Button.setAttribute("id", negativeId);

  
  positiveP_Button.addEventListener('click', e => {addPositiveParticipation(positiveId)});
  negativeP_Button.addEventListener('click', e => {addNegativeParticipation(negativeId)});
}
  


function addPositiveParticipation(positiveId){
  let id = positiveId.substring(0, positiveId.length - 9);
  let type = "Positive";
  createNotification(type, id);
}
function addNegativeParticipation(negativeId){
  let id = negativeId.substring(0, negativeId.length - 9);
  let type = "Negative";
  createNotification(type, id);
}



async function createNotification(type, id){
  let value = 1;
  var participationNotificationContainer = document.createElement('div');
  participationNotificationContainer.innerHTML = await getTextContent('src/notifications/addedParticipation.html');
  participationNotificationContainer.appendChild( await getCSS('src/notifications/addedParticipation.css') );   
  if(type == "Negative"){
    value = -1;
    participationNotificationContainer.childNodes[0].style.backgroundColor = '#073688';
  }
  participationNotificationContainer.childNodes[0].innerHTML = type + " participation added to: " + id;
  document.body.appendChild(participationNotificationContainer);
  await delay(2000)
  participationNotificationContainer.remove();
  addParticipation(id, type, value);
}


function addParticipation(id, type, value){
  participations.addParticipation(id, type, value);
}

function downloadParticipationReport(){
  console.log("we are requested something")
  console.log(participations)
  let csvContent = participations.csvFormat_all();

  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "reportParticipation.csv");
  document.body.appendChild(link); // Required for FF
  
  link.click();
  return "done";
}




chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.type == "downloadReport"){
      downloadParticipationReport();                        
      sendResponse("done")
    }
    return true;
  }
);