// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://v.youku.com/v_show/*
// @icon         https://www.google.com/s2/favicons?domain=youku.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    const link = document.createElement('a');
    link.style.display = 'none';
    link.target='_blank'
    link.href = `https://17kyun.com/api.php?url=${window.location.href}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Your code here...
})();