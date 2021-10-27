import { getState } from "./state.js";

const getNextID = () => {
  const state = getState();
  if (state.length === 0) {
    return 1;
  }

  return state[state.length - 1].id + 1;
};

export default getNextID;
