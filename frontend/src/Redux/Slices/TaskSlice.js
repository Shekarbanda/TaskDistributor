import { createSlice } from "@reduxjs/toolkit";

const TaskSlice = createSlice({
    name: "tasks",
    initialState: {
        tasks: [],
    },
    reducers: {
        addTasks: (state, action) => {
            state.tasks = action.payload;
        },
    },
});

export const { addTasks } = TaskSlice.actions;
export default TaskSlice.reducer;