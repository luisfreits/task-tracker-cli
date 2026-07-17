import fs from 'fs';
import readline from 'readline';

readline.emitKeypressEvents(process.stdin);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> ',
});

let handleKeyPress;
let menuIndex = 0;

function inputMenu() {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    handleKeyPress = (str, key) => {
        if (key.ctrl && key.name === 'c') {
            process.exit();
        }

        switch (key.name) {
            case 'up':
                if (menuIndex != 0) {
                    menuIndex--;
                    console.clear();
                    showMenu();
                }
                break;
            case 'down':
                if (menuIndex != 3) {
                    menuIndex++;
                    console.clear()
                    showMenu();
                }
                break;
            case 'return':
                switch (menuIndex) {
                    case 0:
                        addTask();
                        break;
                    case 1:
                        updateTask();
                        break;
                    case 2:
                        deleteTask();
                        break;
                    case 3:
                        listTasks();
                        break;
                    default:
                        return;
                        break;
                }
            default:
                return;
                break;
        }
    }
    process.stdin.on('keypress', handleKeyPress);

    showMenu();
}

function showMenu() {
    switch (menuIndex) {
        case 0:
            console.log("[1]. Add task")
            console.log(" 2 . Update task")
            console.log(" 3 . Delete task")
            console.log(" 4 . List tasks")
            break;
        case 1:
            console.log(" 1 . Add task")
            console.log("[2]. Update task")
            console.log(" 3 . Delete task")
            console.log(" 4 . List tasks")
            break;
        case 2:
            console.log(" 1 . Add task")
            console.log(" 2 . Update task")
            console.log("[3]. Delete task")
            console.log(" 4 . List tasks")
            break;
        case 3:
            console.log(" 1 . Add task")
            console.log(" 2 . Update task")
            console.log(" 3 . Delete task")
            console.log("[4]. List tasks")
            break;
    }
}

function addTask() {
    fs.readFile('./bin/tasks/tasks.json', function (err, data) {
        if (err) throw err;
        const jsonData = JSON.parse(data.toString());
        let index = jsonData.length;
        jsonData.push({
            id: index,
            description: "",
            status: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        })
        fs.writeFile("./bin/tasks/tasks.json", JSON.stringify(jsonData), 'utf8', (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log("Task added successfully");
            }
        })
    })
};

function updateTask() {
    fs.readFile('./bin/tasks/tasks.json', function (err, data) {
        if (err) throw err;
        const jsonData = JSON.parse(data.toString());
        jsonData.splice(index, 1, updateContent) //arrumar dps, index/id
        
        fs.writeFile("./bin/tasks/tasks.json", JSON.stringify(jsonData), 'utf8', (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log("Task updated successfully");
            }
        })
    })
};

function deleteTask(index) {
    fs.readFile('./bin/tasks/tasks.json', function (err, data) {
        if (err) throw err;
        const jsonData = JSON.parse(data.toString());
        jsonData.splice(index, 1)
        fs.writeFile("./bin/tasks/tasks.json", JSON.stringify(jsonData), 'utf8', (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log("Task deleted successfully");
            }
        })
    })

};

function listTasks() {
}

inputMenu();