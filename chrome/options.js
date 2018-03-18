function save_options() {
    let status = document.getElementById('status');

    let path = document.getElementById('path').value;
    if (path === "") {
        status.textContent = "Must provide a path!";
    }
    let name = document.getElementById("name").value;
    if (name === "") {
        name = path.split("\\").pop();
    }
    let els = document.getElementsByClassName("argument");
    let args = [];
    for (let i = 0; i < els.length; i++) {
        let value = els.item(i).value;
        if (value !== "") args.push(value);
    }
    chrome.storage.sync.get({launchers: {}}, function (items) {
        let launchers = items.launchers;
        launchers[name] = {
            path: document.getElementById('path').value,
            arguments: args
        };
        chrome.storage.sync.set({launchers: launchers},
            function () {
                status.textContent = 'Options saved.';
                setTimeout(function () {
                    status.textContent = '';
                }, 750);
            });
    });
}

function restore_options() {
    chrome.storage.sync.get({launchers: {}}, function (items) {
        let options = document.getElementById("names")
        let launcher;
        for (launcher in items.launchers) {
            let opt = document.createElement("OPTION");
            opt.textContent = launcher;
            opt.value = launcher;
            options.appendChild(opt);
        }
    });
}

function fill_launcher() {
    let args = document.getElementById("args");
    while (args.firstChild) {
        args.removeChild(args.firstChild);
    }
    let name = document.getElementById("names").value;
    chrome.storage.sync.get({launchers: {}, lastUsed: ""}, function (items) {
        let launcher = items.launchers[name];
        document.getElementById("name").value = name;
        document.getElementById('path').value = launcher.path;
        launcher.arguments.forEach(function (arg) {
            if (arg !== "") add_argument(arg);
        });
    });
}

function add_argument(value) {
    let root = document.createElement('div');
    let input = document.createElement('input');
    input.style.width = "300px";
    input.type = "text";
    input.className = "argument";
    if (typeof value === "string") {
        input.value = value;
    }
    root.appendChild(input);
    document.getElementById('args').appendChild(root)
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('add').addEventListener('click', add_argument);
document.getElementById("names").addEventListener('change', fill_launcher)