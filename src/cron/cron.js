


const embedContent = require("../util/embed");
const configManager = require("../config/configManager");

module.exports = async (client)=>{
    setInterval( async () => {
        const period = configManager.getGuildtData("period");

        const timeD = Math.floor(period / (24 * 60 * 60));
        const timeH = Math.floor(period % (24 * 60 * 60) / (60 * 60));
        const timeM = Math.floor(period % (24 * 60 * 60) % (60 * 60) / 60);
        const timeS = period % (24 * 60 * 60) % (60 * 60) % 60;
        const timeString = `${timeD>0?`${timeD}日` : ""}${timeH>0?`${timeH}時間` : ""}${timeM>0?`${timeM}分` : ""}${timeS>0?`${timeS}秒` : ""}`

        configManager.getMonitorCategoryList().forEach(async key=>{
            const lastUpdateDate = (new Date(configManager.getCategoryLastUpdate(key)));
            lastUpdateDate.setSeconds(lastUpdateDate.getSeconds()+period);

            if(lastUpdateDate.getTime() > (new Date()).getTime()) return;
            if(configManager.getNotifyStatus(key)) return;
            try{
                (await client.channels.fetch(configManager.getGuildtData("sendSystemMessageChannelId"))).send(
                    embedContent.infoWithTitle(`最後のアクションから${timeString}経ちました!`, `対象カテゴリ: ${(await client.channels.fetch(key)).name}\n最終アクション : <t:${Math.floor(configManager.getCategoryLastUpdate(key)/1000)}:F><t:${Math.floor(configManager.getCategoryLastUpdate(key)/1000)}:R>`
                    ))
                configManager.setNotifyStatus(key, true);
            }catch(e){ 
                console.log(e)
            }
        })
    }, 1000)
}