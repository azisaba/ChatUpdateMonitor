

const configManager = require("../config/configManager");
const embedContent = require("../util/embed");

module.exports = ([command, ...args], message)=>{

    const ignoreCategoryList = configManager.getIgnoreCategoryList();
    const ignoreChannelList = configManager.getIgnoreChannelList();
    
    if(ignoreCategoryList.length==0 && ignoreChannelList.length==0){
        message.reply(embedContent.infoWithTitle(`🕳表示するリストがありません!`, `除外リストには何も登録されていないため、表示するものがありません。`));
        return;
    }

    const ignoreCategoryNameList = ignoreCategoryList.map(key=>{
        //`${category name} (${category id})`
        return `${message.guild.channels.cache.get(key).name} (${message.guild.channels.cache.get(key).id})`;
    })

    const ignoreChannelsLinkList = ignoreChannelList.map(key=>{
        const parentName = message.guild.channels.cache.get(message.guild.channels.cache.get(key).parentId).name;
        //`<#channel id> (parent name)
        return `<#${key}> (${parentName})`;
    })
    
    const content = (ignoreCategoryList.length>0 && ignoreChannelList.length>0) ? 
                `**・カテゴリ**\n${ignoreCategoryNameList.join("\n")}\n\n**・チャンネル**\n${ignoreChannelsLinkList.join("\n")}`
                : (ignoreCategoryList.length>0) ? 
                      `・**カテゴリ**\n${ignoreCategoryNameList.join("\n")}\n\n**・チャンネル**\n❌登録なし`
                    : `・**カテゴリ**\n❌登録なし\n\n**・チャンネル**\n${ignoreChannelsLinkList.join("\n")}`;
                    
    message.reply(embedContent.infoWithTitle(`📋除外リスト`, content));

}