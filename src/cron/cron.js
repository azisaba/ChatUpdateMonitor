


//const cron = require("node-cron");
const embedContent = require("../util/embed");
const configManager = require("../config/configManager");

module.exports = async (client)=>{
    setInterval( async () => {
        configManager.getMonitorCategoryList().forEach(async key=>{
            if(configManager.getCategoryLastUpdate(key) > (new Date()).getTime()) return;
            if(configManager.getNotifyStatus(key)) return;
            try{
                (await client.channels.fetch(configManager.getGuildtData("sendSystemMessageChannelId"))).send(
                    embedContent.infoWithTitle(`最後のアクションから${10}経ちました!`, `対象カテゴリ: ${(await client.channels.fetch(key)).name}\n最終アクション : <t:${Math.floor(configManager.getCategoryLastUpdate(key)/1000)}:F><t:${Math.floor(configManager.getCategoryLastUpdate(key)/1000)}:R>`
                    ))
                configManager.setNotifyStatus(key, true);
            }catch(e){ 
                //console.log(e)
            }
        })
    }, 1000)
}