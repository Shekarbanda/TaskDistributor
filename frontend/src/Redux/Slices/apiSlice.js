import { createSlice } from "@reduxjs/toolkit";

const apiSlice = createSlice({
    name: "api",
    initialState: {
        url: "https://taskdistributor-backend.onrender.com/api",
    },
    
});

export default apiSlice.reducer;