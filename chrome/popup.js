let tasks = [];

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("launch").addEventListener('click', launch);
    chrome.storage.sync.get({launchers: {}, lastUsed: ""}, function (items) {
        let options = document.getElementById("launchers");
        let launcher;
        for (launcher in items.launchers) {
            let opt = document.createElement("OPTION");
            opt.textContent = launcher;
            opt.value = launcher;
            options.appendChild(opt);
        }
    });
});

chrome.runtime.onMessage.addListener((message) => {
    if (message.request === "task_begin") {
        let html =
            '<li class="list-group-item" style="padding: 0px;">' +
            '<div id="div-'+ message.id +'" class="text-white bg-info">' +
            '    <h4>'+message.tab.title+'</h4>' +
            '    <p>'+ message.tab.url +'</p>' +
            '    <p id=p-"' +message.id +'">Task started...</p>' +
            '</div></li>';
        let temp = document.createElement('div');
        temp.innerHTML = html;
        let ul = document.getElementById("task-list");
        ul.insertBefore(html, ul.firstChild);
    }
    else if(message.request === "message_received"){
        let p = document.getElementById('p-' + message.id);
        p.innerText = message.message;
    }
    else if(message.request === "task_end"){
        let div = document.getElementById('div-' + message.id);
        div.className = "text-white bg-success";

        let p = document.getElementById('p-' + message.id);
        p.innerText = "Task Finished!";
    }
});

function launch() {
    console.log("launching");
    chrome.runtime.sendMessage("", {
        request: "launch",
        launcher: document.getElementById("launchers").value,
    });
}
