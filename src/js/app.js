const inputRef = document.querySelector("#task");
const taskCloneRef = document.querySelector(".clone");
const allTasksRef = document.querySelector(".tasks__list");

const changeStatus = (statusref) => {
  statusref.classList.toggle("task__status--completed");
};

const removeTask = (task) => {
  task.remove();
};

inputRef.addEventListener("keyup", (evt) => {
  evt.preventDefault();
  if (evt.key === "Enter") {
    const taskClone = taskCloneRef.cloneNode(true);

    const taskStatus = taskClone.querySelector(".task__status");
    const taskTitle = taskClone.querySelector(".task__title");
    const taskRemove = taskClone.querySelector(".task__remove");

    taskStatus.addEventListener("click", () => changeStatus(taskStatus));
    taskRemove.addEventListener("click", () => removeTask(taskClone));

    taskTitle.innerText = evt.target.value;

    allTasksRef.appendChild(taskClone);
    taskClone.classList.remove("hidden");
    taskClone.classList.remove("clone");

    evt.target.value = "";
  }
});

const activeBtn = document.querySelector("#activeTasks");

activeBtn.addEventListener("click", () => showOnlyActive());

const showOnlyActive = () => {
  showAll();
  const completedTasks = allTasksRef.querySelectorAll(
    ".task__status--completed"
  );

  completedTasks.forEach((task) => {
    task.parentElement.classList.add("hidden");
  });
};

const allBtn = document.querySelector("#allTasks");
allBtn.addEventListener("click", () => showAll());
const showAll = () => {
  const allTasks = allTasksRef.querySelectorAll(".tasks__item");

  allTasks.forEach((task) => {
    task.classList.remove("hidden");
  });
};

const completedBtn = document.querySelector("#completedTasks");
completedBtn.addEventListener("click", () => showCompleted());
const showCompleted = () => {
  showAll();
  const notCompleted = allTasksRef.querySelectorAll(
    ".task__status:not(.task__status--completed)"
  );
  notCompleted.forEach((task) => {
    task.parentElement.classList.add("hidden");
  });
};
