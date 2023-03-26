let MeetMasReportButton = document.getElementById('MeetMasReportButton');
MeetMasReportButton.addEventListener('click', downloadReport() );



function downloadReport(){
    return new Promise((resolve, reject) => {        
      chrome.runtime.sendMessage(
        {
            type: "popup_downloadReport"
        },
        function (response) 
        {
            resolve( response );
            reject(ans => {console.log("reject: ", ans)})
        }
      )
    })
}