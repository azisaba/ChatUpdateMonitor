


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
                if(configManager.existIgnoreCategory(message.channel.parentId)){
                    message.channel.send(embedContent.errorWithTitle(`❌**追加失敗**❌`, `カテゴリ「${message.guild.channels.cache.get(message.channel.parentId).name}」は既に除外リストに追加されています。`))
                    return;
                }
                configManager.addIgnoreCategory(message.channel.parentId);
                message.channel.send(embedContent.infoWithTitle(`🏷**追加成功**🏷`, `カテゴリ「${message.guild.channels.cache.get(message.channel.parentId).name}」は除外リストに追加されました。`))
            }else {
                const succeedToAddCategory = [];
                const failedToAddCategory = [];

                const channels = args.splice(2, args.length);
                
                channels.forEach(key=>{
                    try{
                        const channel = message.guild.channels.cache.get(key);
                        if(channel.type!="GUILD_CATEGORY") throw Error("It's not a category channel.");
                        if(configManager.existIgnoreCategory(channel.id)){
                            failedToAddCategory.push(channel.name);
                            return;
                        }
                        console.log(channel.id)
                        configManager.addIgnoreCategory(channel.id);
                        succeedToAddCategory.push(channel.name);
                    }catch(e){
                        message.channel.send(embedContent.errorWithTitle(`💥エラー発生💥`, `エラーが発生しました。再度実行するか、開発者に問い合わせてください。\n\`\`\`${e}\`\`\``));
                        console.log(e);
                    };

                })
                if(succeedToAddCategory.length) message.channel.send(embedContent.infoWithTitle(`🏷**追加成功**🏷`, `カテゴリ「${succeedToAddCategory.join(", ")}」は除外リストに追加されました。`))
                if(failedToAddCategory.length) message.channel.send(embedContent.errorWithTitle(`❌**追加失敗**❌`, `カテゴリ「${failedToAddCategory.join(" ,")}」は既に除外リストに追加されています。`));
            }
            break;

        case "remove":
            if(args.length<3){
                if(!configManager.existIgnoreCategory(message.channel.parentId)){
                    message.channel.send(embedContent.errorWithTitle(`❌**削除失敗**❌`, `カテゴリ「${message.guild.channels.cache.get(message.channel.parentId).name}」は除外リストにないため、削除できませんでした。`));
                    return;
                }
                configManager.removeIgnoreCategory(message.channel.parentId);
                message.channel.send(embedContent.infoWithTitle(`🗑**削除成功**🗑`, `カテゴリ「${message.guild.channels.cache.get(message.channel.parentId).name}」は除外リストから削除されました。`));
            }else {
                const succeedToRemoveCategory = [];
                const failedToRemoveCategory = [];

                const channels = args.splice(2, args.length);
                
                channels.forEach(key=>{
                    try{
                        const channel = message.guild.channels.cache.get(key);
                        if(channel.type!="GUILD_CATEGORY") throw Error("It's not a category channel.");
                        if(!configManager.existIgnoreCategory(channel.id)){
                            failedToRemoveCategory.push(channel.name);
                            return;
                        }
                        configManager.removeIgnoreCategory(channel.id);
                        succeedToRemoveCategory.push(channel.name);
                    }catch(e){
                        message.channel.send(embedContent.errorWithTitle(`💥エラー発生💥`, `エラーが発生しました。再度実行するか、開発者に問い合わせてください。\n\`\`\`${e}\`\`\``));
                    };

                })
                if(succeedToRemoveCategory.length) message.channel.send(embedContent.infoWithTitle(`🗑**削除成功**🗑`, `カテゴリ「${succeedToRemoveCategory.join(", ")}」は除外リストから削除されました。`));
                if(failedToRemoveCategory.length) message.channel.send(embedContent.errorWithTitle(`❌**削除失敗**❌`, `カテゴリ「${failedToRemoveCategory.join(", ")}」は除外リストにないため、削除できませんでした。`))
            }
            break;
    }
}