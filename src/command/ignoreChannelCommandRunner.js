


const configManager = require("../config/configManager");
const embedContent = require("../util/embed");

module.exports = ([command, ...args], message)=>{
    if(args.length<2){
        message.reply(embedContent.errorWithTitle(`❌**コマンド実行失敗**❌`, `引数が不足しています。\n実行例\`${configManager.getBotData("PREFIX")}${configManager.getBotData("COMMAND")} ignoreChannel <add | remove> [チャンネル...]\``))
        return;
    }
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
}