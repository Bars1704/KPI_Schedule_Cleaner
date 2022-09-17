window.onload = entry;

let subjects;

function entry() {
    console.log('[index] Entry has been called');
    console.log('[index], inputs root', inputsRoot);

    removeAllChildren(inputsRoot)
    chrome.storage.sync.get(['subjects', 'isEnabled'], function (result) {
        console.log('[index] Storage get has been called', result, enableToggle);

        enableToggle.checked = result.isEnabled;

        if (result.subjects === undefined) {
            chrome.storage.sync.set({ subjects: [] }, entry)
            return;
        }

        subjects = Array.from(result.subjects);
        for (let i = 0; i < subjects.length; i++) {
            createInput(subjects[i], (event) => {
                const value = event.target.value;
                if (value === "") {
                    subjects.splice(i, 1);
                } else {
                    subjects[i] = value;
                }
                chrome.storage.sync.set({ subjects: subjects }, entry);
            })
        }
        createInput("", (event) => {
            subjects.push(event.target.value);
            chrome.storage.sync.set({ subjects: subjects }, entry);
        });
    });

    enableToggle.onclick = async () => {
        console.log('[index] enableToggle onclick')
        await chrome.storage.sync.set({ isEnabled: enableToggle.checked })
    }
}

function removeAllChildren(parent) {
    console.log('[index] remove all children', parent);
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function createInput(inputValue, onChange) {
    console.log('[index] create new input', inputValue);

    let input = document.createElement('input');
    input.value = inputValue;
    input.className = "input-field";
    input.onchange = onChange;
    input.placeholder = 'Мой предмет';
    inputsRoot.appendChild(input)
}


