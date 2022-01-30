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
    if(args.length<2){
        message.reply(embedContent.errorWithTitle(`❌コマンド実行失敗`, `引数が不足しています。\n実行例\`${configManager.getBotData("PREFIX")}${configManager.getBotData("COMMAND")} ignoreChannel <add | remove> [チャンネル...]\``))
            .catch(e=>{
                console.log(e);
                console.log(`at ${__filename}:${lineNumber()-3}`);
            });
        return;
    }
    switch(args[1].toLowerCase()){
        case "add":
            if(args.length<3){
                if(configManager.existIgnoreChannel(message.channelId)){
                    message.reply(embedContent.errorWithTitle(`❌追加失敗`, `チャンネル<#${message.channel.id}>は既に除外リストに追加されています。`))
                        .catch(e=>{
                            console.log(e);
                            console.log(`at ${__filename}:${lineNumber()-3}`);
                        });
                    return;
                }
                if(message.channel.type != "GUILD_TEXT"){
                    message.reply(embedContent.errorWithTitle(`❌追加失敗`, `<#${message.channel.id}>はチャンネルではありません。`))
                        .catch(e=>{
                            console.log(e);
                            console.log(`at ${__filename}:${lineNumber()-3}`);
                        });
                    return;
                }
                configManager.addIgnoreChannel(message.channelId);
                message.reply(embedContent.infoWithTitle(`🏷**追加成功`, `チャンネル<#${message.channel.id}>は除外リストに追加されました。`))
                    .catch(e=>{
                        console.log(e);
                        console.log(`at ${__filename}:${lineNumber()-3}`);
                    });
            }else {
                const succeedToAddCh = [];
                const failedToAddCh = [];

                const channels = args.splice(2, args.length).join("").replace(/ /g, "").replace(/</g, "").replace(/>/g, "").replace(/　/g, "").split('#');
                channels.shift();
                
                channels.forEach(key=>{
                    try{
                        const channel = message.guild.channels.cache.get(key);
                        if(channel.type != "GUILD_TEXT"){
                            message.reply(embedContent.errorWithTitle(`❌追加失敗`, `<#${message.channel.id}>はチャンネルではありません。`));
                            return;
                        }
                        if(configManager.existIgnoreChannel(channel.id)){
                            failedToAddCh.push(`<${channel.id}>`);
                            return;
                        }
                        configManager.addIgnoreChannel(channel.id);
                        succeedToAddCh.push(`<#${channel.id}>`);
                    }catch(e){
                        message.reply(embedContent.errorWithTitle(`💥エラー発生`, `エラーが発生しました。再度実行するか、開発者に問い合わせてください。\n\`\`\`${e}\`\`\``))
                            .catch(er=>{
                                console.log(er);
                                console.log(`at ${__filename}:${lineNumber()-3}`);
                            });
                        console.log(e);
                        console.log(`at ${__filename}:${lineNumber()-20}`);
                    };

                })
                if(succeedToAddCh.length) message.reply(embedContent.infoWithTitle(`🏷追加成功`, `チャンネル${succeedToAddCh.join(" ")}は除外リストに追加されました。`))
                                                .catch(e=>{
                                                    console.log(e);
                                                    console.log(`at ${__filename}:${lineNumber()-3}`);
                                                });
                if(failedToAddCh.length) message.reply(embedContent.errorWithTitle(`❌追加失敗`, `チャンネル${failedToAddCh.join(" ")}は既に除外リストに追加されています。`))
                                                .catch(e=>{
                                                    console.log(e);
                                                    console.log(`at ${__filename}:${lineNumber()-3}`);
                                                });
            }
            break;

        case "remove":
            if(args.length<3){
                if(!configManager.existIgnoreChannel(message.channelId)){
                    message.reply(embedContent.errorWithTitle(`❌削除失敗`, `チャンネル<#${message.channel.id}>は除外リストにないため、削除できませんでした。`))
                        .catch(e=>{
                            console.log(e);
                            console.log(`at ${__filename}:${lineNumber()-3}`);
                        });
                    return;
                }
                if(message.channel.type != "GUILD_TEXT"){
                    message.reply(embedContent.errorWithTitle(`❌削除失敗`, `<#${message.channel.id}>はチャンネルではありません。`))
                        .catch(e=>{
                            console.log(e);
                            console.log(`at ${__filename}:${lineNumber()-3}`);
                        });
                    return;
                }
                configManager.removeIgnoreChannel(message.channelId);
                message.reply(embedContent.infoWithTitle(`🗑削除成功`, `チャンネル<#${message.channel.id}>は除外リストから削除されました。`))
                    .catch(e=>{
                        console.log(e);
                        console.log(`at ${__filename}:${lineNumber()-3}`);
                    });
            }else {
                const succeedToRemoveCh = [];
                const failedToRemoveCh = [];

                const channels = args.splice(2, args.length).join("").replace(/ /g, "").replace(/</g, "").replace(/>/g, "").replace(/　/g, "").split('#');
                channels.shift();
                
                channels.forEach(key=>{
                    try{
                        const channel = message.guild.channels.cache.get(key);
                        if(channel.type != "GUILD_TEXT"){
                            message.reply(embedContent.errorWithTitle(`❌削除失敗`, `<#${message.channel.id}>はチャンネルではありません。`));
                            return;
                        }
                        if(!configManager.existIgnoreChannel(channel.id)){
                            failedToRemoveCh.push(`<#${channel.id}>`);
                            return;
                        }
                        configManager.removeIgnoreChannel(channel.id);
                        succeedToRemoveCh.push(`<#${channel.id}>`);
                    }catch(e){
                        message.reply(embedContent.errorWithTitle(`💥エラー発生`, `エラーが発生しました。再度実行するか、開発者に問い合わせてください。\n\`\`\`${e}\`\`\``))
                            .catch(er=>{
                                console.log(er);
                                console.log(`at ${__filename}:${lineNumber()-3}`);
                            });
                        console.log(e);
                        console.log(`at ${__filename}:${lineNumber()-20}`);
                    };

                })
                if(succeedToRemoveCh.length) message.reply(embedContent.infoWithTitle(`🗑削除成功`, `チャンネル${succeedToRemoveCh.join(" ")}は除外リストから削除されました。`))
                                                    .catch(e=>{
                                                        console.log(e);
                                                        console.log(`at ${__filename}:${lineNumber()-3}`);
                                                    });
                if(failedToRemoveCh.length) message.reply(embedContent.errorWithTitle(`❌削除失敗`, `チャンネル${failedToRemoveCh.join(" ")}は除外リストにないため、削除できませんでした。`))
                                                    .catch(e=>{
                                                        console.log(e);
                                                        console.log(`at ${__filename}:${lineNumber()-3}`);
                                                    });

            }
        break;
    }
}