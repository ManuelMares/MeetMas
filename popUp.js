let meetings = {}
retrieveMeetings().then(ans =>{  
  let buttonsContainer = document.getElementById("MeetMasFilesContainer");
  let meetingsIds = Object.keys(ans);
  for (let index = 0; index < meetingsIds.length; index++) {
    let meeting = ans[meetingsIds[index]];
    let meetingId = meeting["title"]["id"]
    console.log(buttonsContainer)
    buttonsContainer.appendChild(createButton(meetingId));
    meetings[meetingId] = meeting;
  }
})


function downloadReport(id){
    return new Promise((resolve, reject) => {        
      chrome.runtime.sendMessage(
        {
            type: "popup_downloadReport",
            meeting: meetings[id]
        },
        function (response) 
        {
            resolve( response );
            reject(ans => {console.log("reject: ", ans)})
        }
      )
    })
}

function retrieveMeetings(){    
  return new Promise(resolve => {
      //get meet from storage
      chrome.storage.local.get(null, function(result){
          //if returned meet is not valid (didn't exists), create a new one with current information and put it in memory
          return resolve(result);
      });
      //return the meet from memory
  });
}




function createButton(id){
  let container = document.createElement("div");
  container.setAttribute("id", id);
  container.setAttribute("class", "MeetMas_Meet");
  
  let description = document.createElement("div");
  description.setAttribute("id", "description"+id);
  description.setAttribute("class", "MeetMas_MeetData");
  description.innerHTML=id;

  let button = document.createElement("button");
  button.setAttribute("id", "button"+id);
  button.setAttribute("class", "MeetMas_MeetButton");
  button.innerHTML="download";
  button.addEventListener("click", e=>{
    downloadReport(id);
  })

  container.appendChild(description);
  container.appendChild(button);
  console.log(container)
  return container;
}



