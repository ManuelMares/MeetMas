/*
This script is in charge of controlling the extension. This script:
  loads, stores and updates the participation files
  Checks for events in the interface that update the state of the extension
  Manages the interface controls (meetings, reload, etc.)

This file must be loaded before main.js in the manifest
*/




/*
This function triggers all the methods in the extension.
After making sure the interface of the meet has been loaded, it choses a meet and start registering participations
*/
async function StartExtension(){
  await meetIsReady();
  meetId = window.location.href.substring(24);
  load_MeetingsMenu();
}

async function meetIsReady(){
  await asyncQuery("button[aria-label='Chat with everyone']");
}


async function forceReload(){
  chatButton.click();
  await delay(500);
  membersButton.click();
}






/*
Every time the members menu or the chat shows up, participation button must be added to the users
It has a delay so the properties of the HTML node have time to get updated
*/
async function startRegistering(){
  if(interfaceLoaded){
    return;
  }
  await loadGlobalVariables();
  loadParticipationButtons(); // from loadParticipationButtons.js
  setEventListenersForMenus();
  listenForForcedReload();
  interfaceLoaded = true;
}

/*
Allows to force a reload of the participation buttons.
This function listens for the key combination ctrl+a.
When triggered, it reloads the participation buttons in the interface
*/
function listenForForcedReload(){
  document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'a')
    forceReload();
  });
}

/* 
This function loads the global variables.
In order to load all the variables, it is necessary to open the chat and members menus
*/
async function loadGlobalVariables(){  
  await loadGlobalVariables_buttons();
  triggerMenus(chatButton, membersButton);
  await loadGlobalVariables_menus();
}

/* 
This function loads the buttons in global variables in an asyncronous way, to make sure they exist
*/
async function loadGlobalVariables_buttons(){
  chatButton = await asyncQuery("button[aria-label='Chat with everyone']");
  membersButton = await asyncQuery("button[aria-label='Show everyone']"); 
  menu = document.querySelector("div[jsname='ME4pNd']");
}

/* 
This function loads the menus triggered by buttons in global variables in an asyncronous way, to make sure they exist
*/
async function loadGlobalVariables_menus(){
  chatMenu = await asyncQuery("div[data-tab-id='2']");
  membersMenu = await asyncQuery("div[data-tab-id='1']");
}

/* 
This function opens members menu in the Google meet by simulating a click

@param chatButton
An HTML node 
@param membersButton
An HTML node 
*/
async function triggerMenus(chatButton, membersButton){
  chatButton.click();
  await delay(500); //To give time to the animations to work
  membersButton.click();
}


/* 
This function sets the addEventListeners for the membersMenu and the chatMenu.
Everytime the menu is displayed, the participation buttons will be loaded
*/
function setEventListenersForMenus(){
  membersButton.addEventListener('click', e => {loadParticipationButtons_AfterClick()});
  chatButton.addEventListener('click', e => {loadParticipationButtons_AfterClick()});
}

/*
Every time the members menu or the chat shows up, participation button must be added to the users
It has a delay so the properties of the HTML node have time to get updated
*/
async function loadParticipationButtons_AfterClick( ){  
  await loadParticipationButtons();
}


