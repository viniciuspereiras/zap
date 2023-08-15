# zap
![alt text](https://github.com/viniciuspereiras/zap/blob/main/assets/banner.png)

[![GitHub issues](https://img.shields.io/github/issues/viniciuspereiras/zap)](https://github.com/viniciuspereiras/zap/issues)
[![GitHub stars](https://img.shields.io/github/stars/viniciuspereiras/zap)](https://github.com/viniciuspereiras/zap/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/viniciuspereiras/zap)](https://github.com/viniciuspereiras/zap/network)

Welcome to ZAP

WhatsApp bot model code that include some nice features:
- Integrated with OpenAI API (GPT models, Dalle, Whisper)
- Possibility to easy integrate with other APIs
- Custom prompts for all usages
- Create and send stickers
- Show view once media (Meta says that this is normal, not a vulnerbaility, a feature xD)
- Recieve deleted for everyone messages on pv

## Start
This bot works using whatsapp-web.js lib that simulate a whatsapp-web application running on a browser with puppteer, this lib takes the login QR code and shows up on terminal screen, so you gonna need scan this QR code on your first run.

To **log-out** you can just delete .wwjs* folders or disconnect a "Chrome (macOS)" device from your device list on WA app.
### bot-config.json
Note that exists a file named `bot-config.json`, in this file you will config the conmmands of the bot linked to functions (switch cases) in the code, if you want to add some function, follow other functions structure and add your config in this file.
#### bot-config.json example
```json
{
    "ping": "ping",
    "gptquestion": "/gpt",
    "sticker": "/sticker",
    "everyone": "@everyone"
    "switch_case": "command_string"
}
```
Note ping command, it points to this part of the code:
```js
case callers.ping:
    printCall(sender_contact, callers.ping)
    await message.reply('pong')
break
```
In this file you can also remove the commands that you dont want.
## Install and config
### Basics
First of all, clone the repository
```
git clone https://github.com/viniciuspereiras/zap
cd zap
```

Now you need to configure your .env file, first change the name:
```
mv .env.example .env
vim .env
```
Now, add your OpenAI keys (required for GPT functions, Dalle, etc), if you dont want to use, just leave in blank and remove OpenAI commands from your bot-config.json.

Put your number in the config (.env) file following the example in the file (obrigatory)
### install packages
```
npm install
```
### install google-chrome-stable
Puppteer for default uses chromium as a browser engine, but chromium does not have the CODECS that WhatsApp uses for send videos and GIFs (included animated stickers), so if you want to send this type of media, consider install google-chrome on your server.
- in ubuntu search on google how to install
- in Arch (I use arch btw) `yay -S google-chrome`

**If you want to not use google chrome:**
```js
// [...]
const client = new Client({
    authStrategy: new LocalAuth(),
    //coment this lines above
    //puppeteer: {
    //    executablePath: '/usr/bin/google-chrome-stable'
    //}
})
// [...]
```
### Fisrt run
Now you have all installed, you can test running
```
node app.js
```
Dont forget to scan the QR code, like you do to connect to a new device on whatsapp-web

When you read in the logs "[+] Ready to go!", its running.

## Running on VPS (background)
I recommend run with pm2 to manage node proccess.

If the bot crashes, pm2 starts up again.
### Install pm2
```
sudo npm install pm2 -g
```
- run:
  ```pm2 start app.js```
For more info consult pm2 docs @ https://pm2.keymetrics.io/
