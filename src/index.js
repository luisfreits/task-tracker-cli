import fs from 'fs';
import readline from 'readline';
import path from 'path';

readline.emitKeypressEvents(process.stdin);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> ',
});

const FILE_PATH = './data/tasks.json';
 
let handleKeyPress;
let menuScreen = true;
let menuIndex = 0;

const MAIN_MENU_OPTIONS = [
    "Add task",
    "Update task",
    "Delete task",
    "List tasks"
];

const LIST_MENU_OPTIONS = [
    "List all tasks",
    "List all tasks that are done",
    "List all tasks that are not done",
    "List all tasks that are todo"
];

const UPDATE_MENU_OPTIONS = [
    "Editar Descricao",
    "Editar Status"
];

const STATUS_OPTIONS = [
    "todo",
    "in-progress",
    "done"
];

function readTasks() {
    try {
        if (!fs.existsSync(FILE_PATH)) return [];
        const data = fs.readFileSync(FILE_PATH, 'utf8');
        return JSON.parse(data || '[]');
    } catch (err) {
        console.error("Erro ao ler arquivo:", err.message);
        return [];
    }
}

function writeTasks(data) {
    try {
        const dir = path.dirname(FILE_PATH);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error("Erro ao salvar arquivo:", err.message);
    }
}

function renderMenu(options, activeIndex) {
    console.clear();
    options.forEach((option, idx) => {
        if (idx === activeIndex) {
            console.log(`[${idx + 1}]. ${option}`);
        } else {
            console.log(` ${idx + 1} . ${option}`);
        }
    });
}

function showMenu() {
    if (menuScreen) {
        renderMenu(MAIN_MENU_OPTIONS, menuIndex);
    } else {
        renderMenu(LIST_MENU_OPTIONS, menuIndex);
    }
}

function pauseRawMode() {
    process.stdin.removeListener('keypress', handleKeyPress);
    process.stdin.setRawMode(false);
}

function resumeRawMode() {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('keypress', handleKeyPress);
    showMenu();
}

function waitEnter(callback) {
    rl.question("\nPressione Enter para continuar...", () => {
        callback();
    });
}

function inputMenu() {
    process.stdin.setRawMode(true);
    process.stdin.resume();

    handleKeyPress = (str, key) => {
        if (key.ctrl && key.name === 'c') {
            process.exit();
        }

        const currentOptions = menuScreen ? MAIN_MENU_OPTIONS : LIST_MENU_OPTIONS;

        switch (key.name) {
            case 'up':
                if (menuIndex > 0) {
                    menuIndex--;
                    showMenu();
                }
                break;
            case 'down':
                if (menuIndex < currentOptions.length - 1) {
                    menuIndex++;
                    showMenu();
                }
                break;
            case 'return':
                if (menuScreen) {
                    menuScreenAction();
                } else {
                    listScreenAction();
                }
                break;
        }
    };

    process.stdin.on('keypress', handleKeyPress);
    showMenu();
}

function menuScreenAction() {
    switch (menuIndex) {
        case 0: addTask(); break;
        case 1: updateTask(); break;
        case 2: deleteTask(); break;
        case 3: 
            menuScreen = false; 
            menuIndex = 0; 
            showMenu(); 
            break;
    }
}

function listScreenAction() {
    const tasks = readTasks();
    console.clear();

    let filteredTasks = [];
    switch (menuIndex) {
        case 0: filteredTasks = tasks; break;
        case 1: filteredTasks = tasks.filter(t => t.status === 'done'); break;
        case 2: filteredTasks = tasks.filter(t => t.status !== 'done'); break;
        case 3: filteredTasks = tasks.filter(t => t.status === 'todo'); break;
    }

    if (filteredTasks.length === 0) {
        console.log("Nenhuma tarefa encontrada.");
    } else {
        filteredTasks.forEach(task => console.log(task));
    }

    pauseRawMode();
    waitEnter(() => {
        menuScreen = true;
        menuIndex = 0;
        resumeRawMode();
    });
}

function addTask() {
    pauseRawMode();
    rl.question("Descreva a tarefa: ", (description) => {
        const jsonData = readTasks();
        const nextId = jsonData.length > 0 ? Math.max(...jsonData.map(t => t.id)) + 1 : 0;

        jsonData.push({
            id: nextId,
            description,
            status: "todo",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        writeTasks(jsonData);
        console.log("Tarefa adicionada com sucesso!");
        
        waitEnter(() => resumeRawMode());
    });
}

function updateTask() {
    pauseRawMode();
    rl.question("ID da tarefa para atualizar: ", (idInput) => {
        const targetId = parseInt(idInput, 10);
        const jsonData = readTasks();
        const task = jsonData.find(t => t.id === targetId);

        if (!task) {
            console.log("Tarefa não encontrada.");
            waitEnter(() => resumeRawMode());
            return;
        }

        let updateIndex = 0;
        process.stdin.setRawMode(true);
        process.stdin.resume();

        renderMenu(UPDATE_MENU_OPTIONS, updateIndex);

        const handleUpdateMenu = (str, key) => {
            if (key.ctrl && key.name === 'c') process.exit();

            switch (key.name) {
                case 'up':
                    if (updateIndex > 0) {
                        updateIndex--;
                        renderMenu(UPDATE_MENU_OPTIONS, updateIndex);
                    }
                    break;
                case 'down':
                    if (updateIndex < UPDATE_MENU_OPTIONS.length - 1) {
                        updateIndex++;
                        renderMenu(UPDATE_MENU_OPTIONS, updateIndex);
                    }
                    break;
                case 'return':
                    process.stdin.removeListener('keypress', handleUpdateMenu);
                    process.stdin.setRawMode(false);
                    
                    if (updateIndex === 0) {
                        rl.question("Nova descrição da tarefa: ", (description) => {
                            task.description = description;
                            task.updatedAt = new Date().toISOString();
                            writeTasks(jsonData);
                            console.log("Tarefa atualizada com sucesso!");
                            waitEnter(() => resumeRawMode());
                        });
                    } else if (updateIndex === 1) {
                        let statusIndex = 0;
                        process.stdin.setRawMode(true);
                        process.stdin.resume();
                        renderMenu(STATUS_OPTIONS, statusIndex);

                        const handleStatusMenu = (strStatus, keyStatus) => {
                            if (keyStatus.ctrl && keyStatus.name === 'c') process.exit();

                            switch (keyStatus.name) {
                                case 'up':
                                    if (statusIndex > 0) {
                                        statusIndex--;
                                        renderMenu(STATUS_OPTIONS, statusIndex);
                                    }
                                    break;
                                case 'down':
                                    if (statusIndex < STATUS_OPTIONS.length - 1) {
                                        statusIndex++;
                                        renderMenu(STATUS_OPTIONS, statusIndex);
                                    }
                                    break;
                                case 'return':
                                    process.stdin.removeListener('keypress', handleStatusMenu);
                                    process.stdin.setRawMode(false);
                                    
                                    task.status = STATUS_OPTIONS[statusIndex];
                                    task.updatedAt = new Date().toISOString();
                                    writeTasks(jsonData);
                                    console.log("Status atualizado com sucesso!");
                                    waitEnter(() => resumeRawMode());
                                    break;
                            }
                        };
                        process.stdin.on('keypress', handleStatusMenu);
                    }
                    break;
            }
        };

        process.stdin.on('keypress', handleUpdateMenu);
    });
}

function deleteTask() {
    pauseRawMode();
    rl.question("ID da tarefa para deletar: ", (idInput) => {
        const targetId = parseInt(idInput, 10);
        const jsonData = readTasks();
        const updatedData = jsonData.filter(t => t.id !== targetId);

        if (jsonData.length === updatedData.length) {
            console.log("Tarefa não encontrada.");
        } else {
            writeTasks(updatedData);
            console.log("Tarefa deletada com sucesso!");
        }

        waitEnter(() => resumeRawMode());
    });
}

inputMenu();