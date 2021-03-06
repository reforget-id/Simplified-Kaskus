// ==UserScript==
// @name        Kaskus : Enhanced Thread Editor  
// @namespace   k-enhanced editor
// @homepage    https://github.com/reforget-id/Simplified-Kaskus
// @version     1.1.3
// @author      ffsuperteam
// @description Mengubah tampilan lama thread editor agar lebih nyaman digunakan
// @icon        https://s.kaskus.id/themes_3.0/mobile/images/logo-n.svg
// @include     https://www.kaskus.co.id/post_reply/*
// @downloadURL https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/pc/k-editor.user.js
// @updateURL   https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/pc/k-editor.user.js
// @grant       GM_addStyle
// @run-at      document-idle
// ==/UserScript==

GM_addStyle(`
html {
scroll-behavior: smooth;
}
.listing-wrapper .col-sm-12 {
display: none;
}
.banner {
display: none !important;
}
.sidebar-wrap {
display: none;
}
.site-footer {
display: none;
}
.actions {
display: none;
}
.bg-naa .bar10 > label {
display: none;
}
.reply-form .bar0 {
display: none;
}
.bar10 .input-group {
display: none;
}
.entry {
    font-size: 16px !important;
    overflow-x: hidden !important;
    height: 493px !important;
    padding-right: 48px !important;
    padding-left: 33px !important;
}
.markItUpEditor {
overflow-y: scroll !important;
height: 383px !important;
color: black !important;
font-family: monospace;
font-size: 14px;
}
.m-top-4{
display: none;
}
#preview-anchor > .clearfix {
display: none;
}
#preview-anchor .entry-title {
    display: none;
}
.header-notification-wrap{
display: none !important;
}
.main-content {
width: 860px;
float: none;
margin: auto;
}
.markItUpHeader {
padding: 3px !important;
}
.savebtn{
float: left;
background-color: #1998ed;
position: relative;
margin: 7px 8px 0px 8px;
list-style: none;
color: white;
height: 16px;
border: 1px solid transparent;
width: 70px;
box-sizing: content-box;
}
.importfile{
float: right;
position: relative;
margin: 7px 8px 0px 8px;
list-style: none;
width: 150px;
}
#preview-code {
    padding-right: 8px;
}
.reply-thread > .bar10 {
    display: none;
}
`);

document.body.scrollTop = 0;
document.documentElement.scrollTop = 0;

var x = document.getElementsByClassName('clearfix')[0];
x.style.display = 'none';

Element.prototype.appendAfter = function (element) {
    element.parentNode.insertBefore(this, element.nextSibling);
}, false;

/*
var node0 = document.getElementsByClassName("markItUpButton markItUpButton6")[0];
var li = document.createElement('li');
li.id = 'justifyli';
li.setAttribute("class", "markItUpButton markItUpButton6");
li.appendAfter(node0);
var Justify = document.createElement('button');
Justify.setAttribute("type", "button");
//Justify.setAttribute("class", "markItUpButton markItUpButton6");
Justify.style.background = 'url(https://s.kaskus.id/assets/web_1.0/images/ic-editor-align-justify.svg)';
li.appendChild(Justify);
*/

var node1 = document.getElementsByClassName("pull-right m-top-4")[0];
var Toogle = document.createElement('button');
Toogle.innerHTML = 'Toogle Preview';
Toogle.style.cssFloat = 'right';
Toogle.style.backgroundColor = 'orangered';
Toogle.setAttribute("onclick", "var x = document.getElementsByClassName('clearfix')[0]; if (x.style.display === 'none') { x.style.display = 'block';} else {x.style.display = 'none';}");
Toogle.appendAfter(node1);

var node2 = document.getElementsByClassName("markItUpButton markItUpButton30")[0];
var SaveFile = document.createElement('button');
SaveFile.innerHTML = 'Save to File';
SaveFile.id = 'savetofile';
SaveFile.setAttribute("type", "button");
SaveFile.setAttribute("class", "savebtn");
SaveFile.appendAfter(node2);

var node3 = document.getElementById("savetofile");
var OpenFile = document.createElement('button');
OpenFile.innerHTML = 'Open File';
OpenFile.id = 'importbtn';
OpenFile.style.cssFloat = 'right';
OpenFile.setAttribute("type", "button");
OpenFile.setAttribute("class", "savebtn");
OpenFile.appendAfter(node3);

var node4 = document.getElementById("importbtn");
var ImportFile = document.createElement('input');
ImportFile.id = 'fileToLoad';
ImportFile.setAttribute("type", "file");
ImportFile.setAttribute("class", "importfile");
ImportFile.appendAfter(node4);




function saveTextAsFile() {
    var textToSave = document.getElementById("reply-messsage").value;
    var textToSaveAsBlob = new Blob([textToSave], {type:"text/plain;charset=utf-8"});
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);

    var downloadLink = document.createElement("a");
    downloadLink.download = "bbcode thread.txt";
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);

    downloadLink.click();
}

function destroyClickedElement(event) {
    document.body.removeChild(event.target);
}

function loadFileAsText() {
    var fileToLoad = document.getElementById("fileToLoad").files[0];

    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent)
    {
        var textFromFileLoaded = fileLoadedEvent.target.result;
        var val = document.getElementById("reply-messsage").value;
        document.getElementById("reply-messsage").value = val + textFromFileLoaded;
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
    document.getElementById("fileToLoad").value = "";
}


document.getElementById('savetofile').addEventListener("click", saveTextAsFile);
document.getElementById('importbtn').addEventListener("click", loadFileAsText);

