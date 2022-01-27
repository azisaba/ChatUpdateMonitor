/*

created by huda0209
ChatUpdateMonitor for discord bot 

ran by node.js

2022-1-28

*/

"use strict"

const configManager = require("../config/configManager");
const embedContent = require("../util/embed");

module.exports = (client)=>{
    client.on("messageCreate", async message => {
    
    const parentId = message.channel.parentId;
    const channelId = message.channelId;
    
    if(configManager.existIgnoreCategory(parentId)
        || configManager.existIgnoreChannel(channelId)
        || message.author.bot
        || message.content.startsWith(configManager.getBotData("PREFIX"))
      ) return;
    
    if(configManager.existMonitorCategory(parentId) && configManager.getNotifyStatus(parentId)){
        message.guild.channels.cache.get(configManager.getGuildtData("sendSystemMessageChannelId")).send(
			embedContent.infoWithTitle(`📈新たなアクションを検出しました!`, `対象カテゴリ: ${(await client.channels.fetch(parentId)).name}\n前回のアクション : <t:${Math.floor(configManager.getCategoryLastUpdate(parentId)/1000)}:F><t:${Math.floor(configManager.getCategoryLastUpdate(parentId)/1000)}:R>`
		));
    }
    const createdAt = message.createdTimestamp;
    configManager.setCategoryLastUpdate(parentId, createdAt);
  })
}