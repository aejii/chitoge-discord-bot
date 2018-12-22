const Discord = require('discord.js');
const Utils = require('../utils');
const extIP = require('external-ip');

module.exports = {
    role: 'MANAGE_GUILD',
    helpCat: 'Permet de connaitre l\'ip du bot :P',
    help: function (message) {
        Utils.sendEmbed(message, 0x00AFFF, "Utilisation de la commande ip", "", message.author, [{
            title: Constants.prefix + 'ip',
            text: "Permet de connaitre l\'ip du bot",
            grid: false
        }]);
    },
    runCommand: (args, message) => {
        if (message.member.hasPermission("MANAGE_GUILD")) {
            let getIP = extIP({
                replace: true,
                services: ['https://ipinfo.io/ip', 'http://ifconfig.io/ip'],
                timeout: 600,
                getIP: 'parallel',
                userAgent: 'Chrome 15.0.874 / Mac OS X 10.8.1'
            });
         
            getIP((err, ip) => {
                if (err) {
                    throw err;
                }
                console.log("Mon ip public est "+ip);
                Utils.reply(message, `ip : `+ip);
            });
        }else{
           Utils.reply(message, `ptdr t ki`); 
        }
        
    }
}