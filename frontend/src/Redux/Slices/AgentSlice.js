import { createSlice } from "@reduxjs/toolkit";

const AgentSlice = createSlice({
    name: "agents",
    initialState: {
        agents: [],
    },
    reducers: {
        addAgents: (state, action) => {
            state.agents = action.payload;
        },
    },
});

export const { addAgents } = AgentSlice.actions;
export default AgentSlice.reducer;