// let changeColor = document.getElementById("changeColor");

// chrome.storage.sync.get("color", ({ color }) => {
//     changeColor.style.backgroundColor = color;
// });

// // When the button is clicked, inject setPageBackgroundColor into current page
// changeColor.addEventListener("click", async () => {
//     let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//     chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         function: setPageBackgroundColor,
//     });
// });

// // The body of this function will be executed as a content script inside the
// // current page
// function setPageBackgroundColor() {
//     chrome.storage.sync.get("color", ({ color }) => {
//         document.body.style.backgroundColor = color;
//     });
// }
// document.addEventListener('DOMContentLoaded', function () {
//     document.getElementById("gopage").addEventListener("click", handler);
// });
// document.getElementById('gopage').addEventListener('click', handler);
// // The handler also must go in a .js file
// function handler() {
//     window.location.href = "https://wax.alcor.exchange/swap?output=WAX-eosio.token&input=TLM-alien.worlds";
// }

window.addEventListener('DOMContentLoaded', function() {
    // your button here
    var link = document.getElementById('btnOpenNewTab');
    // onClick's logic below:
    link.addEventListener('click', function() {
        var newURL = "https://wax.alcor.exchange/swap?output=WAX-eosio.token&input=TLM-alien.worlds";
        chrome.tabs.create({ url: newURL });
    });
});