
async function load_interfaceButtons(){  
    await addInterfaceButtons();

    //get variables    
    let hideInterfaceMenuButton = document.getElementById('hideInterfaceMenuButton')
    let meetingsMenuButton      = document.getElementById('meetingsMenuButton')
    let reloadExtensionButton   = document.getElementById('reloadExtensionButton')
    let tutorialButton          = document.getElementById('tutorialButton')
    let meetMasMenuButton       = document.getElementById('meetMasMenuButton')
    
    //add tooltips
    createToolTip("Hide/Show MeetMas extra buttons from the interface",                     hideInterfaceMenuButton, "hideInterfaceMenuButton");
    createToolTip("Find out what MeetMas can do for you here",                              tutorialButton, "tutorialButton");
    createToolTip("Show more functionalities for your meeting",                             meetMasMenuButton, "meetMasMenuButton");
    createToolTip("Problems with the participation buttons? Try reloading them (ctrl + a)", reloadExtensionButton, "reloadExtensionButton");
    createToolTip("Select a new file where to register participations",                     meetingsMenuButton, "meetingsMenuButton");
    
    
    let isHidden = false;
    hideInterfaceMenuButton.addEventListener("click", (e) =>{
        isHidden = controlHiddenStatus(isHidden);
    })  
    meetingsMenuButton.addEventListener("click", (e) =>{
        load_MeetingsMenu();
    })  
    reloadExtensionButton.addEventListener("click", (e) =>{   
        if(checkValidJSON(currentMeet))
            forceReload();
        else
            notify("To use this function, please select a meeting");
    })  
    tutorialButton.addEventListener("click", (e) =>{  
        openHomePage(); 
    })  
    meetMasMenuButton.addEventListener("click", (e) =>{   
        if(checkValidJSON(currentMeet))
            displayMeetMasMenu();
        else
            notify("To use this function, please select a meeting") ;
    })
  
}
  

async function addInterfaceButtons(){
    try {
        removeHTMLNode_byId("interfaceButtonContainer");      
    } catch (error) { 
    }
    let interfaceButtons = document.createElement("div");
    document.body.appendChild(interfaceButtons)
    interfaceButtons.appendChild( await getCSS('src/MeetMas/InterfaceButtons/InterfaceButtons.css') );
    interfaceButtons.innerHTML += await getTextContent('src/MeetMas/InterfaceButtons/InterfaceButtons.html');
}

function controlHiddenStatus(isHidden){
    if(isHidden){
        //unhide
        reloadExtensionButton.style.display = "inline";
        meetingsMenuButton.style.display = "inline";
        tutorialButton.style.display = "inline";
        hideInterfaceMenuButton.innerHTML = "<";
        return false;
    }
    else{
        //hide
        reloadExtensionButton.style.display = "none";
        meetingsMenuButton.style.display = "none";
        tutorialButton.style.display = "none";
        hideInterfaceMenuButton.innerHTML = ">";
        return true;
    }
}


function openHomePage(){
    window.open("",'_blank');
    document.body.appendChild();
}


/* 
This script loads the MeetMas menu.
It shows a list of all the members that have ever joined the meet, as long as they have been registered properly
To register them, it is enough to display the regular list of participants provided within the meet itself
Additionally, a updateList button is provided to simplify this task.

From this menu, it is possible to poll students in order to request participations, as well as registering the participation


*/
async function displayMeetMasMenu(){
    clearMeetMasMenu();

    await prepareContainerForMeetMasMenu();
    let meetMasMenu = await asyncQuery("div[jsname='ME4pNd']");
    await createMeetMasMenu(meetMasMenu);
    //add participants
    await addParticipantsToMeetMasMenu();


    //Event Listeners
    let detailsButton = document.querySelector("button[aria-label='Meeting details']");
    let CloseButton = document.getElementById("meetMasMenu_CloseButton");
    CloseButton.addEventListener("click", e => {
        detailsButton.click();    
    })
    let updateListButton = document.getElementById("MeetMas_meetMasMenu_updateListButton");
    updateListButton.addEventListener("click", async e => {
        membersButton.click();
        notify("Updating list of participants, please wait...")
        await delay(2500);
        displayMeetMasMenu();    
    })
    let randomParticipantButton = document.getElementById("MeetMas_meetMasMenu_randomParticipantButton");
    randomParticipantButton.addEventListener("click", e => {
        let participant = selectRandomParticipant(currentMeet["participants"]);
        Message("Random participant: " + participant);
    })
    let randomParticipantButton_Smart = document.getElementById("MeetMas_meetMasMenu_randomeParticipantButton_Smart");
    randomParticipantButton_Smart.addEventListener("click", e => {
        let participant = selectRandomParticipantSMart(currentMeet["participants"]);
        Message("(Smart) Random participant: " + participant);
    })
}

