/* 
This functions wait for a given amount of time before finalizing 

This function returns a promise to garantee that the indicated time ocurred
@param timeMs
An integer indicating the time to wait for in ms
*/
const delay = (timeInMs) => {
  return new Promise(resolve => {    
      setTimeout(function() {
        resolve();
      }, timeInMs)
  });
}


/* 
This function waits until an HTML element exists, and returns it when that happens

All process will stop until the element exists

@param selector
A selector property from the element to wait for
*/
function asyncQuery(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }
        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}




async function createToolTip(message, father, id){
  let toolTip = getToolTipHTML(message, id);  
  
  //delete tool tip if it exists
  document.addEventListener('mousemove', async ()=>{
    if(!elementExists("#MeetMas_toolTip"+id)){
      father.style.position = "";
    }
    removeHTMLNode("#MeetMas_toolTip"+id) 
  })

  //add tooltip if necessary and it does not exists
  document.addEventListener('mousemove', async ()=>{
    await delay(1000);
    if( father.matches(':hover') ){
      if(!elementExists("#MeetMas_toolTip"+id)){
        father.style.position = "relative";
        father.appendChild(toolTip)    
      }
    }
  })

}

function getToolTipHTML(message, id){
  let toolTip = document.createElement("div");
  toolTip.setAttribute("class", "MeetMas_toolTip");
  toolTip.setAttribute("id", "MeetMas_toolTip" + id);
  toolTip.innerHTML = message;
  return toolTip;
}









//usage: selectMeeting_Container.innerHTML = await getTextContent('src/Menus/selectMeeting.html');
async function getTextContent(dir){  
return fetch(chrome.runtime.getURL(dir))
.then((resp) => { return resp.text(); })
.then((content) => { 
    return  content;
});
}

//usage: selectMeeting_Container.appendChild( await getCSS('src/Menus/menusCSS.css') );   

async function getCSS(cssDir){
var style = document.createElement( 'style' );
style.innerHTML = await getTextContent(cssDir);
return style;
}


function checkValidJSON(param) {
  return !(Object.keys(param).length === 0);
}



function getRandomId(){
  return ("MeetMas" + Date.now().toString(16) + Math.random().toString(16)).replace(".","")
}

function getDate_YYYYMMDD(){
  return new Date().getFullYear() + "/" +new Date().getMonth() + "/" + new Date().getDay();
}


/*
Deletes the HTML node given an id
*/
function removeHTMLNode_byId(id){
  document.getElementById(id).outerHTML = "";
}


function removeHTMLNode(selector){
  if(elementExists(selector)){
    document.querySelector(selector).remove();
  }

  if(elementExists(selector))
    document.querySelector(selector).outerHTML = "";

  //In case in needs TrustedHTML assignment
}



async function Message(message, id){
  //create element
  var notification = document.createElement('div');
  notification.setAttribute("id", "notification"+id)
  notification.innerHTML = await getTextContent('src/notifications/notification.html');
  notification.appendChild( await getCSS('src/notifications/notification.css') ); 
  
  //put in body
  document.body.appendChild(notification);

  //update all names to include the id
  //container
  let container = document.getElementById("meetMas_notification_Container");
  container.setAttribute("id", "meetMas_notification_Container" + id);
  //text
  let text = document.getElementById("meetMas_notification_message");
  text.setAttribute("id", "meetMas_notification_message" + id);
  //button
  let button = document.getElementById("meetMas_notification_closeButton");
  button.setAttribute("id", "meetMas_notification_closeButton" + id);
  
  //set message
  text.innerHTML = message

  //addEventListener
  button.addEventListener("click", (e) => {
    removeHTMLNode_byId("notification"+id);
  })

}


async function notify(message, id){
  //create element
  var notification = document.createElement('div');
  notification.setAttribute("id", "notification"+id)
  notification.innerHTML = await getTextContent('src/notifications/notification.html');
  notification.appendChild( await getCSS('src/notifications/notification.css') ); 
  
  //put in body
  document.body.appendChild(notification);

  //update all names to include the id
  //container
  let container = document.getElementById("meetMas_notification_Container");
  container.setAttribute("id", "meetMas_notification_Container" + id);
  //text
  let text = document.getElementById("meetMas_notification_message");
  text.setAttribute("id", "meetMas_notification_message" + id);
  //button
  let button = document.getElementById("meetMas_notification_closeButton");
  button.setAttribute("id", "meetMas_notification_closeButton" + id);
  
  //set message
  text.innerHTML = message

  //addEventListener
  button.addEventListener("click", (e) => {
    removeHTMLNode_byId("notification"+id);
  })

  //remove after...
  await delay(1500)
  notification.remove();
}



function elementExists(query){
  let el = document.querySelector(query);
  if(!el)
    return false;
  return true;
}
function isValidHTML(node){
  if(node == null)
    return false;
  return true;
}








function downloadParticipationReport(meeting){
    let csvContent = meetingToCSV(meeting);
    let docTitle = meeting["title"]["id"] + ".csv";
  
    var encodedUri = "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", docTitle);
    console.log(link)
    document.body.appendChild(link); // Required for FF
    
    link.click();
    return "done";
  }

  function meetingToCSV(meeting){
    let answer = ""
    console.log(meeting)
    let stringDictionary = meeting
    answer += "id," + stringDictionary["title"]["id"] + ",\n";
    answer += "link," + stringDictionary["title"]["link"] + ",\n";
    answer += "total participants," + stringDictionary["title"]["totalParticipants"] + ",\n";
    answer += "total dates," + stringDictionary["title"]["totalDates"] + ",\n";
    answer += "date of creation," + stringDictionary["title"]["dateOfCreation"] + ",\n";

    answer += ["dates,"]
    console.log(stringDictionary["dates"])
    for (let index = 0; index < stringDictionary["dates"].length; index++) {
      answer += stringDictionary["dates"][index] +",";
    }
    answer += "total\n";
    
    let participantsIds=Object.keys(stringDictionary["participants"]);
    for (let index = 0; index < participantsIds.length; index++) {
      answer += participantsIds[index] + ",";

      for (let j = 0; j < stringDictionary["participants"][participantsIds[index]].length; j++) {
        answer += stringDictionary["participants"][participantsIds[index]][j] + ",";        
      }

      answer += "\n"
    }
    console.log(answer)
    return answer;
  }
  
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if(request.type == "downloadReport"){
        downloadParticipationReport(request.meeting);                        
        sendResponse("done")
      }
      if(request.type == "popup_forceReload"){
        forceReload();
      }
      return true;
    }
  );

