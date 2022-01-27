/*

created by huda0209
ChatUpdateMonitor for discord bot 

ran by node.js

2022-1-28

*/

"use strict"


const configManager = require("../config/configManager");
const embedContent = require("../util/embed");

exports.setPeriod = ([command, ...args], message)=>{
    if(args.length<2){
        message.reply(embedContent.errorWithTitle(`❌コマンド実行失敗`, `引数が不足しています。\n実行例\`${configManager.getBotData("PREFIX")}${configManager.getBotData("COMMAND")} setPeriod [seconds]\``));
        return;
    }
    if(!Number(args[1])){
        message.reply(embedContent.errorWithTitle(`❌コマンド実行失敗`, `監視期間は数値で指定してください。`));
        //log.error(`The process was aborted because the argument was not a number. argment:${args[3]} ProcessCount:${processCount}`);
        return;
    }
    configManager.setGuildtData("period", parseInt(args[1]));

    const timeD = Math.floor(args[1] / (24 * 60 * 60));
    const timeH = Math.floor(args[1] % (24 * 60 * 60) / (60 * 60));
    const timeM = Math.floor(args[1] % (24 * 60 * 60) % (60 * 60) / 60);
    const timeS = args[1] % (24 * 60 * 60) % (60 * 60) % 60;
    const timeString = `${timeD>0?`${timeD}日` : ""}${timeH>0?`${timeH}時間` : ""}${timeM>0?`${timeM}分` : ""}${timeS>0?`${timeS}秒` : ""}`;
    message.reply(embedContent.infoWithTitle(`✅コマンド実行成功`, `監視期間を${timeString}(${args[1]}秒)に設定しました。`));
}


exports.setSystemMessageChannel = ([command, ...args], message)=>{
    if(args.length<2){
        message.reply(embedContent.errorWithTitle(`❌コマンド実行失敗`, `引数が不足しています。\n実行例\`${configManager.getBotData("PREFIX")}${configManager.getBotData("COMMAND")} setPeriod [seconds]\``));
        return;
    }
    const channelId = args[1].replace(/</g, "").replace(/>/g, "").replace(/#/g, "");
    try{
        const channel = message.guild.channels.cache.get(channelId);
        if(!channel){
            message.reply(embedContent.errorWithTitle(`❌コマンド実行失敗`, `チャンネルが取得できませんでした。`));
            return;
        }
        if(channel.type != "GUILD_TEXT"){
            message.reply(embedContent.errorWithTitle(`❌コマンド実行失敗`, `チャンネルにはテキストチャンネルを指定してください。`));
            return;
        }
    }catch(e){
        message.channel.send(embedContent.errorWithTitle(`💥エラー発生`, `エラーが発生しました。再度実行するか、開発者に問い合わせてください。\n\`\`\`${e}\`\`\``));
        return;
    }

    configManager.setGuildtData("sendSystemMessageChannelId", channelId);
    message.reply(embedContent.infoWithTitle(`✅コマンド実行成功`, `システムメッセージ送信先チャンネルを<#${channelId}>に設定しました。`));
}