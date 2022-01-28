/*

created by huda0209
ChatUpdateMonitor for discord bot 

ran by node.js

2022-1-29

*/

"use strict"

const configManager = require("../config/configManager");
const embedContent = require("../util/embed");

module.exports = (client)=>{
    client.on("messageCreate", async message => {
        if(!message.mentions.has(client.user)) return;

        const parentId = message.channel.parent.type == "GUILD_CATEGORY" ? 
            message.channel.parent.id : ( message.guild.channels.cache.get(message.channel.parent.id).parent.type == "GUILD_CATEGORY" ? message.guild.channels.cache.get(message.channel.parent.id).parent.id : null );
        const channelId = message.channel.type == "GUILD_TEXT" ? 
            message.channelId : ( message.guild.channels.cache.get(message.channel.parent.id).type == "GUILD_TEXT" ? message.guild.channels.cache.get(message.channel.parent.id).id : null );
                
        if(    parentId == null
            || channelId == null
            || message.system
            || message.author.bot
            || message.content.startsWith(configManager.getBotData("PREFIX"))
          ) return;
        
          const period = configManager.getGuildtData("period");

          const timeD = Math.floor(period / (24 * 60 * 60));
          const timeH = Math.floor(period % (24 * 60 * 60) / (60 * 60));
          const timeM = Math.floor(period % (24 * 60 * 60) % (60 * 60) / 60);
          const timeS = period % (24 * 60 * 60) % (60 * 60) % 60;
          const timeString = `${timeD>0?`${timeD}日` : ""}${timeH>0?`${timeH}時間` : ""}${timeM>0?`${timeM}分` : ""}${timeS>0?`${timeS}秒` : ""}`;
        
        message.reply(
            embedContent.infoWithTitle(`💬ChatUpdateMonitor`, `**こいつだれ?**\nチャットの更新を監視して、設定された期間アクションがない場合、通知を行うbotです。\n\n**🎈このカテゴリの状態**\n${configManager.existIgnoreCategory(parentId) ? `このチャンネルのカテゴリは除外リストに追加されています` : configManager.existMonitorCategory(parentId) ? `${configManager.getNotifyStatus(parentId)? `🛑最終アクションから${timeString}経過しています...` : `✅まだ最終アクションから${timeString}経過していません!`}\n前回のアクション : <t:${Math.floor(configManager.getCategoryLastUpdate(parentId)/1000)}:F><t:${Math.floor(configManager.getCategoryLastUpdate(parentId)/1000)}:R>` : `👀このチャンネルはまだモニターされていません。`}${configManager.existIgnoreChannel(channelId)? `\n\nこのチャンネルは除外リストに追加されています` : ""}`
        ));
  })
}