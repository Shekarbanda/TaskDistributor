import { configureStore } from "@reduxjs/toolkit";
import taskslice from "./Slices/TaskSlice";
import agentslice from "./Slices/AgentSlice";

const store = configureStore({
    reducer:{
        tasks: taskslice,
        agents: agentslice
    }
})

export default store;