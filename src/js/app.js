// import { counterRef } from "./refs.js";

import { loadFromLocalStorage, saveToLocalStorage } from "./storage.js";
import getNextID from "./helpers.js";
import { createInterface } from "./generateHTML.js";
import { createTask } from "./generateHTML.js";

const state = [];

const reloadAllTasks = (tasks, comit = true) => {
  document.querySelectorAll(".tasks__item").forEach((t) => t.remove());
  calculateLeftItems(state);

  tasks.forEach((task) => {
    const html = createTask(task, tasks, changeStatus, removeTask);
    document.querySelector(".tasks__list").appendChild(html);
  });
  if (comit) {
    saveToLocalStorage(tasks);
  }
};

const changeStatus = (id, data) => {
  data.forEach((task) => {
    if (task.id == id) {
      task.status = !task.status;
    }
  });
  reloadAllTasks(data);
};

const removeTask = (id, data) => {
  const task = data.filter((t) => t.id === id)[0];
  const task_id = data.indexOf(task);
  data.splice(task_id, 1);

  reloadAllTasks(data);

  calculateLeftItems(state);
};

function calculateLeftItems(data) {
  const notCompleted = data.filter((task) => task.status);
  document.querySelector(
    "#counterTasks"
  ).innerText = `${notCompleted.length} items left`;
}

const handleInput = (evt) => {
  evt.preventDefault();
  if (evt.key === "Enter") {
    const task = {
      title: evt.target.value,
      status: true,
      id: getNextID(state),
    };

    state.push(task);
    reloadAllTasks(state);

    evt.target.value = "";
  }
};

loadFromLocalStorage(state);

document.body.appendChild(
  createInterface(state, handleInput, changeStatus, removeTask, reloadAllTasks)
);
