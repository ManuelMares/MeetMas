
function retrieveMeetFromStorage(id){  
    return new Promise(resolve => {
        chrome.storage.local.get(id, function(result){
            let meetingsIds = Object.keys(result);   
            return resolve(result[meetingsIds[0]]);
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


/*
This function retrieves the meet JSON object from storage
The function will filter only those files whose id's start with "MeetMas"
@return 
    An array containing JSON objects
*/
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

function isValidMeet(meetId){
    if(meetId.substring(0,7).localeCompare("MeetMas") == 0)
        return true;
    return false;
}

function createMeet(meet){     
    return new Promise(resolve => {
        let newMeet = {};
        newMeet[meet["meetId"]] = meet;       
        chrome.storage.local.set(newMeet, function(result){
            return resolve()
        });
    });
}

function updateMeetInStorage(meet){
    return new Promise(resolve => {
        let newMeet = {};
        newMeet[meet["meetId"]] = meet;
        chrome.storage.local.set(newMeet, function(result){
            return resolve()
        });
    });
}


function removeMeet(id){
    return new Promise(resolve => {        
        chrome.storage.local.remove([id],function(result){
            return resolve();
        })
    });
    
}


function clearLocalMemory(){
    return new Promise(resolve => {
        chrome.storage.local.clear(function() {
          return resolve();
        });
    });
}

