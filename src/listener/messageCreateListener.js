/*

created by huda0209
ChatUpdateMonitor for discord bot 

ran by node.js

2022-1-30

*/

"use strict"

const configManager = require("../config/configManager");
const embedContent = require("../util/embed");
const lineNumber = require("../util/LineNumber");

module.exports = (client)=>{
    client.on("messageCreate", async message => {
    const parentId = message.channel.parent.type == "GUILD_CATEGORY" ? 
        message.channel.parent.id : ( message.guild.channels.cache.get(message.channel.parent.id).parent.type == "GUILD_CATEGORY" ? message.guild.channels.cache.get(message.channel.parent.id).parent.id : null );
    const channelId = message.channel.type == "GUILD_TEXT" ? 
        message.channelId : ( message.guild.channels.cache.get(message.channel.parent.id).type == "GUILD_TEXT" ? message.guild.channels.cache.get(message.channel.parent.id).id : null );
    
    if(    parentId == null
        || channelId == null
        || configManager.existIgnoreCategory(parentId)
        || configManager.existIgnoreChannel(channelId)
        || message.system
        || message.author.bot
        || message.content.startsWith(configManager.getBotData("PREFIX"))
      ) return;
    
    if(configManager.existMonitorCategory(parentId) && configManager.getNotifyStatus(parentId)){
        message.guild.channels.cache.get(configManager.getGuildtData("sendSystemMessageChannelId")).send(
		      embedContent.infoWithTitle(`ðæ°ããªã¢ã¯ã·ã§ã³ãæ€åºããŸãã!`, `å¯Ÿè±¡ã«ããŽãª: ${(await client.channels.fetch(parentId)).name}\nååã®ã¢ã¯ã·ã§ã³ : <t:${Math.floor(configManager.getCategoryLastUpdate(parentId)/1000)}:F><t:${Math.floor(configManager.getCategoryLastUpdate(parentId)/1000)}:R>`
		    ))
      		.catch(e=>{
      		    console.log(e);
      		    console.log(`at ${__filename}:${lineNumber()-5}`);
      		});
    }
    const createdAt = message.createdTimestamp;
    configManager.setCategoryLastUpdate(parentId, createdAt);
  })
}