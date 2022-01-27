/*

created by huda0209
ChatUpdateMonitor for discord bot 

ran by node.js

2022-1-28

*/

"use strict"

const config = require("../util/config");

config.exist(true);
const BOT_DATA = config.loadConfig("setting.json");
const guildData = config.loadConfig("guildData.json");
const chList = config.loadConfig("channelList.json");

const monitorCategoryList = [];

for (const categoryId in chList.monitor) {
    monitorCategoryList.push(categoryId);
}




exports.getBotData = (key)=>{
    return BOT_DATA[key];
}

exports.getGuildtData = (key)=>{
    return guildData[key];
}

exports.setGuildtData = (key, value)=>{
    return guildData[key] = value;
}


exports.existIgnoreChannel = (key)=>{
    return chList.ignoreChannels.indexOf(key)>-1 ? true : false;
}

exports.getIgnoreChannelList = ()=>{
    return chList.ignoreChannels;
}

exports.addIgnoreChannel = (key)=>{
    if(chList.ignoreChannels.indexOf(key)>-1) return;
    chList.ignoreChannels.push(key);
}

exports.removeIgnoreChannel = (key)=>{
    const index = chList.ignoreChannels.indexOf(key);
    if(index== -1) throw Error("The element does not exist.");
    chList.ignoreChannels.splice(index, 1);
}



exports.existIgnoreCategory = (key)=>{
    return chList.ignoreCategorys.indexOf(key)>-1 ? true : false;
}

exports.getIgnoreCategoryList = ()=>{
    return chList.ignoreCategorys;
}

exports.addIgnoreCategory = (key)=>{
    if(chList.ignoreCategorys.indexOf(key)>-1) return;
    chList.ignoreCategorys.push(key);
    const index = monitorCategoryList.indexOf(key);
    if(index >- 1) monitorCategoryList.splice(index, 1);
    delete chList.monitor[key];
}

exports.removeIgnoreCategory = (key)=>{
    const index = chList.ignoreCategorys.indexOf(key);
    if(index== -1) throw Error("The element does not exist.");
    chList.ignoreCategorys.splice(index, 1);
}


exports.getMonitorCategoryList  = ()=>{
    return monitorCategoryList;
}

//true:Alleady notify
exports.getNotifyStatus = (key)=>{
    if(monitorCategoryList.indexOf(key)==-1) throw Error("The element does not exist.");
    return chList.monitor[key].notify;
}

exports.setNotifyStatus = (key, value)=>{
    if(monitorCategoryList.indexOf(key)==-1) throw Error("The element does not exist.");
    chList.monitor[key].notify = value;
}

exports.getCategoryLastUpdate = (key)=>{
    if(monitorCategoryList.indexOf(key)==-1) return undefined;
    return chList.monitor[key].time;
}

exports.setCategoryLastUpdate = (key, value)=>{
    if(chList.ignoreCategorys.indexOf(key)>-1) throw Error("Included in the ignoreChannels list.");
    chList.monitor[key] = {
        "time" : value,
        "notify" : false
    }
    if(monitorCategoryList.indexOf(key)==-1) monitorCategoryList.push(key);
    
}

exports.removeCategory = (key)=>{
    const index = monitorCategoryList.indexOf(key)
    if(index == -1) throw Error("The element does not exist.");
    delete chList.monitor[key];
    monitorCategoryList.splice(index, 1);
}


exports.saveConfig = ()=>{
    config.save("guildData.json", guildData);
    config.save("channelList.json", chList);
}