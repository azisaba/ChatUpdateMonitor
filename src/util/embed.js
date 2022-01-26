/*

created by huda0209
ChatUpdateMonitor for discord bot 

ran by node.js

2022-1-24

*/
"use strict"

const Discord = require("discord.js");

exports.info = (content)=>{
    return {embeds: [new Discord.MessageEmbed()
        .setDescription(content)
        .setColor('#06f919')
    ]}
}

exports.error = (content)=>{
    return {embeds: [new Discord.MessageEmbed()
        .setDescription(content)
        .setColor('#f90906')
    ]}
}

exports.infoWithTitle = (title, content)=>{
    return {embeds: [new Discord.MessageEmbed()
        .setTitle(title)
        .setDescription(content)
        .setColor('#06f919')
    ]}
}

exports.errorWithTitle = (title, content)=>{
    return {embeds: [new Discord.MessageEmbed()
        .setTitle(title)
        .setDescription(content)
        .setColor('#f90906')
    ]}
}