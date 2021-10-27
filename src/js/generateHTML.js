import { filterTasks } from "./filters.js";
import { calculateNotCompletedTasks, getState } from "./state.js";

const createTag = ({
  tagName = "div",
  className,
  idName,
  text,
  attrs,
  evt,
}) => {
  const node = document.createElement(tagName);
  if (text !== undefined) {
    const nodeText = document.createTextNode(text);
    node.appendChild(nodeText);
  }

  if (className !== undefined) {
    className.forEach((cls) => {
      node.classList.add(cls);
    });
  }

  if (idName !== undefined) {
    node.id = idName;
  }

  if (attrs !== undefined) {
    attrs.forEach(({ name, value }) => {
      node.setAttribute(name, value);
    });
  }

  if (evt !== undefined) {
    const { type, cb } = evt;
    node.addEventListener(type, cb);
  }

  return node;
};

export function createTask(
  { title, status, id },

  changeStatus,
  removeTask
) {
  const li = createTag({
    tagName: "li",
    className: ["tasks__item", "task"],
  });

  const statusTag = createTag({
    tagName: "span",
    className: status
      ? ["task__status"]
      : ["task__status", "task__status--completed"],
    evt: { type: "click", cb: () => changeStatus(id) },
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
      cb: () => removeTask(id),
    },
  });

  li.appendChild(statusTag);
  li.appendChild(titleTag);
  li.appendChild(removeTag);

  return li;
}

const createFilterNav = (reloadAllTasks) => {
  const nav = createTag({
    tagName: "nav",
    className: ["tasks__filter", "filter"],
  });

  const counter = createTag({
    tagName: "span",
    className: ["filter__counter"],
    idName: "counterTasks",
    text: `${calculateNotCompletedTasks()} left items`,
  });
  nav.appendChild(counter);

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
          cb: (evt) => filterTasks(evt, nav, reloadAllTasks),
        },
      })
    );
  });

  return nav;
};

export const createInterface = (
  handleInput,
  changeStatus,
  removeTask,
  reloadAllTasks
) => {
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

  getState().forEach((task) => {
    list.appendChild(createTask(task, changeStatus, removeTask));
  });

  wrapper.appendChild(label);
  wrapper.appendChild(input);
  wrapper.appendChild(list);
  wrapper.appendChild(createFilterNav(reloadAllTasks));

  return wrapper;
};
