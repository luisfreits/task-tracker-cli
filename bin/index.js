import fs from 'fs';

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
        jsonData.todo.splice(2, 2, "node")
        fs.writeFile("./bin/tasks/tasks.json", JSON.stringify(jsonData), 'utf8', (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log("Task added successfully");
            }
        })
    })
}
/*
function deleteTask() {
    fs.readFile('./bin/tasks/tasks.json', function (err, data) {
        if (err) throw err;
        const jsonData = JSON.parse(data.toString());
        jsonData.todo.splice(2, 2)
        fs.writeFile("./bin/tasks/tasks.json", JSON.stringify(jsonData), 'utf8', (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log("Task added successfully");
            }
        })
    })
}*/
addTask();