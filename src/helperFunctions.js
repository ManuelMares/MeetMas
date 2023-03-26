/* 
This functions wait for a given amount of time before finalizing 

This function returns a promise to garantee that the indicated time ocurred
@param timeMs
An integer indicating the time to wait for in ms
*/
const delay = (timeMs) => {
return new Promise(resolve => {
    setTimeout(resolve, timeMs)
});
}


/* 
This function waits until an HTML element exists, and returns it when that happens

All process will stop until the element exists

@param selector
A selector property from the element to wait for
*/
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









async function getTextContent(dir){  
return fetch(chrome.runtime.getURL(dir))
.then((resp) => { return resp.text(); })
.then((content) => { 
    return  content;
});
}

async function getCSS(cssDir){
var style = document.createElement( 'style' );
style.innerHTML = await getTextContent(cssDir);
return style;
}