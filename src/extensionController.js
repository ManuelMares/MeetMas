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
  await asyncQuery("button[aria-label='Chat with everyone']");
  meetId = window.location.href.substring(24);
  load_interfaceButtons();
  load_MeetingsMenu();
}


async function forceReload(){
  chatButton.click();
  await delay(500);
  membersButton.click();
}

async function load_interfaceButtons(){  
  try {
    removeHTMLNode_byId("interfaceButtonContainer");
  } catch (error) {  }
  let interfaceButtonsContainer = document.createElement("div");
  interfaceButtonsContainer.setAttribute("class", "interfaceButtonContainer");
  interfaceButtonsContainer.setAttribute("id", "interfaceButtonContainer");
  document.body.appendChild(interfaceButtonsContainer)
  
  //Hidden interface Menu Button
  let hideInterfaceMenuButton = document.createElement('button');
  hideInterfaceMenuButton.setAttribute("class", "MeetMas_InterfaceButton_hide");
  hideInterfaceMenuButton.setAttribute("id", "hideInterfaceMenuButton");
  hideInterfaceMenuButton.innerHTML = "<";
  interfaceButtonsContainer.appendChild(hideInterfaceMenuButton)
  let isHidden = false;
  hideInterfaceMenuButton.addEventListener("click", (e) =>{
    if(isHidden){
      //unhide
      isHidden = false
      reloadExtensionButton.style.display = "inline";
      meetingsMenuButton.style.display = "inline";
      tutorialButton.style.display = "inline";
      hideInterfaceMenuButton.innerHTML = "<";
    }
    else{
      //hide
      reloadExtensionButton.style.display = "none";
      meetingsMenuButton.style.display = "none";
      tutorialButton.style.display = "none";
      hideInterfaceMenuButton.innerHTML = ">";
      isHidden = true
    }
  })
  createToolTip("Hide/Show extra buttons from the interface", hideInterfaceMenuButton, "hideInterfaceMenuButton");

  
  //meetingsMenu Button
  let meetingsMenuButton = document.createElement('button');
  meetingsMenuButton.setAttribute("class", "MeetMas_InterfaceButton");
  meetingsMenuButton.setAttribute("id", "meetingsMenuButton");
  meetingsMenuButton.innerHTML = "Meetings";
  interfaceButtonsContainer.appendChild(meetingsMenuButton)

  meetingsMenuButton.addEventListener("click", (e) =>{
    load_MeetingsMenu();
  })
  createToolTip("Select a new file where to register participations", meetingsMenuButton, "meetingsMenuButton");

  //Reload extension Button
  let reloadExtensionButton = document.createElement('button');
  reloadExtensionButton.setAttribute("class", "MeetMas_InterfaceButton");
  reloadExtensionButton.setAttribute("id", "reloadExtensionButton");
  reloadExtensionButton.innerHTML = "Reload MeetMas";
  interfaceButtonsContainer.appendChild(reloadExtensionButton)

  reloadExtensionButton.addEventListener("click", (e) =>{    
    forceReload();
  })
  createToolTip("Problems with the participation buttons? Try reloading them (ctrl + a)", reloadExtensionButton, "reloadExtensionButton");

  //Reload extension Button
  let tutorialButton = document.createElement('button');
  tutorialButton.setAttribute("class", "MeetMas_InterfaceButton");
  tutorialButton.setAttribute("id", "tutorialButton");
  tutorialButton.innerHTML = "Tutorial";
  interfaceButtonsContainer.appendChild(tutorialButton)

  tutorialButton.addEventListener("click", (e) =>{    
    openHomePage();
  })
  createToolTip("Find out what MeetMas can do for you here", tutorialButton, "tutorialButton");

  //MeetMasMenu
  let meetMasMenuButton = document.createElement('button');
  meetMasMenuButton.setAttribute("class", "MeetMas_InterfaceButton");
  meetMasMenuButton.setAttribute("id", "meetMasMenuButton");
  meetMasMenuButton.innerHTML = "MeetMas Menu";
  interfaceButtonsContainer.appendChild(meetMasMenuButton)

  meetMasMenuButton.addEventListener("click", (e) =>{    
    displayMeetMasMenu();
  })
  createToolTip("Show more functionalities for your meeting", meetMasMenuButton, "meetMasMenuButton");

}




function openHomePage(){
  window.open("",'_blank');
  document.body.appendChild();
}



/*
Every time the members menu or the chat shows up, participation button must be added to the users
It has a delay so the properties of the HTML node have time to get updated
*/
async function startRegistering(){
  await loadGlobalVariables();
  loadParticipationButtons(); // from loadParticipationButtons.js
  setEventListenersForMenus();
  listenForForcedReload();
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


