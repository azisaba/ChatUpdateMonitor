/*

created by huda0209
ChatUpdateMonitor for discord bot 

ran by node.js

2022-1-27

*/

"use strict"

const logger = require('../util/logger');
const admin = require('./admin/admin.js');
const embedContent = require("../util/embed");

const ignoreChannelCommandRunner = require("./ignoreChannelCommandRunner");
const ignoreCategoryCommandRunner = require("./ignoreCategoryCommandRunner");
const infoCommandRunnner = require("./infoCommandRunnner");


/*
const discord = require("discord.js")
const client = new discord.Client({intents: ["GUILDS", "GUILD_MESSAGES","DIRECT_MESSAGES"], partials: ["USER", "MESSAGE", "CHANNEL"]});
//*/

const configManager = require("../config/configManager");

module.exports = (
    //*
    client
    //*/
    )=>{
      client.on("messageCreate", async message => {

        /*let content = message.content.replace(/ /g, "");
        content = content.replace(/</g, "");
        content = content.replace(/>/g, "");
        content = content.replace(/　/g, "");
        console.log(content)
        console.log(content.split('#'));
*/
        //console.log(message.guild.channels.cache)
        if(!message.content.startsWith(configManager.getBotData("PREFIX"))) return;

        const [command, ...args] = message.content.slice(configManager.getBotData("PREFIX").length).split(' ');   
        switch(command.toLowerCase()){
            case configManager.getBotData("COMMAND") :
                if(!(message.author.id == message.guild.ownerId || guildData.Admin.indexOf(message.author.id)>-1)) break;
                AdminCommandHandler([command, ...args],message,client);
                break;
        };
        
  })
}


async function AdminCommandHandler([command, ...args],message,client){
    if(args.length==0){
        message.reply(embedContent.errorWithTitle(`❌**コマンド実行失敗**❌`, `引数が不足しています。\n実行例\`${configManager.getBotData("PREFIX")}${configManager.getBotData("COMMAND")} <サブコマンド>\``))
        return;
    }
    switch(args[0].toLowerCase()){
        case "admin" :
            admin.adminManager([command, ...args],message,client);
            break;
    
        case "stop" :
            logger.info(`server was stoped by {cyan}${message.author.tag}`);
            await message.delete();
            client.destroy();
            process.exit(0);

        case "ignorechannel":
            ignoreChannelCommandRunner([command, ...args],message);
            break;

        case "ignorecategory":
            ignoreCategoryCommandRunner([command, ...args],message);
            break;

        case "info":
            infoCommandRunnner([command, ...args],message);
            break

        case "list" :
            const CategoryList = configManager.getMonitorCategoryList().map(key=>{
                const lastUpdateDate = (new Date(configManager.getCategoryLastUpdate(key)));
                lastUpdateDate.setSeconds(lastUpdateDate.getSeconds()+configManager.getGuildtData("period"));
    
                const category = message.guild.channels.cache.get(key);
                return `${lastUpdateDate.getTime() > (new Date()).getTime() ? "✅" : "‼"} **${category.name}**   -   最終アクション : <t:${Math.floor(configManager.getCategoryLastUpdate(key)/1000)}:F> <t:${Math.floor(configManager.getCategoryLastUpdate(key)/1000)}:R>`;
            })
            message.reply(embedContent.infoWithTitle(`👀監視カテゴリーリスト`, CategoryList.length>0 ? CategoryList.join("\n") : `❓監視しているカテゴリはありません。`))
            break;

        case "setperiod":
            if(args.length<2){
                message.reply(embedContent.errorWithTitle(`❌**コマンド実行失敗**❌`, `引数が不足しています。\n実行例\`${configManager.getBotData("PREFIX")}${configManager.getBotData("COMMAND")} setPeriod [seconds]\``));
                return;
            }
            if(!Number(args[1])){
                message.reply(embedContent.errorWithTitle(`❌**コマンド実行失敗**❌`, `監視期間は数値で指定してください。`))
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
            break;

        case "help" :
            message.channel.send({embeds:[embedContent.info(`**移行するメッセージのあるチャンネル(若しくはスレッド)で下記のコマンドを入力**\n・チャンネルorスレッド → チャンネル\n\`${configManager.getBotData("PREFIX")}${configManager.getBotData("COMMAND")} run <移行する最初のメッセージのid> <移行先のチャンネルid> <移行するメッセージ数>\`\n\n・チャンネルorスレッド → スレッド\n\`${configManager.getBotData("PREFIX")}${configManager.getBotData("COMMAND")} run <移行する最初のメッセージのid> <移行先のスレッドがあるチャンネルid>:<移行先のスレッドid> <移行するメッセージ数>\``)]})
            break;

        case "debug" :
            configManager.debug();
            break;

        default:
            message.reply(embedContent.errorWithTitle(`❓**コマンドがありません**❓`, `実行したコマンドは登録されていません。`));
            break;
      };
}