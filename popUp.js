
let meetMasId = "peeeelfbdfnbnefepkclgfgbmfnnnpki";
populateMeetOptions();


function populateMeetOptions(){
  retrieveMeetings()
  .then(async meetings => {
      for (let index = 0; index < meetings.length; index++) {
          addMeetOption(meetings[index]);            
      }
  });
}

async function addMeetOption(meet){
  console.log(meet)
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
  openButton.innerHTML = "open";
  openButton.setAttribute("class", 'MeetMas_MeetOption_button MeetMas_enterButton');
  meetOption.appendChild(openButton)
  openButton.addEventListener('click', (e) => {
      e.stopPropagation();
      openMeet(meet["meetLink"]);
  })

  //report
  let reportButton = document.createElement('a');
  reportButton.innerHTML = "download report";
  reportButton.setAttribute("class", 'MeetMas_MeetOption_button MeetMas_enterButton');
  meetOption.appendChild(reportButton)
  reportButton.addEventListener('click', (e) => {
      e.stopPropagation();
      //downloadReport(meet["meetLink"]);
  })
  
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
  deleteButton.innerHTML = "delete";
  deleteButton.setAttribute("class", 'MeetMas_MeetOption_button MeetMas_cancelButton');
  meetOption.appendChild(deleteButton)
  deleteButton.addEventListener('click', (e) => {
      e.stopPropagation();
      removeMeet(meet["meetId"]);
  })
  
  meetingsContainer.appendChild(meetOption)


  //tutorial button
  let tutorialButton = document.querySelector("#MeetMas_tutorialButton");
  tutorialButton.addEventListener('click', () =>{
    chrome.tabs.create({url : "HomePage.html"}); 
  })

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