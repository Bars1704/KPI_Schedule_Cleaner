/**
 * Background isolated world
 */

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

console.log('[background]: finished');