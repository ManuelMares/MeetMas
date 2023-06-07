/*
This script triggers the extensionController and shows the global variables.
This file must be the last file to be loaded in the manifest.

The structure to create a new meet JSON object is as follows:
    meet = {
        meetId: "",
        meetName: "",
        meetLink: "",
        metaData: {
            creationDate:"",
            totalDates:"",
            totalParticipants:"",
        },
        Dates: [d1,d2,d3,...],
        participants:
        {
            p1: {d1:t1, d2:t2 },
            p2: {d1:t1, d2:t2 }
        }
    }

*/




let meetMasId = "peeeelfbdfnbnefepkclgfgbmfnnnpki";
let chatButton = null;
let membersButton = null;
let menu = null;
let membersMenu = null;
let chatMenu = null;
let interfaceLoaded = false;
let months = ["January","February","March","April","May","June","July","August","September","October","November","December"];



let currentMeet = {} //JSON object

 //Triggered from extensionController
StartExtension();
