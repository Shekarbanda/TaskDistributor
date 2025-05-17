import { createSlice } from "@reduxjs/toolkit";

const apiSlice = createSlice({
    name: "api",
    initialState: {
        url: "http://localhost:8000/api",
    },
    
});

export default apiSlice.reducer;