import fs from 'fs';
import readline from 'readline';

const rl = Readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> ',
});

while(true){
    console.log("1. Add task")
    console.log("2. Update task")
    console.log("3. Delete task")
    console.log("4. List tasks")
    const input = prompt();
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
}

function updateTask() {
    fs.readFile('./bin/tasks/tasks.json', function (err, data) {
        if (err) throw err;
        const jsonData = JSON.parse(data.toString());
        jsonData.todo.splice(index, 1, updatedTask)
        fs.writeFile("./bin/tasks/tasks.json", JSON.stringify(jsonData), 'utf8', (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log("Task updated successfully");
            }
        })
    })
}

function deleteTask(index) {
    fs.readFile('./bin/tasks/tasks.json', function (err, data) {
        if (err) throw err;
        const jsonData = JSON.parse(data.toString());
        jsonData.todo.splice(index, 1)
        fs.writeFile("./bin/tasks/tasks.json", JSON.stringify(jsonData), 'utf8', (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log("Task deleted successfully");
            }
        })
    })
}
