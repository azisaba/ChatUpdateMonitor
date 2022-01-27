/*

created by huda0209
ChatUpdateMonitor for discord bot 

ran by node.js

2022-1-28

*/

"use strict"

const configManager = require("../config/configManager");

module.exports = (client)=>{
      client.on("messageCreate", async message => {
      
      const parentId = message.channel.parentId;
      const channelId = message.channelId;
      
      if(configManager.existIgnoreCategory(parentId)
          || configManager.existIgnoreChannel(channelId)
          || message.author.bot
          || message.content.startsWith(configManager.getBotData("PREFIX"))
        ) return;

      const createdAt = message.createdTimestamp;
      configManager.setCategoryLastUpdate(parentId, createdAt);
  })
}