import {
  inputRef,
  filterBtnRef,
  allTasksRef,
  counterRef,
  taskCloneRef,
} from "./refs.js";

import { loadFromLocalStorage, saveToLocalStorage } from "./storage.js";
import getNextID from "./helpers.js";
import { addFilterListener, filterTasks } from "./filters.js";
import { createTag } from "./generateHTML.js";

const state = [];

const reloadAllTasks = (tasks, comit = true) => {
  document.querySelectorAll(".tasks__item").forEach((t) => t.remove());

  tasks.forEach((task) => {
    const html = createTask(task);
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

  // calculateLeftItems(state);
};

const removeTask = (id, data) => {
  const task = data.filter((t) => t.id === id)[0];
  const task_id = data.indexOf(task);
  data.splice(task_id, 1);

  reloadAllTasks(data);

  // calculateLeftItems(state);
};

const calculateLeftItems = (data) => {
  const notCompleted = data.filter((task) => task.status);
  counterRef.innerText = `${notCompleted.length} items left`;
};

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

function createTask({ title, status, id }) {
  const li = createTag({
    tagName: "li",
    className: ["tasks__item", "task"],
  });

  const statusTag = createTag({
    tagName: "span",
    className: status
      ? ["task__status"]
      : ["task__status", "task__status--completed"],
    evt: { type: "click", cb: () => changeStatus(id, state) },
  });
  const titleTag = createTag({
    tagName: "span",
    className: ["task__title"],
    text: title,
  });
  const removeTag = createTag({
    tagName: "span",
    className: ["task__removeIcon"],
    evt: {
      type: "click",
      cb: () => removeTask(id, state),
    },
  });

  li.appendChild(statusTag);
  li.appendChild(titleTag);
  li.appendChild(removeTag);

  return li;
}

const createFilterNav = () => {
  const nav = createTag({
    tagName: "nav",
    className: ["tasks__filter", "filter"],
  });

  const counter = createTag({
    tagName: "span",
    className: ["filter__counter"],
    idName: "counterTasks",
  });

  ["all", "active", "completed"].forEach((item, id) => {
    nav.appendChild(
      createTag({
        tagName: "a",
        className:
          id === 0 ? ["filter__btn", "filter__btn--active"] : ["filter__btn"],
        idName: `${item}Tasks`,
        text: item,
        evt: {
          type: "click",
          cb: (evt) => filterTasks(evt, state, reloadAllTasks),
        },
      })
    );
  });

  nav.appendChild(counter);

  return nav;
};

loadFromLocalStorage(state);

const createInterface = () => {
  const wrapper = createTag({
    className: ["tasks"],
  });
  const label = createTag({
    tagName: "label",
    className: ["tasks__lbl"],
    attrs: [
      {
        name: "for",
        value: "task",
      },
    ],
    text: "Todos",
  });
  const input = createTag({
    tagName: "input",
    className: ["tasks__input"],
    idName: "task",
    attrs: [
      {
        name: "type",
        value: "text",
      },
    ],
    evt: {
      type: "keyup",
      cb: handleInput,
    },
  });

  const list = createTag({
    tagName: "ul",
    className: ["tasks__list"],
  });

  state.forEach((task) => {
    list.appendChild(createTask(task));
  });

  wrapper.appendChild(label);
  wrapper.appendChild(input);
  wrapper.appendChild(list);
  wrapper.appendChild(createFilterNav());

  return wrapper;
};

document.body.appendChild(createInterface());
