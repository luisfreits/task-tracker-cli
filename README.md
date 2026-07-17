# Task Tracker CLI

Um gerenciador de tarefas interativo via linha de comando (CLI) desenvolvido nativamente em Node.js. O projeto conta com um menu customizado navegável pelas setas do teclado e persistência de dados local em um arquivo JSON.

## Funcionalidades

* **Adicionar tarefa:** Cria uma nova tarefa com o status inicial `todo`.
* **Atualizar tarefa:** Modifica a descrição ou o status (`todo`, `in-progress`, `done`) através de um submenu interativo.
* **Deletar tarefa:** Remove permanentemente uma tarefa buscando pelo seu ID.
* **Listar tarefas:** Exibe as tarefas cadastradas, permitindo filtrar por status.

## Estrutura de Diretórios

O projeto segue uma arquitetura simples separando o código-fonte dos dados do usuário:

```text
task-tracker/
 ├── data/
 │    └── tasks.json      # Banco de dados gerado automaticamente
 ├── src/
 │    └── index.js        # Código-fonte principal da aplicação CLI
 ├── .gitignore
 ├── package.json
 └── README.md

```

## Como executar

**Pré-requisito:** É necessário ter o [Node.js](https://nodejs.org/) instalado na sua máquina.

1. Clone o repositório para o seu computador.
2. Abra o terminal e navegue até a pasta raiz do projeto:
```bash
cd task-tracker

```


3. Inicie a aplicação executando o arquivo principal:
```bash
node src/index.js

```


4. Utilize as **setas do teclado** para navegar pelos menus e **Enter** para selecionar.