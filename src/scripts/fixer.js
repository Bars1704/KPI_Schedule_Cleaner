let whiteList = []

chrome.storage.sync.get(['subjects', 'isEnabled'], async function (result) {
    console.log('[Fixer] Getting info from storage', result);
    if (!result.isEnabled) {
        return;
    }
    if (result.subjects === undefined) {
        console.log('[fixer] subjects are undefined')
        await chrome.storage.sync.set({ subjects: [] });
        whiteList = [];
    } else {
        console.log('[fixer] whitelist has been set');
        whiteList = Array.from(result.subjects)
    }
    const spans = document.querySelectorAll(HOST_TO_ORIGIN_MAP[window.location.host]);
    console.log('[fixer] found spans', spans);

    spans.forEach(filterElement)
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    console.log('[Fixer] Key has changed in storage', changes);

    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        if (key === "subjects") {
            window.location.reload();
        }
        if (key === "isEnabled") {
            window.location.reload();
        }
    }
});

function filterElement(elem) {
    console.log('[Fixer] filter element', elem);

    const classes = elem.innerText.split(",");
    const teachers = Array.from(elem.parentElement.querySelectorAll("td>a.plainLink"));

    console.log('[fixer] Classes', classes);
    console.log('[fixer] Teachers', teachers);

    for (let i = 0; i < classes.length; i++) {
        const className = classes[i].trim();
        if (whiteList.includes(className)) {
            continue;
        }
        classes.splice(i, 1);
        teachers[i].parentElement.removeChild(teachers[i]);
        teachers.splice(i, 1);
        i--;
    }

    if (classes.length === 0) {
        removeAllChildren(elem.parentElement);
    } else {
        elem.innerText = classes.join(",");
    }
}

function removeAllChildren(parent) {
    console.log('[fixer] Remove all children', parent);

    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

const HOST_TO_ORIGIN_MAP = {
    'epi.kpi.ua': 'td > span.disLabel',

}