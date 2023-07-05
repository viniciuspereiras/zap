const { Client, MessageMedia, LocalAuth } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const colors = require('colors');
const axios = require('axios')
const fs = require('fs');
const { send } = require('process');


require('dotenv').config()

// bot functions
    // OpenAI

const chatGPT = async (clientText) => {
    const headers = {
        'Authorization': `Bearer ${process.env.OPENAI_KEY}`,
        'Content-Type': 'application/json'
    }
    
    const axiosInstance = axios.create({
        baseURL: 'https://api.openai.com/',
        timeout: 120000,
        headers: headers
    });
    const body = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": clientText}],
        "temperature": 0.7,
    }
    try {
        const { data } = await axiosInstance.post('v1/chat/completions', body)
        const botAnswer = data.choices[0].message['content']
        return `\n${botAnswer}`
    } catch (e) {
        return `OpenAI Response Error`
    }
}

const bypassGPT = async (clientText, number_of_attemps, error_word) => {
    let counter = 0
    error_word = error_word.toLowerCase()
    try {
        const response = await chatGPT(clientText)
        printInfo('Trying to bypass GPT')
        console.log(response)
        while (response.toLowerCase().includes(error_word) && counter < number_of_attemps) {
            const response = await chatGPT(clientText)
            counter++
        }
        return response
    } catch (e) {
        return `OpenAI Response Error`
    }
}  

const getDalleResponse = async (clientText) => {
    const headers = {
        'Authorization': `Bearer ${process.env.OPENAI_KEY}`,
        'Content-Type': 'application/json'
    }
    
    const axiosInstance = axios.create({
        baseURL: 'https://api.openai.com/',
        timeout: 120000,
        headers: headers
    });

    const body = {
        prompt: clientText,
        n: 1,
        size: "1024x1024",
    }
    try {
        const { data } = await axiosInstance.post('v1/images/generations', body)
        return data.data[0].url
    } catch (e) {
        return `OpenAI Response Error`
    }
}


// node functions

function printError(message) {
  console.log(colors.red('[*] ' + message));
}

function printInfo(message) {
  console.log(colors.yellow('[!] ' + message));
}

function printSuccess(message) {
  console.log(colors.green('[+] ' + message));
}

function printCall(sender_contact, call) {
  console.log(colors.blue(`[+] ${sender_contact.pushname} used ${call}`));
}

const banner = `
*          ____ ____ _____ 
|_        /_  // __ \`/ __ \\
(O) [@@]   / // /_/ / /_/ /
|#|/|__|\\ /___\\__,_/ .___/  
'-' d  b          /_/      
`
console.log(colors.rainbow(banner))
printInfo('Starting bot...')

// WA start-up

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath: '/usr/bin/google-chrome-stable'
    }
})
printSuccess('Client created')
client.on('qr', qr => {
    printInfo('QR Code received, scan it please')
    qrcode.generate(qr, {small: true})
});

client.on('authenticated', (session) => printSuccess(`Whatsapp authentication success!`))
client.on('ready', () => printSuccess('Ready to go'))
client.on('message_create', message => commands(message))
client.initialize();


let jsonData;
fs.readFile('./bot-config.json', 'utf8', (err, data) => {
  if (err) {
    printError('Error reading config file:', err);
    process.exit(1);
  }
  try {
    jsonData = JSON.parse(data);
    const loaded_callers = Object.keys(jsonData);
    const loaded_callers_values_length = loaded_callers.length;
    printSuccess(`Loaded ${loaded_callers_values_length} callers (${loaded_callers})`);

  } catch (error) {
    printError('Error parsing JSON of config file ', error);
    process.exit(1);
  }
});

printInfo('Starting WhatsApp authentication...')

const commands = async (message) => {
    const callers = jsonData
    if (!message.body.includes(' ')) {
                message.body += ' '
        }

    let caller = await message.body.substring(0, message.body.indexOf(" "))
    let content_after_caller = await message.body.substring(message.body.indexOf(" ") + 1);
    const chat = await message.getChat();
    const message_mentions = await message.getMentions()
    var sender_contact = await message.getContact();
    const quotedMsg = await message.getQuotedMessage();
    const groupChat = await message.getChat();

    switch (caller) {
        case callers.ping:
            printCall(sender_contact, callers.ping)
            await message.reply('pong')
            break

        case callers.gptquestion:
            const gptquestion = content_after_caller;
            printCall(sender_contact, callers.gptquestion)
            chatGPT(gptquestion).then(async (response) => {
                if (response.includes('Erro ao processar a solicitação.')) {
                    printError('GPT resonded with error')
                    message.reply(`${response.replace(/(\r\n|\n|\r)/gm, "").replaceAll('"', '')}`) // remove new lines and double quotes
                }else{
                    printSuccess('GPT resonded OK')
                    message.reply(`${response.replace(/(\r\n|\n|\r)/gm, "").replaceAll('"', '')}`)
                }
            })
            break

        case callers.dalle:
            printCall(sender_contact, callers.dalle)
            const imgDescription = content_after_caller
            getDalleResponse(imgDescription, message).then(async (imgUrl)  => {
                const media = await MessageMedia.fromUrl(imgUrl)
                const options = {
                    media: media,
                    sendMediaAsSticker: false,
                }
                await message.reply(media, null, options)
                printSuccess('DALLE2 responded OK')
            }).catch((error) => {
                printError('DALLE2 responded with error')
                message.reply(`${error}`)
            })
            break

        case callers.sticker:
            printCall(sender_contact, callers.sticker)
            if (quotedMsg && quotedMsg.hasMedia) {
                const media = await quotedMsg.downloadMedia();
                const options = {
                    media: media,
                    sendMediaAsSticker: true, 
                }
                await message.reply(media, null, options)
                printSuccess('STICKER responded OK')
            }
            break

        case callers.everyone:
            printCall(sender_contact, callers.everyone)
            if (groupChat.isGroup && sender_contact.isAdmin) {
                let text = "";
                let mentions = [];
                for(let participant of groupChat.participants) {
                    const contact = await client.getContactById(participant.id._serialized);
                    if (contact.id.user === sender_contact.id.user) continue;
                    mentions.push(contact);
                    text += `@${participant.id.user} `;
                }
                await message.reply(text, null, { mentions });
                printSuccess('everyone responded OK')
            }
        break

}
}
