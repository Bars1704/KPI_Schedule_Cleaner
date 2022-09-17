window.onload = entry;

let subjects;

function entry() {
    removeAllChildren(inputsRoot)
    chrome.storage.sync.get(['subjects', 'isEnabled'], function (result) {
        enableToggle.checked = result.isEnabled;

        if (result.subjects === undefined) {
            chrome.storage.sync.set({ subjects: [] }, entry)
            return;
        }

        subjects = Array.from(result.subjects);
        for (let i = 0; i < subjects.length; i++) {
            createInput(subjects[i], (event) => {
                const value = event.target.value;
                if (value === "")
                    subjects.splice(i, 1);
                else
                    subjects[i] = value;
                chrome.storage.sync.set({ subjects: subjects }, entry);
            })
        }
        createInput("", (event) => {
            subjects.push(event.target.value);
            chrome.storage.sync.set({ subjects: subjects }, entry);
        })

    });

    enableToggle.onclick = async () => {
        await chrome.storage.sync.set({ isEnabled: enableToggle.checked })
    }
}

function removeAllChildren(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function createInput(inputValue, onChange) {
    let input = document.createElement('input');
    input.value = inputValue;
    input.className = "inputField";
    input.onchange = onChange;
    inputsRoot.appendChild(input)
}


