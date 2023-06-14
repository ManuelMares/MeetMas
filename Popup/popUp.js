/*
This script controls the popup menu form the extension.
*/
//==================================================================================================================================
//GLOBAL VARIABLES
//==================================================================================================================================
let meetMasId = "dhijdfaoedpfdaeggoocdclejichafac";



//==================================================================================================================================
//START METHODS
//==================================================================================================================================
main();

/* 
Triggers all the functionallity in the popup menu
*/
function main(){
  populateMeetOptions();
  enableUploadButton();
}

/* 
Loads the event listener for the upload button for participation files in the popup
*/
function enableUploadButton(){
  document.getElementById("MeetMas_uploadFile_submitButton").addEventListener('click', () => {
    uploadMeet();
  })
}

/* 
Loads all the meets in the popup from storage
*/
function populateMeetOptions(){
  retrieveMeetings()
  .then(async meetings => {
      if(meetings.length == 0)
        return
      
      let meetingsContainer = document.getElementById("MeetMas_MeetingsContainer");
      meetingsContainer.innerHTML  = "";
      for (let index = 0; index < meetings.length; index++) {
          addMeetOption(meetings[index]);            
      }
      
      enableHomeButton();
  })
}

/* 
 Creates a new tab displaying the hamePage.html file
*/
function enableHomeButton(){
  let tutorialButton = document.querySelector("#MeetMas_tutorialButton");
  tutorialButton.addEventListener('click', () =>{
    chrome.tabs.create({url : "HomePage/HomePage.html"}); 
  })
}

//==================================================================================================================================
//MEET CONTROLS
//==================================================================================================================================

/* 
Loads all the meets in the popup
*/
async function addMeetOption(meet){
  let meetingsContainer = document.getElementById("MeetMas_MeetingsContainer");


  let meetOption = document.createElement("div");
  meetOption.setAttribute("class", "MeetMas_MeetOption");

  loadMeetOption_title(meetOption, meet);
  loadMeetOption_open(meetOption, meet);
  loadMeetOption_download(meetOption, meet);
  loadMeetOption_delete(meetOption, meet);
  
  //open report in google sheets
  // let sheetsButton = document.createElement('a');
  // sheetsButton.innerHTML = "Open sheet";
  // sheetsButton.setAttribute("class", 'MeetMas_MeetOption_button MeetMas_enterButton');
  // meetOption.appendChild(sheetsButton)
  // sheetsButton.addEventListener('click', (e) => {
  //     e.stopPropagation();
  //     create("new file");
  //     //downloadReport(meet["meetId"]);
  // })

  //edit
  // let editButton = document.createElement('a');
  // editButton.setAttribute("class", 'MeetMas_MeetOption_button MeetMas_optionButton'); 
  // editButton.innerHTML += "edit";
  // meetOption.appendChild(editButton)
  // editButton.addEventListener('click', (e) => {
  //     e.stopPropagation();
  //     editMeet(meet["meetId"]);
  // })
  
  
  meetingsContainer.appendChild(meetOption)
}



//TITTLE======================================================================
/* 
Loads the title for for a given meet
*/
function loadMeetOption_title(meetOption, meet){
  let title = document.createElement('p');
  title.innerHTML = meet["meetName"];
  title.setAttribute("class", 'MeetMas_MeetOption_title');
  meetOption.appendChild(title)
}

//OPEN BUTTON======================================================================
/* 
Loads the open button for for a given meet
*/
function loadMeetOption_open(meetOption, meet){
  let openButton = document.createElement('a');
  openButton.innerHTML = "Open Meet";
  openButton.setAttribute("class", 'MeetMas_MeetOption_button MeetMas_enterButton');
  meetOption.appendChild(openButton)
  openButton.addEventListener('click', (e) => {
      e.stopPropagation();
      openMeet(meet["meetLink"]);
  })
}

/* 
Opens the meet link in a new tab
*/
function openMeet(meetLink){
  window.open(meetLink, '_blank').focus();
}




//DELETE BUTTON======================================================================
/* 
Loads the delete button for for a given meet
*/
function loadMeetOption_delete(meetOption, meet){
  let deleteButton = document.createElement('a');
  deleteButton.innerHTML = "Delete";
  deleteButton.setAttribute("class", 'MeetMas_MeetOption_button MeetMas_cancelButton');
  meetOption.appendChild(deleteButton)
  deleteButton.addEventListener('click', (e) => {
      e.stopPropagation();
      removeMeet(meet["meetId"]).then(() => {        
        reload();
      })
  })
}






//DOWNLOAD BUTTON======================================================================
/* 
Loads the download button for for a given meet
*/
function loadMeetOption_download(meetOption, meet){
  let reportButton = document.createElement('a');
  reportButton.innerHTML = "Download";
  reportButton.setAttribute("class", 'MeetMas_MeetOption_button MeetMas_enterButton');
  meetOption.appendChild(reportButton)
  
  reportButton.addEventListener('click', (e) => {
    e.stopPropagation();
    downloadReport(meet["meetId"]);
  })
}

async function downloadReport(meetId){
  let meetCSV = null
  await retrieveMeetFromStorage(meetId).then(meet => {
    meetCSV = meetingToString(meet);
    downloadParticipationCSV(meetCSV, meet);
  })
}


function reload(){
  document.querySelector("#MeetMas_MeetingsContainer").innerHTML = "";
  populateMeetOptions();
}






function uploadMeet(){
  let file = document.getElementById("MeetMas_uploadFile").files[0];
  
  if(!file){
    displayErrorMessage("Invalid file");
    return;
  }

  if(file["type"].localeCompare("text/csv") != 0){
    displayErrorMessage("File must be csv type");
    return;
  }

  // let csvArray = getCSVArray(file);
  getCSVArray(file);
  
  // if(csvArray.length == 0){
  //   displayErrorMessage("The given file is empty");
  //   return;
  // }

  // meet = {
  //   meetId: "",
  //   meetName: "",
  //   meetLink: "",
  //   metaData: {
  //       creationDate:"",
  //       totalDates:"",
  //       totalParticipants:"",
  //   },
  //   Dates: [d1,d2,d3,],
  //   participants:
  //   {
  //       p1: {d1:t1, d2:t2 },
  //       p2: {d1:t1, d2:t2 }
  //   }
  // }

  // meet = {
  //   meetId: "",
  //   meetName: "",
  //   meetLink: "",
  //   metaData: {
  //       creationDate:"",
  //       totalDates:"",
  //       totalParticipants:"",
  //   },
  //   dates: [d1,d2,d3,],
  //   participants:
  //   {
  //       p1: {d1:t1, d2:t2 },
  //       p2: {d1:t1, d2:t2 }
  //   }
  // }
  // try {
    
    
  // } catch (error) {
    
  // }
  
}

function getCSVArray(file){
  
  meet = {
    meetId: "",
    meetName: "",
    meetLink: "",
    metaData: {
        creationDate:"",
        totalDates:"",
        totalParticipants:"",
    },
    dates: [], //d1,d2,d3
    participants:
    {
        //p1: {d1:t1, d2:t2 },
        //p2: {d1:t1, d2:t2 }
    }
  }
  
  let reader = new FileReader();
  let csvArray;
  reader.addEventListener('load', function (e) {
    let csvString = e.target.result; 
    const regex = new RegExp(",*", "g")
    csvString = csvString.replaceAll(/\r/g, ',');
    csvString = csvString.replaceAll(/,+/g, ',');
    csvArray = csvString.split("\n");
    // console.log(tempArray)
    cvsToMeet(meet, csvArray);
    createMeet(meet).then(meetWasCreated => {
      if(!meetWasCreated)
        displayErrorMessage("File name already exists. Please change 'Meet Name' inside the cvs file");
      else
        displayErrorMessage("");
     })
      
  });
  reader.readAsBinaryString(file);


}


function cvsToMeet(meet, array){
  //data an meta data
  meet["meetName"] =  array[0].substring(13, array[0].length - 1);
  meet["meetLink"] =  array[1].substring(10, array[1].length - 1);
  meet["meetId"] =  array[2].substring(8, array[2].length - 1);
  meet["metaData"]["creationDate"] =  array[3].substring(14, array[3].length - 1);
  // meet["metaData"]["totalDates"] =  Number(array[4].substring(12, array[4].length - 1));
  
  //dates array
  meet["dates"] = [];
  let datesArray =  array[6].substring(6, array[6].length - 21).split(",");
  for (let index = 0; index < datesArray.length; index++) {
    if(datesArray[index].localeCompare("") != 0)
    meet["dates"].push(datesArray[index])    
  }
  meet["metaData"]["totalDates"] =  Number(meet["dates"].length);
  
  //index 8 is the first participant
  //add participants with dates
  //p: {date: value, date2: value2}
  let numDates = meet["dates"].length
  for (let pIndex = 7; pIndex < array.length -1; pIndex++) {
    let participant = array[pIndex].split(",");
    if(participant[participant.length - 1].localeCompare("") == 0)
      participant.pop()
    
    //key = name
    let pName = "";
    for (let nIndex = 0; nIndex < participant.length - numDates - 1; nIndex++) {
      pName += participant[nIndex];
    }

    

    //value: [ {date:value} ]
    meet["participants"][pName] = {};
    let counterDate = 0
    for (let dateIndex = participant.length - numDates - 1; dateIndex < participant.length -1; dateIndex++) {
      meet["participants"][pName][meet["dates"][counterDate]] = participant[dateIndex];
      counterDate ++;
    }
        
  }
  
  // console.log(meet)
  //return meet;
}



function displayErrorMessage(message){
  let text = document.getElementById("MeetMas_uplodFile_errorMessage");
  text.innerHTML = message

}



//Manage Storage===========================================================================================================
function retrieveMeetings(){    
  return new Promise(resolve => {
      //get meet from storage
      chrome.storage.local.get(null, function(result){ 
          if(!checkValidJSON(result))
              return []
              
          meetings = []            
          let meetingsIds = Object.keys(result);

          //check only for stores files that start with "MeetMas"
          for (let index = 0; index < meetingsIds.length; index++) {
              if(isValidMeet(meetingsIds[index]))
                  meetings.push(result[meetingsIds[index]]);
          }
          return resolve(meetings);
      });
      //return the meet from memory
  });
}

function removeMeet(id){
  return new Promise(resolve => {
      chrome.storage.local.remove([id],function(result){
          return resolve();
      })
  });
  
}

function checkValidJSON(param) {
  return !(Object.keys(param).length === 0);
}

function isValidMeet(meetId){
  if(meetId.substring(0,7).localeCompare("MeetMas") == 0)
      return true;
  return false;
}


function retrieveMeetFromStorage(id){  
  return new Promise(resolve => {
      chrome.storage.local.get(id, function(result){
          let meetingsIds = Object.keys(result);  
          return resolve(result[meetingsIds[0]]);
      });
  });
}


function createMeet(meet){ 
  return new Promise(resolve => {
    console.log("receiving name: " , meet["meetName"])
      // if(meetExists(meet["meetName"])){
      //   console.log("Id already exists!")
      //   // return resolve(false)
      // }
      meetNameExists(meet["meetName"]).then(nameIsTaken => {
        console.log("======================", nameIsTaken)
        if(nameIsTaken){
          console.log("repeated name!")
          return resolve(false)
        }
        let newMeet = {};
        meet["meetId"] =  getRandomId();
        newMeet[meet["meetId"]] = meet;       
        chrome.storage.local.set(newMeet, function(result){
            return resolve(true)
        });
      }).then(() => {        
        reload();
      })
  });
}


/*
Checks if the 
@param name
    The name of the meeting to search, not the id
@return 
    A boolean value indicating if the name has been already registered
*/
function meetNameExists(name){
  return new Promise(resolve => {
      chrome.storage.local.get(null, function(result){ 
          console.log("===================================")
          console.log("result: ", result)
          if(!checkValidJSON(result))
              return resolve(false)
                                
          let meetingsIds = Object.keys(result);   
          //check only for meets that match the 
          for (let index = 0; index < meetingsIds.length; index++) {
              console.log(result[meetingsIds[index]]["meetName"], name) 
              if(isValidMeet(meetingsIds[index])  && result[meetingsIds[index]]["meetName"].localeCompare(name) == 0)
                return resolve(true)
          }
          return resolve(false);
      });
  });
}

/*
Checks if the 
@param name
    The name of the meeting to search, not the id
@return 
    A boolean value indicating if the name has been already registered
*/
function meetExists(name){
  return new Promise(resolve => {
      chrome.storage.local.get(null, function(result){ 
          if(!checkValidJSON(result))
              return resolve(false)
                                
          let meetingsIds = Object.keys(result);   
          //check only for meets that match the 
          for (let index = 0; index < meetingsIds.length; index++) {
              if(isValidMeet(meetingsIds[index])  && result[meetingsIds[index]]["meetName"].localeCompare(name) == 0)
                  return resolve(true)
          }
          return resolve(false);
      });
  });
}


//helper==================================================================================

function removeHTMLNode(selector){
  if(elementExists(selector)){
    document.querySelector(selector).remove();
  }

  if(elementExists(selector))
    document.querySelector(selector).outerHTML = "";

}


function elementExists(query){
  let el = document.querySelector(query);
  if(!el)
    return false;
  return true;
}


function meetingToString(meeting){
  console.log(meeting)
  let answer = ""

  
  //add info
  answer += "Meet Name,"     + meeting["meetName"] + ",\n";
  answer += "Meet Link,"     + meeting["meetLink"] + ",\n";
  answer += "Meet Id,"       + meeting["meetId"] + ",\n";
  answer += "Creation Date," + meeting["metaData"]["creationDate"] + ",\n";
  answer += "Total Dates,"   + meeting["metaData"]["totalDates"] + ",\n";
  answer += "\n"

  //Dates row
  answer += ["Dates,"]
  for (let index = 0; index < meeting["dates"].length; index++) {
    answer += meeting["dates"][index] +",";
  }
  answer += "Total Participations\n";
  

  //Participants
  let participants =  Object.keys(meeting["participants"])
  for (let participantIndex = 0; participantIndex < participants.length; participantIndex++) {
    let totalParticipationsPerParticipant = 0
    let participantName = participants[participantIndex]
    let dates = Object.keys(meeting["participants"][participantName])
    
    answer += participantName + ",";
    for (let dateIndex = 0; dateIndex < dates.length; dateIndex++) {
      let date = String(dates[dateIndex]);
      let participationValue = meeting["participants"][participantName][date]
      answer += participationValue + ",";    
      totalParticipationsPerParticipant += Number(participationValue)
    }
    answer += totalParticipationsPerParticipant + "\n"
  }
  
  return answer;
}



function downloadParticipationCSV(csv, meeting){
  let csvContent = csv;
  let docTitle = meeting["meetName"] + ".csv";

  var encodedUri = "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("id", "MeetMasDownloadLink " + meeting["meetName"]);
  link.setAttribute("download", docTitle);
  document.body.appendChild(link); // Required for FF
  
  link.click();
  removeHTMLNode("#MeetMasDownloadLink " + meeting["meetName"])
}

function getRandomId(){
  return ("MeetMas" + Date.now().toString(16) + Math.random().toString(16)).replace(".","")
}