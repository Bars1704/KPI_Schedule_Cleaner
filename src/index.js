/**
 * Extension DOM world
 */

window.addEventListener('load', main);

async function main() {
    let subjects;

    console.log('[index] Entry has been called');
    console.log('[index], inputs root', inputsRoot);

    removeAllChildren(inputsRoot)
    const state = await chrome.storage.sync.get(['subjects', 'isEnabled']);

    console.log('[index] Storage get has been called', state, enableToggle);

    enableToggle.checked = state.isEnabled;

    if (state.subjects === undefined) {
        await chrome.storage.sync.set({ subjects: [] })
        return;
    }

    subjects = Array.from(state.subjects);
    for (let i = 0; i < subjects.length; i++) {
        createInput(subjects[i], async (event) => {
            const value = event.target.value;
            console.log('[index]: value', value);

            if (value?.trim() === "") {
                subjects.splice(i, 1);
            } else {
                subjects[i] = value;
            }
            await chrome.storage.sync.set({ subjects: subjects });
        })
    }
    createInput("", async (event) => {
        subjects.push(event.target.value);
        await chrome.storage.sync.set({ subjects: subjects }, main);
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