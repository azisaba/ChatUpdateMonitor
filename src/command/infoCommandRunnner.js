/*

created by huda0209
ChatUpdateMonitor for discord bot 

ran by node.js

2022-1-30

*/

"use strict"

const configManager = require("../config/configManager");
const embedContent = require("../util/embed");
const lineNumber = require("./src/util/LineNumber");

module.exports = ([command, ...args], message)=>{


    const period = configManager.getGuildtData("period");

    const timeD = Math.floor(period / (24 * 60 * 60));
    const timeH = Math.floor(period % (24 * 60 * 60) / (60 * 60));
    const timeM = Math.floor(period % (24 * 60 * 60) % (60 * 60) / 60);
    const timeS = period % (24 * 60 * 60) % (60 * 60) % 60;
    const timeString = `🕒監視期間 : ${timeD>0?`${timeD}日` : ""}${timeH>0?`${timeH}時間` : ""}${timeM>0?`${timeM}分` : ""}${timeS>0?`${timeS}秒` : ""}`;

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

    const noticeChannelString = `📣システムメッセージ送信先チャンネル : <#${configManager.getGuildtData("sendSystemMessageChannelId")}>`;
    
    const ignoreGuildChannelString = (ignoreCategoryList.length>0 && ignoreChannelList.length>0) ? 
                `📋除外リスト\n**・カテゴリ**\n${ignoreCategoryNameList.join("\n")}\n\n**・チャンネル**\n${ignoreChannelsLinkList.join("\n")}`
                : (ignoreCategoryList.length>0) ? 
                      `📋除外リスト\n・**カテゴリ**\n${ignoreCategoryNameList.join("\n")}\n\n**・チャンネル**\n❌登録なし`
                      : (ignoreChannelList.length>0) ?
                        `📋除外リスト\n・**カテゴリ**\n❌登録なし\n\n**・チャンネル**\n${ignoreChannelsLinkList.join("\n")}`
                        :`📋除外リスト\n❌除外リストには何も登録されていないため、表示するものがありません。`;
                    
    message.reply(embedContent.infoWithTitle(`📚インフォメーション`, [timeString, noticeChannelString, ignoreGuildChannelString].join("\n\n")))
        .catch(e=>{
            console.log(e);
            console.log(`at ${__filename}:${lineNumber()-3}`);
        });
}