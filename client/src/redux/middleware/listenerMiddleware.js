import { createListenerMiddleware } from "@reduxjs/toolkit";
import {
  setIsAddSubTaskOpen,
  setIsAddTaskOpen,
  setIsAddUserOpen,
  setIsConfirmationDialogOpen,
  setSelectedTaskId,
  setSelectedUserId,
} from "../slices/features/uiSlice.js";

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: setIsAddUserOpen,
  effect: (action, listenerApi) => {
    if (!action.payload) {
      listenerApi.dispatch(setSelectedUserId(null));
    }
  },
});

listenerMiddleware.startListening({
  actionCreator: setIsAddTaskOpen,
  effect: (action, listenerApi) => {
    if (!action.payload) {
      listenerApi.dispatch(setSelectedTaskId(null));
    }
  },
});

listenerMiddleware.startListening({
  actionCreator: setIsAddSubTaskOpen,
  effect: (action, listenerApi) => {
    if (!action.payload) {
      listenerApi.dispatch(setSelectedTaskId(null));
    }
  },
});

listenerMiddleware.startListening({
  actionCreator: setIsConfirmationDialogOpen,
  effect: (action, listenerApi) => {
    if (!action.payload) {
      listenerApi.dispatch(setSelectedTaskId(null));
      listenerApi.dispatch(setSelectedUserId(null));
    }
  },
});

export default listenerMiddleware;
