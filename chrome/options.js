function save_options() {
    var els = document.getElementsByClassName("argument");
    var args = [];
    for(var i=0; i< els.length; i++){
        var value = els.item(i).value;
        if(value !== "") args.push(value);
    }
    chrome.storage.sync.set({
        path: document.getElementById('path').value,
        arguments: args
    }, function () {
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

function restore_options() {
    chrome.storage.sync.get({path: "", arguments: []}, function (items) {
        document.getElementById('path').value = items.path;
        items.arguments.forEach(function(arg){
            if(arg !== "") add_argument(arg);
        })
    });
}

function add_argument(value) {
    var root = document.createElement('div');
    var input = document.createElement('input');
    input.style.width = "300px";
    input.type = "text";
    input.className = "argument";
    if(typeof value === "string"){
        input.value = value;
    }
    root.appendChild(input);
    document.getElementById('args').appendChild(root)
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('add').addEventListener('click', add_argument);