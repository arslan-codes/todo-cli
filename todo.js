#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const yargs = require("yargs");

const todoFilePath = path.join(__dirname, "todos.json"); //storing toods

// Initialize the todos file if it doesn't exist
if (!fs.existsSync(todoFilePath)) {
  fs.writeFileSync(todoFilePath, JSON.stringify([]));
}

// loading todos
function loadTodos() {
  const dataBuffer = fs.readFileSync(todoFilePath);
  const dataJSON = dataBuffer.toString();
  return JSON.parse(dataJSON);
}
//saving todos
function saveTodos(todos) {
  const dataJSON = JSON.stringify(todos, null, 2);
  fs.writeFileSync(todoFilePath, dataJSON);
}

// Add a new todo
yargs.command({
  command: "add",
  describe: "Add a new todo",
  builder: {
    title: {
      describe: "Todo title",
      demandOption: true,
      type: "string",
    },
  },
  handler(argv) {
    const todos = loadTodos();
    const newTodo = {
      title: argv.title,
      done: false,
    };
    todos.push(newTodo);
    saveTodos(todos);
    console.log("New todo added!");
  },
});

// List all todos
yargs.command({
  command: "list",
  describe: "List all todos",
  handler() {
    const todos = loadTodos();
    console.log("Your Todos:");
    todos.forEach((todo, index) => {
      console.log(`${index + 1}. ${todo.title} [${todo.done ? "✓" : " "}]`);
    });
  },
});

// Mark a todo as done
yargs.command({
  command: "done",
  describe: "Mark a todo as done",
  builder: {
    index: {
      describe: "Index of the todo to mark as done",
      demandOption: true,
      type: "number",
    },
  },
  handler(argv) {
    const todos = loadTodos();
    const index = argv.index - 1;

    if (index >= 0 && index < todos.length) {
      todos[index].done = true;
      saveTodos(todos);
      console.log(`Todo ${argv.index} marked as done!`);
    } else {
      console.log("Invalid todo index.");
    }
  },
});

// Delete a todo
yargs.command({
  command: "delete",
  describe: "Delete a todo",
  builder: {
    index: {
      describe: "Index of the todo to delete",
      demandOption: true,
      type: "number",
    },
  },
  handler(argv) {
    const todos = loadTodos();
    const index = argv.index - 1;

    if (index >= 0 && index < todos.length) {
      todos.splice(index, 1);
      saveTodos(todos);
      console.log(`Todo ${argv.index} deleted!`);
    } else {
      console.log("Invalid todo index.");
    }
  },
});

// Parse the arguments
yargs.parse();
