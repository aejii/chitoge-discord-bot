const Discord = require('discord.js');
const bot = new Discord.Client();
const Utils = require('./utils');
var request = require('request');
var moment = require('moment');

var token = require('./token');

var globalConst = require('./models/constants');

globalConst.init();

var pingCommand = require('./commandes/ping');
var configCommands = require('./commandes/config');
var ipCommands = require('./commandes/ip');
var musicCommands = require('./commandes/music');
var leaveCommands = require('./commandes/leave');

var commands = {
  config: configCommands,
  ping: pingCommand,
  ip: ipCommands,
  play: musicCommands,
  leave: leaveCommands
}

var listejeu = ["Tsundere","Zawse in Love","False love","Nisekoi","Cache cache avec les yakuza","Juliette dans une piece de théatre","Être la best waifu"];

function changerJeux() {
  var randomnumber = Math.floor(Math.random() * (listejeu.length-1));
  bot.user.setActivity(listejeu[randomnumber]);
}

setInterval(function(){
  //Utils.log(`actu jeux${Utils.Color.FgYellow}${Utils.Color.Reset}`);
  //changerJeux();
},1000*10);

function startColors() {
  setInterval(function(){
    //var chitogue = guild.roles.find("name", "Best Waifu");
    //chitogue.setColor(Math.floor(Math.random()*16777215).toString(16));
  },1000*5);
}

try {
  bot.on('ready', function () {
    Utils.log(Utils.Color.FgGreen + 'bot started');
    bot.user.setActivity('♥ aejii');
  });
} catch (e) {
  Utils.log(e.stack, true);
}
try {

  bot.on('messageReactionAdd', function (messageReaction, user) {
    if (user.bot) {
      return;
    }
    var reactInteraction = interactions.getReactInteraction(messageReaction.message.id);
    if (reactInteraction) {
      var command = eval(reactInteraction.command + 'Command');
      if (reactInteraction.additionalArg) {
        command[reactInteraction.functionToCall](messageReaction, user, ...reactInteraction.additionalArg);
        return;
      }
      command[reactInteraction.functionToCall](messageReaction, user);
    } else {
      reactInteraction = interactions.getReactInteraction(user.id);
      if (reactInteraction) {
        var command = eval(reactInteraction.command + 'Command');
        if (reactInteraction.additionalArg) {
          command[reactInteraction.functionToCall](messageReaction, user, ...reactInteraction.additionalArg);
          return;
        }
        command[reactInteraction.functionToCall](messageReaction, user);
      }
    }
  });



  bot.on("guildMemberRemove", (member) => {
    var joinAT = moment(member.joinedAt);
    var now = moment();
    var diff = Math.abs(now.diff(joinAT, 'minutes'));
    moment.locale('fr');
    member.guild.channels.get("494514174190288929").send(`${member} (${member.user.username}) nous a quitté, il a été avec nous pendant `+ moment.duration(diff, 'minutes').humanize() );

  });

  bot.on('guildMemberAdd', (member) => {

    member.guild.channels.get("494514174190288929").send(`Salut beau gosse ${member},
j'espere qu'on va bien s'entendre <3`).then((message) => {
                
            });
  });

  var runCommand = (args, message) => {
    if (args[0] === globalConst.prefix + 'help') {
      Utils.log(`running ${Utils.Color.FgYellow}help ${Utils.Color.Reset}command`);
      if (args.length > 1) {
        if (commands[args[1]] && message.member.hasPermission(commands[args[1]].role)) {
          commands[args[1]].help(message);
          return;
        }
        Utils.reply(message, `Aucune commande du nom de **${args[1]}**.`, true)
        return;
      }
      var keys = Object.keys(commands);
      var fields = [];
      keys.forEach((command) => {
        if (message.member.hasPermission(commands[command].role)) {
          fields.push({
            text: commands[command].helpCat,
            title: command,
            grid: false
          });
        }
      });
      Utils.sendEmbed(message, 0x00AFFF, 'Liste des commandes', "Pour plus d'info sur une commandes faites **" + globalConst.prefix + "help [commande]**", message.author, fields);
      return;
    }
    args[0] = args[0].replace(globalConst.prefix, '');
    if (commands[args[0]]) {
      var label = args[0];
      Utils.log(`running ${Utils.Color.FgYellow}${label} ${Utils.Color.Reset}command`);
      args.shift();
      commands[label].runCommand(args, message);
      return;
    }
  }

  bot.on('message', function (message) {
    try {
      if (message.author.bot) {
        return;
      }
      
      
      if (message.channel.constructor.name === 'DMChannel') {
        Utils.log('', false, 'DM message', message.author.username, message.content);
        var result = /^say ([0-9]+) (.+)$/.exec(message.content);
        if (result) {
          if (!guild.members.get(message.author.id).hasPermission("MANAGE_GUILD")) {
            Utils.reply(message, 'ptdr t ki ?', true);
            return;
          }
          var channel = guild.channels.get(result[1]);
          if (!channel) {
            Utils.reply(message, 'c\'est pas un channel ça', true);
            return;
          }
          channel.send(result[2]);
        } else {
          var chatInteraction = interactions.getChatInteraction(message.author.id, null);
          if (chatInteraction) {
            var command = eval(chatInteraction.command + 'Command');
            if (chatInteraction.additionalArg) {
              command[chatInteraction.functionToCall](message, ...chatInteraction.additionalArg);
              return;
            }
            command[chatInteraction.functionToCall](message);
          } else {
          }
        }
        if (message.content.substr(0, globalConst.prefix.length) === globalConst.prefix) {
          Utils.sendDM(message.author, `Désolé mais c'est pas encore possible d'utiliser les commandes en mp.
C'est une fonctionalitée qui est prévu, mais comme il y a d'autre prioritée et bah ça n'a pas encore été dev.
après tu peu toujours le dev toi même si tu veux, vue que le code est open source.
mais bon entre nous même si tu est timide personne ne t'en voudra si tu fait ${message.content} dans le channel de bot ;)`, true);
        }
        return;
      }

      if(globalConst.guildID == ""){
        if(message.content.startsWith(globalConst.prefix+"config guildID") || message.content.startsWith(globalConst.prefix+"config prefix")){

        }else{
          Utils.reply(message, 'Administrateur !!!!! veuillez me configuez _config guildID [id], attention pas le droit à l\'erreur.', true);
          return;
        }
        
      }else {
        if (globalConst.guildID != message.guild.id && globalConst.guildID != "") {
            Utils.reply(message, "Attention une seul instance par serveur, veuillez contacter aejii#1262 et me kicker, ou je détruit ce serveur mouahahahahaha.", true);
            return;
        }
      }
      
      if (message.content.substring(0, globalConst.prefix.length) === globalConst.prefix) {
        var args = message.content.split(" ");
        Utils.log('Command detected', false, message.channel.name, message.author.username, message.content);
        Utils.log(`fetching for ${Utils.Color.FgYellow}${message.author.username}${Utils.Color.Reset}`);
        message.channel.guild.fetchMember(message.author.id).then(member => {
          message.member = member
          runCommand(args, message);
        }).catch((e) => {
          Utils.log(e.stack, true);
        });
        return;
      } else if (/^\*suicide( |$)/i.exec(message.content)) {//https://giphy.com/gifs/season-9-episode-15-bravo-xUA7b4ALChx9x5kJ8c
        var embed = new Discord.RichEmbed({});
        embed.setColor(0x00AFFF);
        embed.setImage("https://cdn.discordapp.com/attachments/327039523156656128/451056132182769675/giphy.gif");
        return message.channel.send("", embed);
      } else {
        var regex = /^(?:\*([^\*]*)\*)|^(?:\*([^ ]+))/;
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
              Utils.log('Gif detected and found', false, message.channel.name, message.member.user.username, message.content, guild);
              sendEmbedImage(gif);
              return;
            }
            var gif = "https://media.tenor.com/images/00631c571898fbaf0b75cedcbaf2135e/tenor.gif";
            Utils.log('Gif detected and not found', false, message.channel.name, message.member.user.username, message.content, guild);
            sendEmbedImage(gif).then(message => {
              message.delete(1000);
            });

          });
        }
      }
    } catch (e) {
      Utils.log(e.stack, true);
      Utils.reply(message, 'Aie..., j\'ai bugger. raku tu fait mal ton boulot! corrige moi ce bug tout de suite!', true)
    }
  });
} catch (e) {
  Utils.log(e.stack, true)
}

try {
  var guild = null;
  bot.login(token).then(token => {
    guild = bot.guilds.first();
    startColors() ;
  }).catch((e) => {
    Utils.log(e, true);
  })
  bot.on('error', (err) => {
    Utils.log(err.stack, true);
  });
} catch (err) {
  Utils.log(err.stack, true);
}

