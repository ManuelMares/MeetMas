

class Participants {
    constructor() {
      this.participantsList = [];
    }

    toString_single(){
      if(this.participantsList.length == 0)
        return "[]"

      answer = "[";
      this.participantsList.forEach(p => {
        answer += p.getName() + ", ";
      });
      answer += "]";
      return answer;
    }
    toString_all(){
      this.answer = "[";
      this.participantsList.forEach(p => {
        console.log(p)
        this.answer += p.getName() + ", ";
      });
      this.answer += "]";
      return this.answer;
    }
    csvFormat_single(){      
    }
    csvFormat_all(){      
    }

    getParticipantIndex(name){
        if(name == null || name == "")
          throw new Error('Invalid data string at Participants>getParticipantIndex');
  
        this.counter = 0;
        this.participantsList.forEach(p => {
          if (p.getName() == name) 
            return this.counter;        
            this.counter += 1;
        });     
        return -1; 
      }
    addParticipant(name){
      if(name == null || name == "")
        throw new Error('Invalid data string at Participants>addParticipant');
      
        
      this.index = this.getParticipantIndex(name);
      if(this.index > -1)
        return;

      let newParticipant = new Participant(name);
      this.participantsList.push(newParticipant);
    }
    getParticipant(index = this.participantsList.length -1){ 
      if(index < 0 || index > this.participations.length - 1)
        throw new Error('Invalid index at Participants>getParticipant');

      return this.participantsList[index];
    }
    deleteParticipant(){      
    }


    addParticipation(name="Regular", grade=0){
      index = this.getParticipantIndex(name);
      if(index == -1)
        throw new Error('Invalid index(userName) at Participants>addParticipation');
      
      let newParticipation = new Participation(name, grade);
      this.participantsList[index].addParticipation(newParticipation)
    }
    deleteParticipation(){
      //TODO what's the criteria? probably an index
    }
    editParticipation_grade(){  
      //TODO what's the criteria? probably an index 
    }
    editParticipation_type(){  
      //TODO what's the criteria? probably an index   
    }
}






class Participant {
    constructor(name) {
      this.participations = [];
      this.name = name;
    }
    getName(){
      return this.name;
    }
    addParticipation(participation){
      if(participation)
        this.participations.push(participation);      
      else
        throw new Error('New Participation is not a valid object. At Participant>addParticipation');
    }
    getParticipation(index = this.participations.length -1){
      if(this.participations.length == 0)
        throw new Error('There are no participations at Participant>getParticipation');
      if(index < 0 || index > this.participations.length - 1)
        throw new Error('Invalid index at Participant>getParticipation');
      return this.participations[index];
    }
    deleteParticipation(index = this.participations.length-1){
      if(index < 0 || index > this.participations.length-1)
        throw new Error('Invalid index at Participant>deleteParticipation');
      //second parameter indicates how many elements to delete
      this.participations.splice(index, 1);
    }
    gradeParticipation(index = this.participations.length-1, grade){
      if(index < 0 || index > this.participations.length-1)
        throw new Error('Invalid index at Participant>gradeParticipation');
      this.participations[index].setGrade(grade);
    }
    modifyTypeOfParticipation(index = this.participations.length-1, type){
      if(index < 0 || index > this.participations.length-1)
        throw new Error('Invalid index at Participant>gradeParticipation');
      if(type == null || type == "")
        throw new Error('Invalid grade type at Participant>gradeParticipation');
      this.participations[index].setGrade(type);
    } 
    getAllParticipations(){
      return this.participations;
    }

}






class Participation {
    constructor(type = "regular", grade=0) {
      this.type = type;
      this.grade = grade;
    }

    setGrade(grade){
        this.grade = grade;
    }
    setType(type){
        this.type = type;
    }

    getType(){
        return this.type;
    }
    getGrade(){
        return this.grade;
    }
}















//=========================================================================================================================================================
//=========================================================================================================================================================
//=========================================================================================================================================================
//=========================================================================================================================================================
//=========================================================================================================================================================
//=========================================================================================================================================================
//=========================================================================================================================================================
//=========================================================================================================================================================



var participations = new Participants();
var participantsContainerT = null;

const registerParticipations = new MutationObserver( entries => {
    entries.forEach(e => {
        if(e.type == 'childList'){
            try {
                userName = document.querySelector(".XEazBc,adnwBd").innerHTML;
                if(participations[userName] == undefined ){
                    participations[userName] = 1;
                }else{
                    participations[userName] = participations[userName] + 1;
                }
                console.log("total participations of user ", userName, " are: ", participations[userName]);
            }
            catch(err) {}
        }
    })

})

const keepAddingParticipants = new MutationObserver( entries => {
    //Every time the list of users changes, it will try to add the new user
    entries.forEach(e => {
        //check that childList has changed
        if(e.type == 'childList'){
            //The list updates everytime a person gets in or out
            //So we have to add the button WITH EVERY SINGLE MODIFICATION


            addParticipants(participantsContainerT);
            //if(e.addedNodes.length > 0){
            //    if(e.addedNodes[0]["className"] == "jKwXVe"){
            //        addParticipants(participantsContainerT);
            //    }
                
                // if(e.addedNodes[0]["className"] == "jKwXVe"){
                //     participations.addParticipant(e.addedNodes[0]["innerText"]);
                // }
                // if(e.addedNodes[0]["className"] == "cxdMu KV1GEc"){
                //     addParticipant();
                // }

            //}
            //console.log(e.addedNode[0]["className"]);
            //console.log(e.addedNode[0]["innerText"]);
        }
    })

})


startRegisteringParticipations()
async function startRegisteringParticipations(){
    //1) get list of all users (except meeting host)
    await OpenUsers();

    const participantsContainer = await waitForElm("div[aria-label='Participants']");  
    participantsContainerT = participantsContainer;
    addParticipants(participantsContainer);

    console.log(participations.toString_all())

    //keep adding elements when there is any change in the users
    keepAddingParticipants.observe(participantsContainer, { attributes: true, childList: true, subtree: true, characterData: true}) 
    

    //2) start registering participations   
            //ask user how he wants to grade the participation.
    //3) produce cvs
    // registerParticipations.observe(participantsContainer, {
    //    attributes: true,
    //    childList: true,
    //    subtree: true,
    //    characterData: true}) 
} 

async function OpenUsers(){    
    const peopleButton = await waitForElm("button[aria-label='Show everyone']"); 
    peopleButton.click();
}


function waitForElm(selector) {
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

























function addParticipants(participantsContainer){
    participantsContainer.childNodes.forEach(participantContainer => {
        addParticipant(participantContainer);
    });
}

function addParticipant(participantContainer = participantsContainerT.childNodes[participantsContainerT.childNodes.length -1]){
    var userName = getUserName(participantContainer);
    addButtons(participantContainer);
    if(userName != undefined){
        participations.addParticipant(userName);
    }
}

function getUserName(HTMLNode){
    var userNameContainer =  HTMLNode.childNodes[0].childNodes[1];
    var position = userNameContainer.childNodes[1].innerHTML;
    var b = document.createElement("div");
    if ( position == ""){
        //more than one child, means they have a description like 'meeting host'
        var userName = userNameContainer.childNodes[0].childNodes[0].innerHTML; 
       return userName;
    }
    return undefined;
}


function addButtons(fatherNode){
    var node1 = document.createElement("button");
    node1.style.height  = "25px";
    node1.style.width  = "25px";
    node1.style.fontSize = "15px";
    node1.style.border  = "none";
    node1.style.backgroundColor = "#54a92c";
    node1.style.fontSize = "24px";
    node1.style.textAlign = "center";
    node1.style.textDecoration = "none";
    node1.style.border = "none";
    node1.style.borderRadius = "100px";
    node1.style.color = "white";
    node1.style.padding = "0"
    node1.style.marginRight = "5px"
    node1.innerHTML = "+"

    var node = document.createElement("button");
    node.style.height  = "25px";
    node.style.width  = "25px";
    node.style.fontSize = "15px";
    node.style.border  = "none%";
    node.style.backgroundColor = "#2e65b7";
    node.style.textAlign = "center";
    node.style.textDecoration = "none";
    node.style.border = "none";
    node.style.borderRadius = "100px";
    node.style.color = "white";
    node.style.padding = "0"
    node.innerHTML = "-"


    var container = document.createElement("div");
    container.style.width = "50px";
    container.style.height = "30px";
    container.style.display  = "flex";
    container.style.flexDirection = "row";
    container.appendChild(node1);
    container.appendChild(node);
    fatherNode.appendChild(container);
}

function createButton_positiveParticipation(){
    var node1 = document.createElement("button");
    node1.style.height  = "25px";
    node1.style.width  = "25px";
    node1.style.fontSize = "15px";
    node1.style.border  = "none";
    node1.style.backgroundColor = "#54a92c";
    node1.style.fontSize = "24px";
    node1.style.textAlign = "center";
    node1.style.textDecoration = "none";
    node1.style.border = "none";
    node1.style.borderRadius = "100px";
    node1.style.color = "white";
    node1.style.padding = "0"
    node1.style.marginRight = "5px"
    node1.innerHTML = "+"
    
    return node
}
function createButton_negativeParticipation(){
    var node = document.createElement("button");
    node.style.height  = "25px";
    node.style.width  = "25px";
    node.style.fontSize = "15px";
    node.style.border  = "none%";
    node.style.backgroundColor = "#2e65b7";
    node.style.textAlign = "center";
    node.style.textDecoration = "none";
    node.style.border = "none";
    node.style.borderRadius = "100px";
    node.style.color = "white";
    node.style.padding = "0"
    node.innerHTML = "-"
    
    return node
}
