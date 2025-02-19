import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Settings, getSettings, getSettingById, postSettings, updateSettings, deleteSettings } from "../../utils/api/settingsAPI"

//  create type for the initial state
interface SettingsState {
    settings: Settings[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
    message: string;
}

//  create thunks for settings

export const fetchSettings = createAsyncThunk<Settings[], void>(
    "settings/fetchSettings",
    async () => {
        try {
            const response = await getSettings();
            return response?.results;
        }
        catch (error){
            console.error("Error fetching settings", error);
            return error
        }
    }
)

// get settings by ID
export const fetchSettingsById = createAsyncThunk<number, number,{ rejectValue: string }>(
    "settings/fetchSetting",
    async (id: number, {rejectWithValue}) => {
        try {
            const response = await getSettingById(id);
            return response.Settings;
        }
        catch (error: any){
            return rejectWithValue(
                error.response?.data || "an error occured getting settings"
            );
        }
    }
);

// add a new settings
export const addNewSettings = createAsyncThunk<Settings, FormData, {rejectValue: string}>(
    "settings/addSettings",
    async (settings, {rejectWithValue}) => {
        try {
            const response = await postSettings(settings);
            return response;
        }
        catch (error: any){
            return rejectWithValue(
                error.response?.data || "An error occured adding settings"
            )
        }
    }
);

// update settings
export const updateSettingsById = createAsyncThunk<Settings, FormData, {rejectValue: string}>(
    "settings/updateSettings",
    async (settings, {rejectWithValue}) => {
        try {
            const response = await updateSettings(settings);
            return response;
        }
        catch (error: any){
            return rejectWithValue(
                error.response?.data || "An error occured updating settings"
            )
        }
    }
);

// clear messages
export const clearMessages = createAsyncThunk<void, void>(
    "settings/clearMessages",
    async () => {
        return;
    }
);

// delete settings
export const deleteSettingsById = createAsyncThunk<number, number, {rejectValue: string}>(
    "settings/deleteSettings",
    async (id, {rejectWithValue}) => {
        try {
            const response = await deleteSettings(id);
            return response;
        }
        catch (error: any){
            return rejectWithValue(
                error.response?.data || "An error occured deleting settings"
            )
        }
    }
);

//  create initial state
const initialState: SettingsState = {
    settings: [],
    status: "loading",
    error: null,
    message: ""
}

// create slice
const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSettings.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchSettings.fulfilled, (state, action) => {
                state.settings = state.settings.concat(action.payload);
                if (state.settings){
                    state.status = "succeeded";
                    state.message = "Settings Fetched";
                }
            })
            .addCase(fetchSettings.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || null;
            })

            // handle fetch settings by ID
            .addCase(fetchSettingsById.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchSettingsById.fulfilled, (state, action) => {
                state.settings = state.settings.filter((settings) => settings.id === action.payload);
                if (state.settings){
                    state.status = "succeeded";
                    state.message = "Setting Fetched";
                }
            })
            .addCase(fetchSettingsById.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || null;
            })

            // handle add new settings
            .addCase(addNewSettings.pending, (state) => {
                state.status = "loading";
            })
            .addCase(addNewSettings.fulfilled, (state, action) => {
                state.settings.push(action.payload);
                state.status = "succeeded";
                state.message = "Settings Added";
            })
            .addCase(addNewSettings.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || null;
            })

            // handle update settings
            .addCase(updateSettingsById.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateSettingsById.fulfilled, (state, action) => {
                state.settings = state.settings.map((settings) =>
                    settings.id === action.payload.id ? action.payload : settings
                );
                if (state.settings){
                    state.status = "succeeded";
                    state.message = "Settings Updated";
                }
            })
            .addCase(updateSettingsById.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || null;
            })

            // handle delete settings
            .addCase(deleteSettingsById.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deleteSettingsById.fulfilled, (state, action) => {
                state.settings = state.settings.filter((settings) => settings.id !== action.payload);
                if (state.settings) {
                    state.status = "succeeded";
                    state.message = "Settings Deleted";
                }
            })
            .addCase(deleteSettingsById.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || null;
            })

            // handle clear messages
            .addCase(clearMessages.pending, (state) => {
                state.status = "loading";
            })
            .addCase(clearMessages.fulfilled, (state) => {
                state.status = "idle";
                state.message = "";
                state.error = "";
            })
            .addCase(clearMessages.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Could not clear Messages";
            })
    }
});

export default settingsSlice.reducer;
