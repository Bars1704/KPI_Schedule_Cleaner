/**
 * Isolated world
 */

let whiteList = []

/**
 * Gets executed on page load
 * @returns {Promise<void>}
 */
async function main() {
    const host = window.location.host;

    // console.log('[fixer] Document state: ', document.readyState);
    const state = await chrome.storage.sync.get(['subjects', 'isEnabled']);
    // console.log('[fixer] Getting info from storage', state);
    if (!state.isEnabled) {
        return;
    }

    if (!state.subjects) {
        // console.log('[fixer] subjects are not defined')
        await chrome.storage.sync.set({ subjects: [] });
        whiteList = [];
    } else {
        // console.log('[fixer] whitelist has been set from subjects');
        whiteList = Array.from(state.subjects)
    }

    // console.log('[fixer] host', host);
    const cellsToVerify = document.querySelectorAll('td > span.disLabel');

    // console.log('[fixer] found elements', cellsToVerify);
    cellsToVerify.forEach(oldScheduleFilter)

    chrome.storage.onChanged.addListener((changes, namespace) => {
        // console.log('[Fixer] Key has changed in storage', changes);

        for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
            if (key === "subjects") {
                window.location.reload();
            }
            if (key === "isEnabled") {
                window.location.reload();
            }
        }
    });
}

/**
 * Receives td element with span.disLabel inside
 * @param elem
 */
function oldScheduleFilter(elem) {
    // console.log('[Fixer] filter element', elem);

    const cellSubjectNames = elem.innerText.split(",");
    const teachers = Array.from(elem.parentElement.querySelectorAll("td > a.plainLink"));

    // console.log('[fixer] Classes', cellSubjectNames);
    // console.log('[fixer] Teachers', teachers);

    for (let i = 0; i < cellSubjectNames.length; i++) {
        const subjectName = cellSubjectNames[i].trim();
        if (whiteList.includes(subjectName)) {
            continue;
        }
        cellSubjectNames.splice(i, 1);
        teachers[i].parentElement.removeChild(teachers[i]);
        teachers.splice(i, 1);
        i--;
    }

    if (cellSubjectNames.length === 0) {
        removeAllChildren(elem.parentElement);
    } else {
        elem.innerText = cellSubjectNames.join(",");
    }
}

function removeAllChildren(parent) {
    console.log('[fixer] Remove all children', parent);

    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

window.addEventListener('load', main);