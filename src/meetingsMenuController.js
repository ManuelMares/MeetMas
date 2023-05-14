/*
This script updates, loads and deletes meetings through the meeting menu

workflow:
meetingsController --(triggers)--> registerParticipations

The structure to create a new meet JSON object is as follows:
    meet = {
        meetId: "",
        meetName: "",
        meetLink: "",
        metaData: {
            creationDate:"",
            totalDates:"",
            totalParticipants:"",
        },
        Dates: [d1,d2,d3,...],
        participants:
        {
            p1: {d1:t1, d2:t2 },
            p2: {d1:t1, d2:t2 }
        }
    }

*/



/*
This is the main function of the script. It triggers the MeetingsMenu 
*/
async function load_MeetingsMenu(){
    await displayMeetings();
}

/*
Builds the container for the MeetingsMenu, and loads the options
*/
async function displayMeetings(){
    await display_SelectAMeeting_Menu();
    await display_SelectAMeeting_Meetings();
}

/*
Creates the MeetingsMenu container
*/
async function display_SelectAMeeting_Menu(){
    var selectMeeting_Container = document.createElement('div');
    selectMeeting_Container.innerHTML = await getTextContent('src/Menus/selectMeeting.html');
    selectMeeting_Container.appendChild( await getCSS('src/Menus/menusCSS.css') );   
    // selectMeeting_Container.innerHTML = await getTextContent('src/Menus/menusCSS.css');
    document.body.appendChild(selectMeeting_Container)
    
    //create new meeting button
    document.getElementById("Menus_newMeetingButton").addEventListener('click', (e) => {
        createNewMeet();
    })
    //close MeetingsMenu
    document.getElementById("Menus_selectMeeting_closeButton").addEventListener('click', (e) => {
        close_MeetingsMenu();
    })
}

/*
Populates the MeetingsMenu with all the available meeting options from the storage
*/
async function display_SelectAMeeting_Meetings(){
    retrieveMeetings()
    .then(async meetings => {
        for (let index = 0; index < meetings.length; index++) {
            addMeetOption(meetings[index]);            
        }
    });

}

/*
Creates the HTML controller object for each meeting in the meetingsMenu.
This element gives addEventListeners overs loading a meeting, editing it, or deleting it.
*/
async function addMeetOption(meet){
    let meetingsContainer = document.getElementById("Menus_selectMeeting_meetsOptions_container");
    let meetOption = document.createElement('button');
    meetOption.setAttribute("class", "MeetMas_SelectMeeting_MeetOption_container");
    
    //chose
    let selectButton = document.createElement('a');
    selectButton.innerHTML = "Select";
    selectButton.setAttribute("class", 'MeetMas_button MeetMas_acceptButton MeetMas_rounded');
    meetOption.appendChild(selectButton)
    selectButton.addEventListener('click', (e) => {
        e.stopPropagation();
        loadMeet(meet["meetId"]);
    })


    //title
    let title = document.createElement('p');
    title.innerHTML = meet["meetName"];
    title.setAttribute("class", 'MeetMas_SelectMeeting_MeetOption_title');
    meetOption.appendChild(title)
    
    //link
    let link = document.createElement('p');
    link.innerHTML = meet["meetLink"];
    link.setAttribute("class", 'MeetMas_SelectMeeting_MeetOption_link');
    meetOption.appendChild(link)
    
    //edit
    let editButton = document.createElement('a');
    editButton.setAttribute("class", 'MeetMas_button MeetMas_editButton MeetMas_rounded');    
        let editIcon = document.createElement('img');
        editIcon.setAttribute("src", 'chrome-extension://'+meetMasId+'/edit.svg');
        editIcon.setAttribute("class", "Menus_selectMeeting_EditIcon");
        editButton.appendChild(editIcon)
    meetOption.appendChild(editButton)
    editButton.addEventListener('click', (e) => {
        e.stopPropagation();
        editMeet(meet["meetId"]);
    })
    
    //delete
    let deleteButton = document.createElement('a');
    deleteButton.innerHTML = "X";
    deleteButton.setAttribute("class", 'MeetMas_button MeetMas_cancelButton MeetMas_rounded');
    meetOption.appendChild(deleteButton)
    deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteMeet(meet["meetId"]);
    })


    
    
    meetingsContainer.appendChild(meetOption)

}

/*
Deletes the HTML node of the MeetingsMenu from the interface
*/
function close_MeetingsMenu(){
    removeHTMLNode_byId("MeetMas_SelectMeeting_background");
}


//=======================================BUTTONS FUNCTIONALITY====================================
/*
This section contains the functionality triggered by the buttons generated in the meetingsMenu created above.
    *load a meeting
    *edit the properties of a meeting
    *delete a meeting
    *create a new meeting
*/

// LOAD MEET=========================================================================================
/*
Given an meetId, fetches the meet from the storage.
After this function is triggered, the control is transfered to registerParticipations.js
*/
function loadMeet(meetId){
    retrieveMeetFromStorage(meetId)
    .then(ans=>{
        if(!checkValidJSON(ans))
            return false
            
        currentMeet = ans;
        currentMeet["dates"] += getDate_YYYYMMDD();
        return true;
    })
    .then((gotMeet) => {
        if(gotMeet){
            close_MeetingsMenu();
            startRegistering();
            notify("meet " + meetId + " has been selected", meetId);
        }        
    })
}

// DELETE MEET=========================================================================================
/*
Deletes one meeting from the storage
*/
function deleteMeet(meetId){
    removeMeet(meetId).then(() => {
            //close all menus
            close_MeetingsMenu();
            //restart process
            load_MeetingsMenu();
    })
}

// EDIT MEET=========================================================================================
function editMeet(meetId){
    retrieveMeetFromStorage(meetId).then(meet => {
        display_editMeetingMenu(meet);
    })
}

/*
This function renders the menu for creating a new meeting, as well as creating the addEventlistener for the corresponding elements
*/
async function display_editMeetingMenu(meetToEdit){
    //load HTML
    var selectMeeting_Container = document.createElement('div');
    selectMeeting_Container.innerHTML = await getTextContent('src/Menus/editMeetMenu.html');
    document.body.appendChild(selectMeeting_Container)    

    //Get variables from the editMeetingMenu
    let editMeet_ButtonEdit = document.getElementById("MeetMas_editMeetMenu_footer_createButton");
    let editMeet_link = document.getElementById("MeetMas_editMeetMenu_link_value");
    let editMeet_id = document.getElementById("MeetMas_editMeetMenu_id_value");
    let editMeetMenu_CloseWindow = document.getElementById("MeetMas_editMeetMenu_closeButton");
    let editMeetMenu_title = document.getElementById("MeetMas_editMeetMenu_title");
    

    //set values for the elements and addEventListeners in the createMeetingMenu
    editMeet_id.innerHTML = meetToEdit["meetId"];
    editMeet_link.innerHTML = meetToEdit["meetLink"];  
    editMeetMenu_title.innerHTML +=  meetToEdit["meetName"];
    editMeet_ButtonEdit.addEventListener('click', (e)=>{
        updateMeet(meetToEdit);
    })    
    editMeetMenu_CloseWindow.addEventListener('click', (e)=>{
        close_editMeetMenu();
    })
}

/*
Deletes the HTML node create Edit Meet menu from the interface
*/
function close_editMeetMenu(){
    removeHTMLNode_byId("MeetMas_editMeetMenu_background");
}

function updateMeet(meetToEdit){
    let editMeet_input = document.getElementById("MeetMas_editMeetMenu_name_input");
    validateName(editMeet_input.value).then(isValid => {
        if(!isValid)
            return
        
        deleteMeet(meetToEdit["meetId"]);

        meetToEdit["meetName"] = editMeet_input.value;
        updateMeetInStorage(meetToEdit).then(() => {
            //close all menus
            close_editMeetMenu();
            close_MeetingsMenu();
            //restart process
            load_MeetingsMenu();
        })
    })
}




// CREATE NEW MEET=========================================================================================

let newMeet = {
    meetId: "",
    meetName: "",
    meetLink: "",
    metaData: {
        creationDate: "",
        totalDates: 0,
        totalParticipants: 0,
    },
    dates: [],
    participants:
    {}
}

/*
This function triggers the display of the create meeting function.
It is triggered by the addEventListener handler of the button New meeting
*/
async function createNewMeet(){
    await display_createMeetingMenu();
}

/*
This function renders the menu for creating a new meeting, as well as creating the addEventlistener for the corresponding elements
*/
async function display_createMeetingMenu(){
    //load HTML
    var selectMeeting_Container = document.createElement('div');
    selectMeeting_Container.innerHTML = await getTextContent('src/Menus/createMeet.html');
    document.body.appendChild(selectMeeting_Container)    

    //Get variables from the createMeetingMenu
    let createMeet_ButtonCreate = document.getElementById("MeetMas_createMeet_footer_createButton");
    let createMeet_link = document.getElementById("MeetMas_createMeet_link_value");
    let createMeet_CloseWindow = document.getElementById("MeetMas_createMeet_header_closeButton");
    let createMeet_id = document.getElementById("MeetMas_createMeet_id_value");
    
    //Setting the properties of the meet on the fly
    newMeet["meetId"] = getRandomId();
    newMeet["metaData"]["creationDate"] = getDate_YYYYMMDD();
    newMeet["meetLink"] = window.location.href;

    //set values for the elements and addEventListeners in the createMeetingMenu
    createMeet_id.innerHTML = newMeet["meetId"];
    createMeet_link.innerHTML = newMeet["meetLink"];   
    createMeet_ButtonCreate.addEventListener('click', (e)=>{
        storeNewMeet();
    })    
    createMeet_CloseWindow.addEventListener('click', (e)=>{
        close_createMeetMenu();
    })
}

/*
Deletes the HTML node create New Meet menu from the interface
*/
function close_createMeetMenu(){
    removeHTMLNode_byId("MeetMas_createMeet_background");
}

/*
Stores the new meeting in the storage when validated
addEventListener handler of the button "create meet".
*/
function storeNewMeet(){
    let createMeet_input = document.getElementById("MeetMas_createMeet_Name_input");
    validateName(createMeet_input.value).then(isValid => {
        if(!isValid)
            return

        newMeet["meetName"] = createMeet_input.value;
        createMeet(newMeet).then(() => {
            //close all menus
            close_createMeetMenu();
            close_MeetingsMenu();
            //restart process
            load_MeetingsMenu();
        })
    })
}

/*
This function validates the string name of the new meet in the menu create new meeting
*/
function validateName(name){
    return new Promise(resolve => {
        let errorMessage = document.getElementById("MeetMas_MeetMenu_ErrorMessage");
        if (name.localeCompare("") == 0){
            errorMessage.innerHTML = "The name you are trying to use in your meet is invalid.";
            return resolve(false);
        }
        meetExists(name).then( ans => { 
            if(ans){
                errorMessage.innerHTML = "The name you are trying to use in your meet is already being used.";
                return resolve(false);
            }
            errorMessage.innerHTML = "";
            return resolve(true)
        })
    });
}
