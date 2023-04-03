class Meet {
    constructor(id, link) {
        if(id == null || id == "")
          throw new Error('Invalid id at constructor>Meet. This link does not qualify as a meet for MeetMas extension.');

        this.id = id;
        this.link = link;
        this.dateOfCreation = new Date().getFullYear() + "-" +new Date().getMonth() + "-" + new Date().getDay();
        this.participants = [];
        this.participationsDates = [];
    }


    meetFromTableString(meet){
        //adding participation dates
        for (let index = 0; index < meet["dates"].length; index++) {
            this.participationsDates.push(meet["dates"][index]);            
        }

        //adding participations
        let pkeys = Object.keys(meet["participants"])
        for (let index = 0; index < pkeys.length; index++) {
            //last key in participant is the total. Ignore it
            let pId = pkeys[index];
            let pParticipations = meet["participants"][pId];
            pParticipations.pop();

            let newP = new Participant(pId, this.makeParticipationsFromList(pParticipations));   
            this.participants.push(newP);
        }

        //setting info from meet object
        this.dateOfCreation = meet["title"]["dateOfCreation"];
        this.id = meet["title"]["id"];
        this.link = meet["title"]["link"];
    }

    makeParticipationsFromList(ps){
        let answer = [];
        //the keys are container in this.participationsDates
        for (let index = 0; index < ps.length; index++) {
            let newP = new Participation(ps[index], this.participationsDates[index]); 
            answer.push(newP);
        }
        return answer;
    }

    toTableString(){
        /* 
            {
                title: {
                    id: kjwqnolsdyg, 
                    link: http://google.meet/kjwqnolsdyg, 
                    totalParticipants: 10, 
                    totalDates: 10,
                    dateOfCreation: 2023:03:1
                },
                dates: [d1,d2,d3,d4,d6,...],
                participants:
                {
                    p1: [0,1,0,1,... total],
                    p2: [3,5,0,1,... total],
                    p3: [0,0,-1,0,... total],
                }
            }
        */
        let title = this.titleToDict();
        let dates = this.datesToArray();
        let participationsDict = this.participantsToArray();
        let tableString = { title: title, dates: dates, participants: participationsDict}
        return tableString;
    }
    participantsToArray(){
        let answer = {};
        for (let index = 0; index < this.participants.length; index++) {
            answer[this.participants[index].getName()] = this.participants[index].getParticipationsArray();       
        }
        return answer;
    }

    datesToArray(){
        let answer = [];
        for (let index = 0; index < this.participationsDates.length; index++) {
            answer.push( this.participationsDates[index]);            
        }
        return answer;
    }

    titleToDict(){
        return { id: this.id, link: this.link, totalParticipants: this.participants.length, totalDates: this.participationsDates.length, dateOfCreation: this.dateOfCreation };
    }

    toString(){
        let answer = this.id +", " + this.link + ": [";
        for (let index = 0; index < this.participants.length; index++) {
            answer += this.participants[index].toString() + ",\n";          
        }
        answer += "]";
        return answer
    }

    toStringParticipationDates(){
        let answer = "[";
        for (let index = 0; index < this.participationsDates.length; index++) {
            answer = this.participationsDates[index] + ", ";
            
        }
        answer += " ]"
        return answer
    }

    addParticipant(id){
        if(id == null || id == "")
          throw new Error('Invalid id at addParticipant>Meet');

        if(this.getParticipantIndex(id) >= 0)
            return;
            
        let newParticipant = new Participant(id)        
        for (let index = 0; index < this.participationsDates.length; index++) {
            //the student has to catch up with the participations of the whole group.
            //also, since it is new, all previous participations are set to zero
            let newParticipation = new Participation(0, this.participationsDates[index]);
            newParticipant.addParticipation(newParticipation);
        }
        this.participants.push(newParticipant)
    }
    getParticipant(id){
        if(this.participants.length == 0)
            throw new Error('Empty meet at Meet>getParticipant');

        for (let index = 0; index < this.participants.length; index++) {
            if(this.participants[index].getName().localeCompare(id) == 0)
                return this.participants[index];
        }
        throw new Error('Participant does not exist at Meet>getParticipant');
    }
    getParticipantIndex(id){
        for (let index = 0; index < this.participants.length; index++) {
            if(this.participants[index].getName().localeCompare(id) == 0)
                return index;
        }
        return -1;
    }
    setId(id){
        if(id == null || id == "")
          throw new Error('Invalid id at setId>Meet');
        this.id = id;
    }
    getId(){
        return this.id;
    }  
    setLink(link){
        if(link == null || link == "")
          throw new Error('Invalid id at setId>Meet');
        this.link = link;
    }
    getLink(){
        return this.link;
    }  

    addParticipationDate(){
        let todayDate = new Date().getFullYear() + "-" +new Date().getMonth() + "-" + new Date().getDay();
        if(this.participationsDates.length == 0 || this.participationsDates[this.participationsDates.length - 1].localeCompare(todayDate) != 0){
            this.participationsDates.push(todayDate)
            this.addDateToParticipants(todayDate);
        }
    }      
    addDateToParticipants(date){
        for (let index = 0; index < this.participants.length; index++) {
            let newParticipation = new Participation(0, date); 
            this.participants[index].addParticipation(newParticipation);
        }
    }
    registerParticipation(participantId, value){
        //always try to add participation first. It will only be added if today has not been registered yet
        this.addParticipationDate();
        let participant = this.getParticipant(participantId);
        participant.upgradeLastParticipation(value);
    }
    
}