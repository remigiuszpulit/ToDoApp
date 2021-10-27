// import { counterRef } from "./refs.js";

import { loadFromLocalStorage, saveToLocalStorage } from "./storage.js";
import getNextID from "./helpers.js";
import { createInterface } from "./generateHTML.js";
import { createTask } from "./generateHTML.js";
import { getState } from "./state.js";
import {
  add as add_to_state,
  remove as remove_from_state,
  changeStatus as changeStatusState,
  calculateNotCompletedTasks,
} from "./state.js";

const reloadAllTasks = (tasks = getState(), comit = true) => {
  document.querySelectorAll(".tasks__item").forEach((t) => t.remove());
  calculateLeftItems(getState());

  tasks.forEach((task) => {
    const html = createTask(task, changeStatus, removeTask);
    document.querySelector(".tasks__list").appendChild(html);
  });
  if (comit) {
    saveToLocalStorage();
  }
};

const changeStatus = (id) => {
  changeStatusState(id);
  reloadAllTasks();
};

const removeTask = (id) => {
  remove_from_state(id);

  reloadAllTasks();

  calculateLeftItems();
};

function calculateLeftItems() {
  document.querySelector(
    "#counterTasks"
  ).innerText = `${calculateNotCompletedTasks()} items left`;
}

const handleInput = (evt) => {
  evt.preventDefault();
  if (evt.key === "Enter") {
    const task = {
      title: evt.target.value,
      status: true,
      id: getNextID(getState()),
    };

    add_to_state(task);
    reloadAllTasks();

    evt.target.value = "";
  }
};

loadFromLocalStorage();

document.body.appendChild(
  createInterface(handleInput, changeStatus, removeTask, reloadAllTasks)
);
