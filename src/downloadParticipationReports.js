  function downloadParticipationReport(meeting){
    console.log("we are requested something")
    console.log(meeting)
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
      return true;
    }
  );
