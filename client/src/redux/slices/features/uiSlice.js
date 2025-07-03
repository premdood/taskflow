import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchText: "",
  isSidebarOpen: false,
  selectedUserId: null,
  isAddUserOpen: false,
  selectedTaskId: null,
  isAddTaskOpen: false,
  isAddSubTaskOpen: false,
  confirmationAction: "",
  isConfirmationDialogOpen: false,
  tasksView: JSON.parse(localStorage.getItem("tasksView") || null) || "board",
  singleTaskView:
    JSON.parse(localStorage.getItem("singleTaskView") || null) || "detail",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },
    setIsSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    setSelectedUserId: (state, action) => {
      state.selectedUserId = action.payload;
    },
    setIsAddUserOpen: (state, action) => {
      state.isAddUserOpen = action.payload;
    },
    setSelectedTaskId: (state, action) => {
      state.selectedTaskId = action.payload;
    },
    setIsAddTaskOpen: (state, action) => {
      state.isAddTaskOpen = action.payload;
    },
    setIsAddSubTaskOpen: (state, action) => {
      state.isAddSubTaskOpen = action.payload;
    },
    setConfirmationAction: (state, action) => {
      state.confirmationAction = action.payload;
    },
    setIsConfirmationDialogOpen: (state, action) => {
      state.isConfirmationDialogOpen = action.payload;
    },
    setTasksView: (state, action) => {
      state.tasksView = action.payload;
      localStorage.setItem("tasksView", JSON.stringify(action.payload));
    },
    setSingleTaskView: (state, action) => {
      state.singleTaskView = action.payload;
      localStorage.setItem("singleTaskView", JSON.stringify(action.payload));
    },
  },
});

export const {
  setSearchText,
  setIsSidebarOpen,
  setSelectedUserId,
  setIsAddUserOpen,
  setSelectedTaskId,
  setIsAddTaskOpen,
  setIsAddSubTaskOpen,
  setConfirmationAction,
  setIsConfirmationDialogOpen,
  setTasksView,
  setSingleTaskView,
} = uiSlice.actions;

export default uiSlice.reducer;
