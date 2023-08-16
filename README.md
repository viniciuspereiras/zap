# zap
```
*          ____ ____ _____ 
|_        /_  // __ `/ __ \
(O) [@@]   / // /_/ / /_/ /
|#|/|__|\ /___\__,_/ .___/  
'-' d  b          /_/  
```
Welcome to ZAP zap zap zap

WhatsApp bot code that include some nice features

## Start
This bot works using whatsapp-web.js lib that simulate a whatsapp-web application running on a browser, this lib takes the login QR code and shows up on terminal screen, so you gonna need scan this QR code on your first run.

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
```

- This repo is not public, so if you have ssh keys config on your github account, go to green clone button, and copy ssh link, if you dont want to do that, just **download the zip** ;)

```
cd zap
```

Now you need to configure your .env file, first change the name:
```
mv .env.example .env
vim .env
```
Now, add your OpenAI keys (required for GPT functions, Dalle), if you dont want to use, just remove the lines on your bot config.

Put your number in the config (.env) file following the example in the file (obrigatory)

### Docker

Build docker image
```
docker build . -t zap-zapbot:latest
```

Now, run the container
```
docker run --name zapbot zap-zapbot:latest
```

Show logs and scan QRCode
```
docker-compose logs -tfn50 zapbot
```
After scanning QRCode you can hit Ctrl-C to return to CLI

NOTE: If you remove container, your session will be lost and you will be asked to scan a new QRCode.

### Docker Compose

Build and start app container
```
docker-compose build
docker-compose up -d
```

Show logs and scan QRCode
```
docker-compose logs -tfn50 zapbot
```
After scanning QRCode you can hit Ctrl-C to return to CLI

NOTE: If you remove container, your session will be lost and you will be asked to scan a new QRCode.


### install npm
```
npm install
```
### install google-chrome-stable
- in ubuntu search on google how to install
- in Arch (I use arch btw) `yay -S google-chrome`

### First run
Now you have all installed, you can test running
```
node app.js
```
Dont forget to scan the QR code, like you do to connect to a new device on whatsapp-web

When you read in the logs something like "ready", its running.

## Running on VPS
Install pm2 first
```
sudo npm install pm2 -g
```
- run:
  ```pm2 start app.js```
For more info consult pm2 docs @ https://pm2.keymetrics.io/
