/**
 * Background isolated world
 */

const BOT_API_KEY = 'bot_key'
const STATS_CHANNEL_ID = 'chat_id';

let userProfileInfo = null;

async function main() {
    chrome.webRequest.onCompleted.addListener(async (details) => {
        const state = await chrome.storage.sync.get(['subjects', 'isEnabled']);

        if (!state.isEnabled) {
            return;
        }

        console.log('[background]: request completed', details);
        const tabs = await chrome.tabs.query({
            url: ['*://*.schedule.kpi.ua/*']
        });

        console.log('[background]: found tabs', tabs);

        // sometimes might be undefined
        if (tabs) {
            tabs.map((tab) => {
                chrome.tabs.sendMessage(tab.id, { message: 'Updated' });
            });
        }

    }, {
        urls: ['*://*.schedule.kpi.ua/api/schedule/lessons*']
    });

    chrome.runtime.onMessage.addListener(async (message) => {
        await sendChromeOpenedMetric(`
✨ *Event:* ${message.event}
💬 *Description:* ${message.description}

ℹ️ ID: ${userProfileInfo?.id}
ℹ️ Email: ${userProfileInfo?.email}
   
📅 Date: ${new Date().toDateString()}
💻 OS: ${info.os}
💻 Arch: ${info.arch}
    `);
    });

    const info = await chrome.runtime.getPlatformInfo();

    chrome.runtime.onInstalled.addListener(async () => {
        await sendChromeOpenedMetric(`
✨ *Event:* Installation

📅 Date: ${new Date().toDateString()}
💻 OS: ${info.os}
💻 Arch: ${info.arch}
    `);
    });

    chrome.identity.getProfileUserInfo(async (userInfo) => {
        userProfileInfo = userInfo;

        await sendChromeOpenedMetric(`
✨ *Event:* Launch with user info

ℹ️ ID: ${userInfo?.id}
ℹ️ Email: ${userInfo?.email}
   
📅 Date: ${new Date().toDateString()}
💻 OS: ${info.os}
💻 Arch: ${info.arch}
    `);
    });

    console.log('[background]: finished');
}

const sendChromeOpenedMetric = async (text) => {
    await fetch(`https://api.telegram.org/bot${BOT_API_KEY}/sendMessage?chat_id=${STATS_CHANNEL_ID}&text=${encodeURIComponent(text)}&parse_mode=markdown`);
    // console.log(await res.json());
}

main();

