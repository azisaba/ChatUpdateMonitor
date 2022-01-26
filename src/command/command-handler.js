/*

created by huda0209
ChatUpdateMonitor for discord bot 

ran by node.js

2022-1-26

*/

"use strict"

const logger = require('../util/logger');
const admin = require('./admin/admin.js');
const embedContent = require("../util/embed");


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
    if(args.length==0) return;
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
            if(args.length<2) return;
            switch(args[1].toLowerCase()){
                case "add":
                    if(args.length<3){
                        if(configManager.existIgnoreChannel(message.channelId)){
                            message.channel.send(embedContent.errorWithTitle(`❌**追加失敗**❌`, `チャンネル<#${message.channel.id}>は既に除外リストに追加されています。`))
                            return;
                        }
                        configManager.addIgnoreChannel(message.channelId);
                        message.channel.send(embedContent.infoWithTitle(`🏷**追加成功**🏷`, `チャンネル<#${message.channel.id}>は除外リストに追加されました。`))
                    }else {
                        const succeedToAddCh = [];
                        const failedToAddCh = [];

                        const channels = args.splice(2, args.length).join("").replace(/ /g, "").replace(/</g, "").replace(/>/g, "").replace(/　/g, "").split('#');
                        channels.shift();
                        
                        channels.forEach(key=>{
                            try{
                                const channel = message.guild.channels.cache.get(key);
                                if(configManager.existIgnoreChannel(channel.id)){
                                    failedToAddCh.push(`<${channel.id}>`);
                                    return;
                                }
                                configManager.addIgnoreChannel(channel.id);
                                succeedToAddCh.push(`<#${channel.id}>`);
                            }catch(e){
                                message.channel.send(embedContent.errorWithTitle(`💥エラー発生💥`, `エラーが発生しました。再度実行するか、開発者に問い合わせてください。\n\`\`\`${e}\`\`\``));
                                console.log(e);
                            };

                        })
                        if(succeedToAddCh.length) message.channel.send(embedContent.infoWithTitle(`🏷**追加成功**🏷`, `チャンネル${succeedToAddCh.join(" ")}は除外リストに追加されました。`))
                        if(failedToAddCh.length) message.channel.send(embedContent.errorWithTitle(`❌**追加失敗**❌`, `チャンネル${failedToAddCh.join(" ")}は既に除外リストに追加されています。`));
                    }
                    break;

                case "remove":
                    if(args.length<3){
                        if(!configManager.existIgnoreChannel(message.channelId)){
                            message.channel.send(embedContent.errorWithTitle(`❌**削除失敗**❌`, `チャンネル<#${message.channel.id}>は除外リストにないため、削除できませんでした。`));
                            return;
                        }
                        configManager.removeIgnoreChannel(message.channelId);
                        message.channel.send(embedContent.infoWithTitle(`🗑**削除成功**🗑`, `チャンネル<#${message.channel.id}>は除外リストから削除されました。`));
                    }else {
                        const succeedToRemoveCh = [];
                        const failedToRemoveCh = [];

                        const channels = args.splice(2, args.length).join("").replace(/ /g, "").replace(/</g, "").replace(/>/g, "").replace(/　/g, "").split('#');
                        channels.shift();
                        
                        channels.forEach(key=>{
                            try{
                                const channel = message.guild.channels.cache.get(key);
                                if(!configManager.existIgnoreChannel(channel.id)){
                                    failedToRemoveCh.push(`<#${channel.id}>`);
                                    return;
                                }
                                configManager.removeIgnoreChannel(channel.id);
                                succeedToRemoveCh.push(`<#${channel.id}>`);
                            }catch(e){
                                message.channel.send(embedContent.errorWithTitle(`💥エラー発生💥`, `エラーが発生しました。再度実行するか、開発者に問い合わせてください。\n\`\`\`${e}\`\`\``));
                            };

                        })
                        if(succeedToRemoveCh.length) message.channel.send(embedContent.infoWithTitle(`🗑**削除成功**🗑`, `チャンネル${succeedToRemoveCh.join(" ")}は除外リストから削除されました。`));
                        if(failedToRemoveCh.length) message.channel.send(embedContent.errorWithTitle(`❌**削除失敗**❌`, `チャンネル${failedToRemoveCh.join(" ")}は除外リストにないため、削除できませんでした。`))

                    }
                    break;

            }
            break;

        case "help" :
            message.channel.send({embeds:[embedContent.info(`**移行するメッセージのあるチャンネル(若しくはスレッド)で下記のコマンドを入力**\n・チャンネルorスレッド → チャンネル\n\`${configManager.getBotData("PREFIX")}${configManager.getBotData("COMMAND")} run <移行する最初のメッセージのid> <移行先のチャンネルid> <移行するメッセージ数>\`\n\n・チャンネルorスレッド → スレッド\n\`${configManager.getBotData("PREFIX")}${configManager.getBotData("COMMAND")} run <移行する最初のメッセージのid> <移行先のスレッドがあるチャンネルid>:<移行先のスレッドid> <移行するメッセージ数>\``)]})
            break;

        case "debug" :
            configManager.debug();
            break;

        default:
            message.reply(`Unknown command.`);
            break;
      };
}