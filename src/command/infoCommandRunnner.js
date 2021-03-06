/*

created by huda0209
ChatUpdateMonitor for discord bot 

ran by node.js

2022-1-30

*/

"use strict"

const configManager = require("../config/configManager");
const embedContent = require("../util/embed");
const lineNumber = require("../util/LineNumber");

module.exports = ([command, ...args], message)=>{


    const period = configManager.getGuildtData("period");

    const timeD = Math.floor(period / (24 * 60 * 60));
    const timeH = Math.floor(period % (24 * 60 * 60) / (60 * 60));
    const timeM = Math.floor(period % (24 * 60 * 60) % (60 * 60) / 60);
    const timeS = period % (24 * 60 * 60) % (60 * 60) % 60;
    const timeString = `πη£θ¦ζι : ${timeD>0?`${timeD}ζ₯` : ""}${timeH>0?`${timeH}ζι` : ""}${timeM>0?`${timeM}ε` : ""}${timeS>0?`${timeS}η§` : ""}`;

    const ignoreCategoryList = configManager.getIgnoreCategoryList();
    const ignoreChannelList = configManager.getIgnoreChannelList();
    
    const ignoreCategoryNameList = ignoreCategoryList.map(key=>{
        //`${category name} (${category id})`
        return `${message.guild.channels.cache.get(key).name} (${message.guild.channels.cache.get(key).id})`;
    })

    const ignoreChannelsLinkList = ignoreChannelList.map(key=>{
        const parentName = message.guild.channels.cache.get(message.guild.channels.cache.get(key).parentId).name;
        //`<#channel id> (parent name)
        return `<#${key}> (${parentName})`;
    })

    const noticeChannelString = `π£γ·γΉγγ γ‘γγ»γΌγΈιδΏ‘εγγ£γ³γγ« : <#${configManager.getGuildtData("sendSystemMessageChannelId")}>`;
    
    const ignoreGuildChannelString = (ignoreCategoryList.length>0 && ignoreChannelList.length>0) ? 
                `πι€ε€γͺγΉγ\n**γ»γ«γγ΄γͺ**\n${ignoreCategoryNameList.join("\n")}\n\n**γ»γγ£γ³γγ«**\n${ignoreChannelsLinkList.join("\n")}`
                : (ignoreCategoryList.length>0) ? 
                      `πι€ε€γͺγΉγ\nγ»**γ«γγ΄γͺ**\n${ignoreCategoryNameList.join("\n")}\n\n**γ»γγ£γ³γγ«**\nβη»ι²γͺγ`
                      : (ignoreChannelList.length>0) ?
                        `πι€ε€γͺγΉγ\nγ»**γ«γγ΄γͺ**\nβη»ι²γͺγ\n\n**γ»γγ£γ³γγ«**\n${ignoreChannelsLinkList.join("\n")}`
                        :`πι€ε€γͺγΉγ\nβι€ε€γͺγΉγγ«γ―δ½γη»ι²γγγ¦γγͺγγγγθ‘¨η€Ίγγγγ?γγγγΎγγγ`;
                    
    message.reply(embedContent.infoWithTitle(`πγ€γ³γγ©γ‘γΌγ·γ§γ³`, [timeString, noticeChannelString, ignoreGuildChannelString].join("\n\n")))
        .catch(e=>{
            console.log(e);
            console.log(`at ${__filename}:${lineNumber()-3}`);
        });
}