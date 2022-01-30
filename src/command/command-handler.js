/*

created by huda0209
ChatUpdateMonitor for discord bot 

ran by node.js

2022-1-30

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
                if(!(message.author.id == message.guild.ownerId || configManager.getGuildtData("Admin").indexOf(message.author.id)>-1)){
                    message.reply(embedContent.errorWithTitle(`❌コマンド実行失敗`, `そのコマンドを実行する権限がありません。`))
                        .catch(e=>{
                            console.log(e);
                        });
                    break;
                }
                AdminCommandHandler([command, ...args],message,client);
                break;
        };
    })
}


async function AdminCommandHandler([command, ...args],message,client){
    if(args.length==0){
        message.reply(embedContent.errorWithTitle(`❌コマンド実行失敗`, `引数が不足しています。\n実行例\`${configManager.getBotData("PREFIX")}${configManager.getBotData("COMMAND")} <サブコマンド>\``))
            .catch(e=>{
                console.log(e);
            });
        return;
    }
    switch(args[0].toLowerCase()){
        case "admin" :
        case "a":
            adminCommandRunner([command, ...args],message,client);
            break;
    
        case "stop" :
            logger.info(`server was stoped by {cyan}${message.author.tag}`);
            await message.delete();
            process.exit(0);

        case "ignorechannel":
        case "ignorech":
        case "ignoch":
        case "ich":
            ignoreChannelCommandRunner([command, ...args],message);
            break;

        case "ignorecategory":
        case "ignorecate":
        case "ignocate":
        case "ica":
            ignoreCategoryCommandRunner([command, ...args],message);
            break;

        case "info":
        case "i":
            infoCommandRunnner([command, ...args],message);
            break

        case "list" :
        case "l":
            const CategoryList = configManager.getMonitorCategoryList().map(key=>{
                const lastUpdateDate = (new Date(configManager.getCategoryLastUpdate(key)));
                lastUpdateDate.setSeconds(lastUpdateDate.getSeconds()+configManager.getGuildtData("period"));
    
                const category = message.guild.channels.cache.get(key);
                return `${lastUpdateDate.getTime() > (new Date()).getTime() ? "✅" : "‼"} **${category.name}**   -   最終アクション : <t:${Math.floor(configManager.getCategoryLastUpdate(key)/1000)}:F> <t:${Math.floor(configManager.getCategoryLastUpdate(key)/1000)}:R>`;
            })
            message.reply(embedContent.infoWithTitle(`👀監視カテゴリーリスト`, CategoryList.length>0 ? CategoryList.join("\n") : `❓監視しているカテゴリはありません。`))
                .catch(e=>{
                    console.log(e);
                });
            break;

        case "setperiod":
        case "setp":
        case "sp":
            setGuildDataCommandRunner.setPeriod([command, ...args], message);
            break;

        case "setsystemmessagechannel" :
        case "setchannel":
        case "setsmc":
        case "ssmc":
        case "sc":
            setGuildDataCommandRunner.setSystemMessageChannel([command, ...args], message);
            break;
                
        case "help" :
        case "h":
            message.reply(embedContent.infoWithTitle(`❔ヘルプ`, `下記リンクより確認してみてください。\nhttps://github.com/azisaba/ChatUpdateMonitor/blob/master/README.md`))
                .catch(e=>{
                    console.log(e);
                });
            break;

        default:
            message.reply(embedContent.errorWithTitle(`❓コマンドがありません`, `実行したコマンドは登録されていません。`))
                .catch(e=>{
                    console.log(e);
                });
            break;
      };
}
