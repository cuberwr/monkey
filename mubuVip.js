// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://mubu.com/*
// @icon         https://www.google.com/s2/favicons?domain=mubu.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    CLIENT_CONFIG.basicAccount.nodeCount=99999
    CLIENT_CONFIG.basicAccount.canotExport=[]
    PRELOADED_DATA.user.user.level=1
    PRELOADED_DATA.user.user.vipEndDate=29990101
    // Your code here...
})();