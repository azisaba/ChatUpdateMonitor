/*

created by huda0209
ChatUpdateMonitor for discord bot 

ran by node.js

2022-1-28

*/

"use strict"

const logger = require('../util/logger');
const adminCommandRunner = require('./adminCommandRunner.js');
const embedContent = require("../util/embed");

const ignoreChannelCommandRunner = require("./ignoreChannelCommandRunner");
const ignoreCategoryCommandRunner = require("./ignoreCategoryCommandRunner");
const infoCommandRunnner = require("./infoCommandRunnner");
const setGuildDataCommandRunner = require("./setGuildDataCommandRunner");


const configManager = require("../config/configManager");

module.exports = (client)=>{
    client.on("messageCreate", async message => {
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
        message.reply(embedContent.errorWithTitle(`❌コマンド実行失敗`, `引数が不足しています。\n実行例\`${configManager.getBotData("PREFIX")}${configManager.getBotData("COMMAND")} <サブコマンド>\``));
        return;
    }
    switch(args[0].toLowerCase()){
        case "admin" :
            adminCommandRunner([command, ...args],message,client);
            break;
    
        case "stop" :
            logger.info(`server was stoped by {cyan}${message.author.tag}`);
            await message.delete();
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
            message.reply(embedContent.infoWithTitle(`👀監視カテゴリーリスト`, CategoryList.length>0 ? CategoryList.join("\n") : `❓監視しているカテゴリはありません。`));
            break;

        case "setperiod":
            setGuildDataCommandRunner.setPeriod([command, ...args], message);
            break;

        case "setsystemmessagechannel" :
            setGuildDataCommandRunner.setSystemMessageChannel([command, ...args], message);
            break;
                
        case "help" :
            message.channel.send({embeds:[embedContent.info(`**移行するメッセージのあるチャンネル(若しくはスレッド)で下記のコマンドを入力**\n・チャンネルorスレッド → チャンネル\n\`${configManager.getBotData("PREFIX")}${configManager.getBotData("COMMAND")} run <移行する最初のメッセージのid> <移行先のチャンネルid> <移行するメッセージ数>\`\n\n・チャンネルorスレッド → スレッド\n\`${configManager.getBotData("PREFIX")}${configManager.getBotData("COMMAND")} run <移行する最初のメッセージのid> <移行先のスレッドがあるチャンネルid>:<移行先のスレッドid> <移行するメッセージ数>\``)]});
            break;

        default:
            message.reply(embedContent.errorWithTitle(`❓コマンドがありません`, `実行したコマンドは登録されていません。`));
            break;
      };
}