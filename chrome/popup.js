
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("launch").addEventListener('click', launch);
    chrome.storage.sync.get({launchers: {}, lastUsed: "", tasks: ""}, function (items) {
        let options = document.getElementById("launchers");
        let launcher;
        for (launcher in items.launchers) {
            let opt = document.createElement("option");
            opt.textContent = launcher;
            opt.value = launcher;
            if (launcher === items.lastUsed) {
                opt.selected = true;
            }
            options.appendChild(opt);
        }
        chrome.storage.local.get({tasks: {}}, function (local) {
            console.log(local);
            for (key in local.tasks) {
                create_task(local.tasks[key]);
            }
        })
    });

});

function create_task(task) {
    let classes =  task.finished ? "text-white bg-success" : "text-white bg-info";

    let html =
        '<li class="list-group-item" style="padding: 0px;">' +
        '<div id="div-' + task.id + '" class="'+ classes +'">' +
        '    <p>' + task.title + '</p>' +
        '    <p>' + task.url + '</p>' +
        '    <p id="p-' + task.id + '">' + task.last_message + '</p>' +
        '</div></li>';
    let temp = document.createElement('div');
    temp.innerHTML = html;
    let ul = document.getElementById("task-list");
    ul.insertBefore(temp.firstChild, ul.firstChild);
}

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local") {
        if ("tasks" in changes) {
            chrome.storage.local.get('last_updated_task', function(item){
                let id = item.last_updated_task;
                let task = changes["tasks"].newValue[id];
                if(document.getElementById('div-' + id) === null){
                    create_task(task);
                }
                let p = document.getElementById('p-' + id);
                p.innerHTML = task.last_message;

                if (task.finished) {
                    let div = document.getElementById('div-' + task.id);
                    div.className = "text-white bg-success";
                }
            });
        }
    }
});

/*
chrome.runtime.onMessage.addListener((message) => {
    if (message.request === "task_begin") {
        let html =
            '<li class="list-group-item" style="padding: 0px;">' +
            '<div id="div-' + message.id + '" class="text-white bg-info">' +
            '    <h4>' + message.tab.title + '</h4>' +
            '    <p>' + message.tab.url + '</p>' +
            '    <p id=p-"' + message.id + '">Task started...</p>' +
            '</div></li>';
        let temp = document.createElement('div');
        temp.innerHTML = html;
        let ul = document.getElementById("task-list");
        ul.insertBefore(temp.firstChild, ul.firstChild);
    }
    else if (message.request === "message_received") {
        let p = document.getElementById('p-' + message.id);
        p.innerText = message.message;
    }
    else if (message.request === "task_end") {
        let div = document.getElementById('div-' + message.id);
        div.className = "text-white bg-success";

        let p = document.getElementById('p-' + message.id);
        p.innerHTML = "Task Finished!";
    }
});
*/
function launch() {
    console.log("launching");
    chrome.runtime.sendMessage("", {
        request: "launch",
        launcher: document.getElementById("launchers").value,
    });
}
