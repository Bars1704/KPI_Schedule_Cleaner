let whitelist = [];

async function main() {
    const state = await chrome.storage.sync.get(['subjects', 'isEnabled']);

    if (!state.isEnabled) {
        return;
    }

    whitelist = state.subjects;

    applyPageEvents();

    chrome.storage.onChanged.addListener((changes, areaName) => {
        console.log('Changed', changes);
        for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
            if (key !== "subjects") {
                continue;
            }

            whitelist = newValue;
        }
    });

    chrome.runtime.onMessage.addListener(async (request, sender) => {
        const state = await chrome.storage.sync.get(['subjects', 'isEnabled']);

        if (!state.isEnabled) {
            return;
        }

        setTimeout(queryAndRemove, 0);
    });
}

const queryAndRemove = () => {
    if (window.location.pathname.includes('lectures')) {
        return;
    }

    const lessons = document.querySelectorAll(SELECTORS_MAP.LESSON.dotted);

    lessons.forEach((lesson) => {
        if (whitelist.includes(lesson.innerText)) {
            return;
        }

        // lesson container
        lesson.parentElement.parentElement.style.display = 'none';

        // cell container
        const cellContainer = lesson.parentElement.parentElement.parentElement;
        cellContainer.style.minHeight = '35px';

        // figure out if some elements are still visible otherwise remove more info button
        let available = false;
        for (const child of cellContainer.children) {

            // if disabled and not info button
            if (child.style.display !== 'none' && !child.classList.contains(SELECTORS_MAP.INFO.normal)) {
                console.log('AVAILABLE', child.style.display, child.className);
                available = true;
                break;
            }

        }

        const infoButton = cellContainer.querySelector(SELECTORS_MAP.INFO.dotted);
        console.log('INFO BUTTON', infoButton, available);
        if (!available && infoButton) {
            infoButton.style.display = 'none';
        }
    });
}

const applyPageEvents = () => {
    window.addEventListener('click', async () => {
        setTimeout(queryAndRemove, 0);
    });
}

main();

//
// sc-bkzYnD - more info class

const SELECTORS_MAP = {
    LESSON: {
        dotted: '.sc-pGacB',
        normal: 'sc-pGacB'
    },
    INFO: {
        dotted: '.sc-bkzYnD',
        normal: 'sc-bkzYnD'
    }
}