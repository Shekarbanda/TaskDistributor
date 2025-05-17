import { configureStore } from "@reduxjs/toolkit";
import taskslice from "./Slices/TaskSlice";
import agentslice from "./Slices/AgentSlice";
import apiSlice from "./Slices/apiSlice";

const store = configureStore({
    reducer:{
        tasks: taskslice,
        agents: agentslice,
        api: apiSlice
    }
})

export default store;