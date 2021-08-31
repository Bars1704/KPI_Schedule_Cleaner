let whiteList = []

chrome.storage.sync.get(['subjects', 'isEnabled'], function (result) {
    if (!result.isEnabled) return;
    if (result.subjects === undefined) {
        chrome.storage.sync.set({ subjects: [] });
        whiteList = [];
    }
    else {
        whiteList = Array.from(result.subjects)
    }
    const spans = document.querySelectorAll("td>span ").forEach(filterElement);
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        if (key == "subjects") {
            window.location.reload();
        }
        if (key == "isEnabled") {
            window.location.reload();
        }
    }
});


function filterElement(elem) {
    const classes = elem.innerText.split(",");
    const prepods = Array.from(elem.parentElement.querySelectorAll("td>a.plainLink"));

    for (let i = 0; i < classes.length; i++) {
        const className = classes[i].trim();
        if (whiteList.includes(className)) continue;
        classes.splice(i, 1);
        prepods[i].parentElement.removeChild(prepods[i]);
        prepods.splice(i, 1);
        i--;
    }
    if (classes.length == 0)
        removeAllChilds(elem.parentElement);
    else
        elem.innerText = classes.join(",");
}

function removeAllChilds(parent) {
    while (parent.firstChild)
        parent.removeChild(parent.firstChild);
}