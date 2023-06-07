
let meetMas_Id = "peeeelfbdfnbnefepkclgfgbmfnnnpki";
MixerMasMain();
async function MixerMasMain(){
    await loadMixerMasContainer();
    addEventListers();
}

async function loadMixerMasContainer(){

    let mixerMasCSS = await getCSS('src/MixerMas/MixerMas.css');
    var mixerMasContainer = document.createElement('div');
    mixerMasContainer.innerHTML = await getTextContent('src/MixerMas/MixerMas.html'); 

    document.body.appendChild(mixerMasCSS);
    document.body.appendChild(mixerMasContainer);
}



function addEventListers(){
    let mixMaxDice = document.getElementById("mixermas_diceButton");
    createToolTip("Roll a dice", mixMaxDice, "mixermas_diceButton");
    mixMaxDice.addEventListener("click", () => {
        diceHandler();
    })
    let mixMaxRandomNumber = document.getElementById("mixermas_randomNumberButton")
    createToolTip("Get a random number", mixMaxRandomNumber, "mixermas_randomNumberButton");
    mixMaxRandomNumber.addEventListener("click", () => {
        randomNumberHandler ();
    })
    let mixMaxRandomLetter = document.getElementById("mixermas_randomLetterButton")
    createToolTip("Get a random word", mixMaxRandomLetter, "mixermas_randomLetterButton");
    mixMaxRandomLetter.addEventListener("click", () => {
        randomLetterHandler();
    })
    let isHidden = false;
    let MixMas_hideButton = document.getElementById("mixerMas_hideButton");
    createToolTip("Hide/unide this menu", MixMas_hideButton, "mixerMas_hideButton");
    MixMas_hideButton.addEventListener("click", (e) =>{
        isHidden = loadMixMasHideButton(isHidden);
    })
}

async function diceHandler(){
    var mixerMasDice_Container = document.createElement('div');
    mixerMasDice_Container.innerHTML = await getTextContent('src/MixerMas/MixerMas_dice.html');
    document.body.appendChild(mixerMasDice_Container);

    //load faces of the dice
    let face1 = document.getElementById("mixerMas_dice_front");
    face1.innerHTML = '<img class="MixerMas_diceImage1" src="chrome-extension://'+meetMas_Id+'/src/MixerMas/images/face1.png"/>';
    let face2 = document.getElementById("mixerMas_dice_back");
    face2.innerHTML = '<img class="MixerMas_diceImage" src="chrome-extension://'+meetMas_Id+'/src/MixerMas/images/face2.png"/>';
    let face3 = document.getElementById("mixerMas_dice_right");
    face3.innerHTML = '<img class="MixerMas_diceImage" src="chrome-extension://'+meetMas_Id+'/src/MixerMas/images/face3.png"/>';
    let face4 = document.getElementById("mixerMas_dice_left");
    face4.innerHTML = '<img class="MixerMas_diceImage" src="chrome-extension://'+meetMas_Id+'/src/MixerMas/images/face4.png"/>';
    let face5 = document.getElementById("mixerMas_dice_top");
    face5.innerHTML = '<img class="MixerMas_diceImage" src="chrome-extension://'+meetMas_Id+'/src/MixerMas/images/face5.png"/>';
    let face6 = document.getElementById("mixerMas_dice_bottom");
    face6.innerHTML = '<img class="MixerMas_diceImage" src="chrome-extension://'+meetMas_Id+'/src/MixerMas/images/face6.png"/>';
    
    
    
    
    

    //close dice
    let closeButton = document.getElementById("mixerMas_closeDice");
    closeButton.addEventListener('click', ()=>{
        mixerMasDice_Container.outerHTML = "";
    })

    //spin dice
    let mixerMas_spinDice = document.getElementById("mixerMas_spinDice");
    let previousRotation = { 'x':0, 'y':0, 'z':0 }
    mixerMas_spinDice.addEventListener("click", () => {
        spinDice(previousRotation);
    })
    
}

async function spinDice(previousRotation){
    let dice = document.getElementById("mixerMas_dice");    
    
    //get new values
    let newRotationX = 180 + ((Math.floor(Math.random() * 3)+1)* 90);
    let newRotationY = 1800 + ((Math.floor(Math.random() * 3)+1)* 90);
    let newRotationZ = 1800 + ((Math.floor(Math.random() * 3)+1)* 90);
    let rotX = previousRotation['x'] + newRotationX
    let rotY = previousRotation['y'] + newRotationY
    let rotZ = previousRotation['z'] + newRotationZ


    //transform    
    dice.style.transform = 'rotateX('+rotX+'deg) rotateY('+rotY+'deg) rotateZ('+rotZ+'deg)';

    //update dictionary
    previousRotation['x'] = rotX;
    previousRotation['y'] = rotY;
    previousRotation['z'] = rotZ;

}













async function randomNumberHandler(){
    var mixerMasRN_Container = document.createElement('div');
    mixerMasRN_Container.innerHTML = await getTextContent('src/MixerMas/MixerMas_RN.html');
    document.body.appendChild(mixerMasRN_Container);

    //range
    let range = [0, 100]

    //close button
    let closeButton = document.getElementById("mixerMas_RN_close");
    closeButton.addEventListener('click', ()=>{
        mixerMasRN_Container.outerHTML = "";
    })

    //get random number
    let randomNumber = document.getElementById("MixerMas_RN_getNumber");
    randomNumber.addEventListener('click', async ()=>{
        range = await getNewRange();
        await getRandomNumber(range);
    })
}

function getNewRange(){
    try {
        let input = document.getElementById("MixerMas_RN_input").value;
        
        input = input.replace("(", "");
        input = input.replace(")", "");
        let temp = input.split(",")

        if(temp.length != 2){
            return []
        }
        range = []
        range.push( Number(temp[0]) )
        range.push( Number(temp[1]) )
        
        return range;
            
    } catch (error) {
        return []
    }
    
    
}

async function getRandomNumber(range){
    if(range.length != 2)
        return

    let output = document.getElementById("MixerMas_RN_Result");
    let options = []

    

    //get options
    let counter = range[0]
    let step = 1;
    if(range[0] > range[1]){
        for (; counter > range[1]; counter -= step) {
            options.push(counter)
        } 
    }else{
        for (; counter < range[1]; counter += step) {
            options.push(counter)
        }  
    }




    //spin    
    let spin = Math.floor(Math.random() * options.length ) + options.length * 2
    step = 1;
    if(options.length < 15)
        step = 20;
    else if(options.length < 30)
        step = 10;

    let index = 0; 
    while (spin > 0) {
        output.innerHTML = options[index];
        await delay(step)

        index ++;
        
        spin = spin - 1;
        counter += step;

        if(index == options.length){
            index = 0;
        }
    }

}




















async function randomLetterHandler(){
    var mixerMasRL_Container = document.createElement('div');
    mixerMasRL_Container.innerHTML = await getTextContent('src/MixerMas/MixerMas_RL.html');
    document.body.appendChild(mixerMasRL_Container);

    //default options
    let options = ["A", "B", "C", "D", 'E', "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

    //close randomLetter
    let closeButton = document.getElementById("mixerMas_RL_close");
    closeButton.addEventListener('click', ()=>{
        mixerMasRL_Container.outerHTML = "";
    })

    //input handler
    let loadOptionsButton = document.getElementById("MixerMas_options_button");
    loadOptionsButton.addEventListener('click', ()=>{
        let temp = loadOptions();
        if(temp.length >= 2 && temp.length < 50){
            options = temp;
            setErrorMessage("")
            displayOptions(temp);
        }
        else{
            setErrorMessage("length of input not valid")
        }
    })

    //displayOptions
    displayOptions(options);

    //get random letter
    let randomButton = document.getElementById("mixerMas_RL_getLetter");
    randomButton.addEventListener('click', ()=>{
        getRandomLetter(options);
    }) 

}

function setErrorMessage(message){
    let errorMessage = document.getElementById("MixerMas_options_errorMessage");
    errorMessage.innerHTML = message;
}

function loadOptions(){
    try {
        let optionsTextArea = document.getElementById("MixerMas_options_input");
        let temp = optionsTextArea.value.split(",");
        return temp.filter((el) => {return /\S/.test(el);});
    } catch (error) {
        setErrorMessage("problems with the input")
        return []
    }
}

function displayOptions(options){
    let optionsOutput = document.getElementById("MixerMas_options_displayOptions");
    optionsOutput.innerHTML = "";
    for (let index = 0; index < options.length; index++) {
        let temp = document.createElement('div');
        temp.setAttribute('class', 'MixerMas_options_option')
        temp.setAttribute('id', 'MixerMas_options_option'+options[index])
        temp.innerHTML += options[index]
        optionsOutput.appendChild(temp);
    }
    
    let text = document.getElementById("MixerMas_RL_Result");
    text.innerHTML = options[0];
}

async function getRandomLetter(options){
    let text = document.getElementById("MixerMas_RL_Result");
    let spin = Math.floor(Math.random() * options.length ) + options.length * 2
    
    
    let index = 0

    let step = 0;
    let counter = 0;

    if(options.length < 5)
        step = 12;
    else if (options.length < 10){
        step = 10;
    }
    else if (options.length < 15){
        step = 8;
    }
    else if (options.length < 20){
        step = 6;
    }
    else if (options.length < 25){
        step = 4;
    }
    else
        step = 2;
    while (spin > 0) {
        text.innerHTML = options[index];
        await delay(counter)
        
        spin = spin - 1;
        counter += step;
        index ++;

        if(index == options.length){
            index = 0;
        }
    }


}








function loadMixMasHideButton(isHidden){
    let MixMas_hideButton = document.getElementById("mixerMas_hideButton");
    if(isHidden){
        //unhide
        document.getElementById("mixermas_diceButton").style.display = "inline";
        document.getElementById("mixermas_randomNumberButton").style.display = "inline";
        document.getElementById("mixermas_randomLetterButton").style.display = "inline";
        MixMas_hideButton.style.width = "120px";
        MixMas_hideButton.innerHTML = "<";
        return false
    }
    else{
        //hide
        document.getElementById("mixermas_diceButton").style.display = "none";
        document.getElementById("mixermas_randomNumberButton").style.display = "none";
        document.getElementById("mixermas_randomLetterButton").style.display = "none";
        MixMas_hideButton.style.width = "40px";
        MixMas_hideButton.innerHTML = ">";
        return true
    }

}
