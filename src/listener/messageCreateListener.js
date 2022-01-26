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
      
      const parentId = message.channel.parentId;
      const channelId = message.channelId;
      
      if(configManager.existIgnoreCategory(parentId)|| configManager.existIgnoreChannel(channelId)) return;

      const createdAt = message.createdTimestamp;
      configManager.setCategoryLastUpdate(parentId, createdAt);
  })
}

