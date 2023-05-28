

async function clearMeetMasMenu(){
    removeHTMLNode("#meetMasMenu_container");
}

async function addParticipantsToMeetMasMenu(){
    let namesOrderedList = getSortedNamesParticipants();


    let participantsContainer = document.getElementById("MeetMas_meetMasMenu_Participants");
    namesOrderedList.forEach(async name => {
        let participantContainer = document.createElement("div");
        participantContainer.setAttribute("class", "MeetMas_meetMasMenu_Participant MeetMas_hoverOption MeetMas_rounded");
        participantContainer.setAttribute("id", "MeetMas_meetMasMenu_Participant" + name);

            let nameHTML = document.createElement("div");
            nameHTML.setAttribute("class", "MeetMas_meetMasMenu_Participant_name");
            nameHTML.innerHTML = name;
            participantContainer.appendChild(nameHTML);
                        
            var participationButtons = await createParticipationButtons();    
            participantContainer.appendChild(participationButtons);
            setEventListeners_Participant(participationButtons, name)
        
        
        participantsContainer.appendChild(participantContainer);
    });


}

function getSortedNamesParticipants(){
    let namesOrderedList = []
    let participants = currentMeet["participants"];
    let keys = Object.keys(participants)
    keys.forEach(key => {
        namesOrderedList.push(key);       
    });
    namesOrderedList.sort();
    return namesOrderedList;
}



async function createMeetMasMenu(meetMasMenu){
    //The container has to be created due to the HTML trusted types policy
    let container = document.createElement("div");
    container.setAttribute("class", "MeetMas_meetMasMenu_container");
    container.setAttribute("id", "meetMasMenu_container");
    
    let MeetMasMenuContent = await getTextContent('src/MeetMas/MeetMasMenu/MeetMasMenu.html');
    container.innerHTML +=  MeetMasMenuContent;

    meetMasMenu.appendChild(container);
    //create tooltips
    let updateListButton = document.getElementById("MeetMas_meetMasMenu_updateListButton");
    createToolTip("Get new members currently in the meet and update the selected meet", updateListButton,   "updateListButton");

    let randomParticipantButton = document.getElementById("MeetMas_meetMasMenu_randomParticipantButton");
    createToolTip("Poll a random participant", randomParticipantButton, "randomParticipantButton");

    let randomeParticipantButton_Smart = document.getElementById("MeetMas_meetMasMenu_randomeParticipantButton_Smart");
    createToolTip("Chose randomly from the people with least participations", randomeParticipantButton_Smart, "randomeParticipantButton_Smart");

    document.getElementById("MeetMas_headerTitle_content").innerHTML = currentMeet["meetName"];
} 

async function prepareContainerForMeetMasMenu(){
    let detailsButton = document.querySelector("button[aria-label='Meeting details']");
    
    //This action garantees the menu exists
    detailsButton.click();    
    let detailsMenu = await asyncQuery("div[data-tab-id='5']");

    //use the empty container to display MeetMas menu
    if(detailsMenu.classList.contains("qdulke")){
        await delay(500)
        detailsButton.click();
        await delay(500)
    }

    detailsMenu.classList.add("qdulke");
}


function selectRandomParticipant(participants){
    let keys = Object.keys(participants)
    let randomIndex = Math.floor(Math.random() * keys.length);
    return keys[randomIndex];
}

function selectRandomParticipantSMart(participants){
    participants["Francisco Manuel Mares Solano"]["2023/4/3"] = 0;
    updateMeetInStorage(currentMeet)

    let names = Object.keys(participants)
    let totalParticipations = {} // {name:total}
    names.forEach(name => {
        totalParticipations[name] = countParticipations(participants[name]);
    });
    lowestParticipants = getLowestParticipants(totalParticipations);    
    
    let randomIndex = Math.floor(Math.random() * lowestParticipants.length);
    return lowestParticipants[randomIndex];
}

function getLowestParticipants(participations){
    //get high boundary to avoid weird behaviour
    let largest = 0;
    for (const [key, value] of Object.entries(participations)) {
        if(value > largest)
            largest = value;
    }
    
    //get lowest number
    let lowest = largest;
    for (const [key, value] of Object.entries(participations)) {
        if(value < lowest)
            lowest = value;
    }

    //
    let lowestP = [];
    for (const [key, value] of Object.entries(participations)) {
        if(value == lowest)
            lowestP.push(key)
    }

    return lowestP;
}

function countParticipations(participant){
    let count = 0;
    let dates = Object.keys(participant)
    dates.forEach(date => {
        count += participant[date];
    });

    
    return count;

}
