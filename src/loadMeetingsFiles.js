let meetId = window.location.href.substring(24);

function retrieveMeetFromStorage(id){    
    return new Promise(resolve => {
        //get meet from storage
        chrome.storage.local.get(id, function(result){
            //if returned meet is not valid (didn't exists), create a new one with current information and put it in memory
            if(Object.keys(result).length === 0){
                createMeet(id)
                .then(a => {
                    chrome.storage.local.get(id, function(result){
                        resolve(result);
                    });     
                })
            }
            else
                return resolve(result);
        });
        //return the meet from memory
    });
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

function createMeet(id){  
    return new Promise(resolve => {
        let newMeet = new Meet(window.location.href.substring(24), window.location.href).toTableString();
        let dict = {};
        dict[id] = newMeet;
        
        chrome.storage.local.set(dict, function(result){
            return resolve()
        });
    });
}

function updateMeet(meeting){
    return new Promise(resolve => {
        let newMeet = meeting.toTableString();
        let dict = {};
        dict[meeting.getId()] = newMeet;

        chrome.storage.local.set(dict, function(result){
            return resolve()
        });
    });

}


function removeMeet(id ="hrm-zkka-qsg"){
    return new Promise(resolve => {
        chrome.storage.local.remove([id],function(){
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

