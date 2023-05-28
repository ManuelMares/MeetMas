async function addMessageMasButtons_message(messageContainer){
    let messageMasContainer = messageContainer.querySelector('#MeetMas_messageMas_Container');
    if(isValidHTML(messageMasContainer))
      return

    var participationButtons = await createMessageMasButtons(); 
    let buttonsContainer = messageContainer.querySelector("#MeetMas_messages_buttonsContainer");
    buttonsContainer.appendChild(participationButtons);
    
    //add event listener
    let id= messageContainer.childNodes[0].childNodes[0].innerHTML;
    let message = messageContainer.childNodes[1].childNodes[0].innerHTML;
    let replyButton = messageContainer.querySelector("#MeetMas_messageMas_replyButton")
    replyButton.addEventListener("click",  () => {
        replyMessage(id, message);
    })
}


async function createMessageMasButtons(){
    var messageMasButtons = document.createElement('div');
    messageMasButtons.setAttribute("class", "MeetMas_messageMas_Container");
    messageMasButtons.setAttribute("id", "MeetMas_messageMas_Container");
    messageMasButtons.innerHTML = await getTextContent('src/messageMas/messageMas.html'); 
    return messageMasButtons
}

async function replyMessage(id, message){
    if (id.localeCompare("You") == 0){
        id = "Continuation"
    }else{
        id = "Reply to " + id; 
    }


    
    await asyncQuery("textarea[placeholder='Send a message");
    let chatInput = document.querySelector("textarea[placeholder='Send a message");


    let messageArray = message.split('\n');
    let newMessage = ""
    for (let index = 0; index < messageArray.length; index++) {
        newMessage += ".    " + messageArray[index] + "\n";
        
    }


    if(message.length > 300)
        chatInput.value =  "**" + id + "**\n----------------------\n" + newMessage.slice(0, 100) + "[...]\n----------------------\n";
    else
        chatInput.value =  "**" + id + "**\n======================\n" + newMessage + "\n======================\n";
    
    chatInput.scrollTo(0, document.body.scrollHeight);
}