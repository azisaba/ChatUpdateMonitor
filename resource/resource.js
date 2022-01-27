/*
created by huda0209
ChatUpdateMonitor

resource.js
 
ran by node.js
2022-1-24
*/

/*
DON'T TOUCH!!
*/

module.exports =  {
    "setting.json" : {
        pass : "./config/setting.json",
        keys : {
            NAME : {
                canEmpty : false,
                replace : false,
                default : "ChatUpdateMonitor"
            },
            MAIN_TOKEN : {
                canEmpty : false,
                replace : false,
                default : ""
            },
            DIV_TOKEN : {
                canEmpty : true,
                replace : false,
                default : ""
            },
            PREFIX : {
                canEmpty : false,
                replace : false,
                default : "/"
            },
            COMMAND : {
                canEmpty : false,
                replace : false,
                default : "cpu"
            }
        }
    },

    "guildData.json" : {
        pass : "./config/guildData.json",
        keys : {
            Admin : {
                canEmpty : true,
                replace : false,
                default : ""
            },
	        sendSystemMessageChannelId : {
                canEmpty : false,
                replace : false,
                default : ""
            },
	        period : {
                canEmpty : false,
                replace : false,
                default : ""
            }
        }
    },
    "channelList.json" : {
        pass : "./config/channelList.json",
        keys : {}
    }
}
