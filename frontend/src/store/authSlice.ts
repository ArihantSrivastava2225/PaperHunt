import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthUser = {
    id: string;
    fullName?: string;
    email?: string;
};

type AuthState = {
    user: AuthUser | null;
    isAuthenticated: boolean;
    status: "idle" | "loading" | "authenticated" | "unauthenticated";
};

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    status: "idle",
};

export const validateSession = createAsyncThunk("auth/validateSession", async() => {
    const res = await fetch("/api/auth/validate", {
        credentials: "include",
    });
    return res.json();
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<AuthUser>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.status = "authenticated";
        },
        clearCredentials: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.status = "unauthenticated";
        },
    },
    extraReducers: (builder) => {
        builder
          .addCase(validateSession.pending, (state) => {
            state.status = "loading";
          })
          .addCase(validateSession.fulfilled, (state, action) => {
            if(action.payload.loggedIn){
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.status = "authenticated";
            }else{
                state.user = null;
                state.isAuthenticated = false;
                state.status = "unauthenticated";
            }
          })
          .addCase(validateSession.rejected, (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.status = "unauthenticated";
          });
    },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;