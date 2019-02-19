const Discord = require('discord.js');
const Utils = require('../utils');
 
/*async function play(connection, url) {
    connection.playOpusStream(await ytdl(url));
}*/
module.exports = {
    role: 'MANAGE_GUILD',
    helpCat: 'Permet de quitter le voice chat',
    help: function (message) {
        Utils.sendEmbed(message, 0x00AFFF, "Utilisation de la commande leave", "", message.author, [{
            title: Constants.prefix + 'leave',
            text: "Permet de jouer de la leave",
            grid: false
        }]);
    },
    runCommand: (args, message) => {
        if (message.member.hasPermission("MANAGE_GUILD")) {
            if (message.guild.voiceConnection) {
                message.guild.voiceConnection.disconnect();
            }else{
                Utils.reply(message, `Déso je ne suis pas dans un voice chat`); 
            }
        }else{
           Utils.reply(message, `ptdr t ki`); 
        }
        
    }
}