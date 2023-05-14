chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){   
        if(request.type == "popup_downloadReport"){
            getActiveTabId()
            .then( tabId => {
                console.log(request.meeting);
                downloadReport(tabId, request.meeting)
            } )
            .then( console.log("background received and resent info from popup to script"))
        }
        //this return keeps the port open until an answer is returned
        return true;
    }
)


function getActiveTabId(){
    return new Promise((resolve, reject) => {  
        chrome.tabs.query(
            {active:true,windowType:"normal", currentWindow: true},
            function(tabs){
                resolve(tabs[0].id)
                reject();  
            }
        )       
    })
}


function downloadReport(tabId, meeting){
    return new Promise((resolve, reject) => {   
        chrome.tabs.sendMessage(
            parseInt(tabId), 
            {
                type: "downloadReport", 
                meeting: meeting
            },
            function (response){
                resolve(response)
                reject();
            }
        )
    })
}

