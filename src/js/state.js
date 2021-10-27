export const state = [];

export const add = ({ title, status, id }) => {
  if (typeof title === "string" && title.length > 0) {
    state.push({
      title,
      status,
      id,
    });
  } else {
    console.log(`wrong task signature: ${(title, status, id)}`);
  }
};

export const remove = (id) => {
  const item = state.filter((task) => task.id === id);
  if (item.length === 1) {
    const item_id = state.indexOf(item[0]);
    state.splice(item_id, 1);
  } else {
    console.log(`item not found ${id}`);
  }
};

export const changeStatus = (id) => {
  state.forEach((task) => {
    if (task.id == id) {
      task.status = !task.status;
    }
  });
};

export const calculateNotCompletedTasks = () =>
  state.filter((item) => item.status).length;

export const getState = () => state;

export const getNotCompletedTasks = () => state.filter((item) => item.status);
export const getCompletedTasks = () => state.filter((item) => !item.status);
