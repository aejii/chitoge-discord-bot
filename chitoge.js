const {
  Client,
  MessageEmbed
} = require('discord.js')

const bot = new Client()
var request = require('request')
var moment = require('moment')
const extIP = require('external-ip')

var token = require('./token')

var listejeu = ["Tsundere", "Zawse in Love", "False love", "Nisekoi", "Cache cache avec les yakuza", "Juliette dans une piece de théatre", "Être la best waifu"]

function changerJeux() {
  var randomnumber = Math.floor(Math.random() * (listejeu.length - 1))
  bot.user.setActivity(listejeu[randomnumber])
}

setInterval(function () {
  changerJeux()
}, 1000 * 10)

function startColors() {
  setInterval(function () {
    const guild = bot.guilds.resolve("494514173741629451")
    const botRole = guild.roles.resolve("524270192419930113")
    botRole.setColor(Math.floor(Math.random() * 16777215).toString(16));
  }, 1000 * 2)
}

bot.on('ready', function () {
  console.log('bot started')
  bot.user.setActivity('♥ aejii')
})

try {

  bot.on('guildMemberAdd', (member) => {
    try {
      member.guild.channels.get("494514174190288929").send(`Salut beau gosse ${member},
j'espere qu'on va bien s'entendre <3`).then((message) => {});
    } catch (error) {

    }
  });

  bot.on('message', function (message) {
    try {
      if (message.author.bot) {
        return;
      }

      if (message.channel.constructor.name === 'DMChannel') {
        console.log('DM message')
        var args = message.content.split(" ")
        try {//hop la
          if(args[0] === 'say'){
            const channelToSpeak = bot.channels.resolve(args[1])
            channelToSpeak.send(args[2])
          }else{
            message.channel.send('slt bg')
          }
        } catch (error) {
          //not important
        }
        return
      }

      if (message.content.substring(0, 1) === '!') {
        var args = message.content.split(" ")
        console.log('Command detected:' + args[0])
        switch (args[0]) {
          case '!ip':
            if (message.member.hasPermission("MANAGE_GUILD")) {
              let getIP = extIP({
                replace: true,
                services: ['https://ipinfo.io/ip', 'http://ifconfig.io/ip'],
                timeout: 10000,
                getIP: 'parallel',
                userAgent: 'Chrome 15.0.874 / Mac OS X 10.8.1'
              });

              getIP((err, ip) => {
                if (err) {
                  throw err;
                }
                //https://ipinfo.io/ip
                sendMsg(message, `ip : ` + ip)
              })
            } else {
              sendMsg(message, `ptdr t ki`);
            }
            break
          case '!ping':
            var dateee = new Date().getTime() - message.createdTimestamp
            message.channel.send('pong ' + dateee + ' ms')
            break
          default:
            break
        }
        return;
      } else if (/^\*suicide( |$)/i.exec(message.content)) { //https://giphy.com/gifs/season-9-episode-15-bravo-xUA7b4ALChx9x5kJ8c
        /*var embed = new Discord.RichEmbed({});
        embed.setColor(0x00AFFF);
        embed.setImage("https://cdn.discordapp.com/attachments/327039523156656128/451056132182769675/giphy.gif");
        return message.channel.send("", embed);*/
      } else {
        /*var regex = /^(?:\*([^\*]*)\*)|^(?:\*([^ ]+))/;
        var result = regex.exec(message.content);
        if (result) {
          var word = result[1] ? result[1] : result[2];
          var url = `https://api.tenor.com/v1/random?media_filter=minimal&key=PLSS61YOD7KR&limit=1&q=anime%20${encodeURI(word)}`;
          var sendEmbedImage = (image) => {
            var embed = new Discord.RichEmbed({});
            embed.setColor(0x00AFFF);
            embed.setImage(image);
            return message.channel.send("", embed);
          }
          request({
            url: url
          }, function (error, response, body) {
            var result = JSON.parse(body);
            if (result.results && result.results.length > 0) {
              var gif = result.results[0].media[0].mediumgif.url;
              console.log('Gif detected and found', false, message.channel.name, message.member.user.username, message.content, guild);
              sendEmbedImage(gif);
              return;
            }
            var gif = "https://media.tenor.com/images/00631c571898fbaf0b75cedcbaf2135e/tenor.gif";
            console.log('Gif detected and not found', false, message.channel.name, message.member.user.username, message.content, guild);
            sendEmbedImage(gif).then(message => {
              message.delete(1000);
            });

          });
        }*/
      }
    } catch (e) {
      console.error(e.stack, true)
      sendMsg(message, 'Aie..., j\'ai bugger. raku tu fais mal ton boulot! corrige moi ce bug tout de suite!', true)
    }
  });
} catch (e) {
  console.error(e.stack, true)
}

try {
  bot.login(token).then(token => {
    startColors()
    //get channel by id: bot.channels.resolve("579383391338758145")
    //get guilds by id: bot.guilds.resolve("234262067652198400")
  }).catch((e) => {
    console.error(e, true);
  })
  bot.on('error', (err) => {
    console.error(err.stack, true);
  });
} catch (err) {
  console.error(err.stack, true);
}

function sendMsg(message, what, error) {
  const embed = new MessageEmbed()
    .setColor(error ? 0xA80000 : 0x00AFFF)
    .setDescription(what)
    .setFooter(message.author.username + "#" + message.author.discriminator, message.author.avatarURL)
  message.channel.send("", embed)
}