
let meetMasId = "peeeelfbdfnbnefepkclgfgbmfnnnpki";
populateMeetOptions();


function populateMeetOptions(){
  retrieveMeetings()
  .then(async meetings => {
      for (let index = 0; index < meetings.length; index++) {
          addMeetOption(meetings[index]);            
      }
      
      //tutorial button
      let tutorialButton = document.querySelector("#MeetMas_tutorialButton");
      tutorialButton.addEventListener('click', () =>{
        chrome.tabs.create({url : "HomePage.html"}); 
      })
  });

}

async function addMeetOption(meet){
  let meetingsContainer = document.getElementById("MeetMas_MeetingsContainer");


  let meetOption = document.createElement("div");
  meetOption.setAttribute("class", "MeetMas_MeetOption");

  //title
  let title = document.createElement('p');
  title.innerHTML = meet["meetName"];
  title.setAttribute("class", 'MeetMas_MeetOption_title');
  meetOption.appendChild(title)
  
  //open
  let openButton = document.createElement('a');
  openButton.innerHTML = "Open Meet";
  openButton.setAttribute("class", 'MeetMas_MeetOption_button MeetMas_enterButton');
  meetOption.appendChild(openButton)
  openButton.addEventListener('click', (e) => {
      e.stopPropagation();
      openMeet(meet["meetLink"]);
  })


  //download report
  let reportButton = document.createElement('a');
  reportButton.innerHTML = "Download";
  reportButton.setAttribute("class", 'MeetMas_MeetOption_button MeetMas_enterButton');
  meetOption.appendChild(reportButton)
  reportButton.addEventListener('click', (e) => {
      e.stopPropagation();
      downloadReport(meet["meetId"]);
  })
  
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
  
  //delete
  let deleteButton = document.createElement('a');
  deleteButton.innerHTML = "Delete";
  deleteButton.setAttribute("class", 'MeetMas_MeetOption_button MeetMas_cancelButton');
  meetOption.appendChild(deleteButton)
  deleteButton.addEventListener('click', (e) => {
      e.stopPropagation();
      removeMeet(meet["meetId"]);
  })
  
  meetingsContainer.appendChild(meetOption)

}

function openMeet(meetLink){
  window.open(meetLink, '_blank').focus();
}


function editMeet(meetId){
  //todo: do at the ends
}

function reload(){
  document.querySelector("#MeetMas_MeetingsContainer").innerHTML = "";
  populateMeetOptions();
}



async function downloadReport(meetId){
  let meetCSV = null
  await retrieveMeetFromStorage(meetId).then(meet => {
    meetCSV = meetingToString(meet);
    downloadParticipationCSV(meetCSV, meet);
  })
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
          reload();
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