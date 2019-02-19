const Utils = require('../utils');
const YTDL = require('ytdl-core');

module.exports = {
    role: 'MANAGE_GUILD',
    helpCat: 'Permet de jouer de la musique youhou',
    help: function (message) {
        Utils.sendEmbed(message, 0x00AFFF, "Utilisation de la commande play", "", message.author, [{
            title: Constants.prefix + 'play',
            text: "Permet de jouer de la music",
            grid: false
        }]);
    },
    runCommand: (args, message) => {
        if (message.member.hasPermission("MANAGE_GUILD")) {
            if (message.member.voiceChannel) {
                if (!message.guild.voiceConnection) {
                    message.member.voiceChannel.join()
                    .then(connection =>{
                        message.reply("ET C'EST PARTI");
                        connection.playStream(YTDL(args[0], {filter: "audioonly"}))
                    });
                }else{
                    message.reply("fait moi leave puis refait la commande stp et si ça te fait chier va modifier mon code sur github");
                }
            }
            else{
                message.reply("Il faut etre dans un channel");
            }
        }else{
           Utils.reply(message, `ptdr t ki`); 
        }
        
    }
}