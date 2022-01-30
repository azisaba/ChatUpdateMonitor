/*

created by huda0209
ChatUpdateMonitor for discord bot 

ran by node.js

2022-1-30

This source code was borrowed from the following site.
https://y-kawaz.hatenadiary.org/entry/20110415/1302846675

*/

"use strict"


function customPrepareStackTrace(error, structuredStackTrace) {
    return structuredStackTrace[0].getLineNumber();
};

function getLineNumber() {
    let original = Error.prepareStackTrace;
    Error.prepareStackTrace = customPrepareStackTrace;
    let error = {};
    Error.captureStackTrace(error, getLineNumber);
    let lineNumber = error.stack;
    Error.prepareStackTrace = original;
    return lineNumber;
  }

module.exports = getLineNumber;