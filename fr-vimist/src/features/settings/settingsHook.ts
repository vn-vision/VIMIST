import {
    fetchSettings,
    fetchSettingsById,
    addNewSettings,
    updateSettingsById,
    deleteSettingsById,
    clearMessages
} from "./settingsSlice";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { useEffect } from "react";

// create hooks to get the data and status of a settings request
export const useFetchSettings = () => {
    const dispatch = useDispatch<AppDispatch>();
    const settings = useSelector((state: RootState) => state.config.settings);
    const status = useSelector((state: RootState) => state.config.status);
    const error = useSelector((state: RootState) => state.config.error);
    const message = useSelector((state: RootState) => state.config.message);

    useEffect(() =>{
        if (settings.length === 0){
            dispatch(fetchSettings());
        }
    },[dispatch, settings.length]);
    return {data: settings, status, error, message};
};

// create hook to get settings by id
export const useFetchSettingsById = (id: number) => {
    const dispatch = useDispatch<AppDispatch>();
    const settings = useSelector((state: RootState) => state.config.settings);
    const status = useSelector((state: RootState) => state.config.status);
    const error = useSelector((state: RootState) => state.config.error);
    const message = useSelector((state: RootState) => state.config.message);

    useEffect(() =>{
        if (settings.length === 0){
            dispatch(fetchSettingsById(id));
        }
    },[dispatch, id, settings.length]);
    return {data: settings, status, error, message};
};

// create hook to add settings
export const useAddSettings = () => {
    const dispatch = useDispatch<AppDispatch>();
    const status = useSelector((state: RootState) => state.config.status);
    const error = useSelector((state: RootState) => state.config.error);
    const message = useSelector((state: RootState) => state.config.message);

    const addSettings = (settings: FormData) => {
        dispatch(addNewSettings(settings));
    }

    return {status, error, addSettings, message};
};

// create hook to update settings
export const useUpdateSettings = () => {
    const dispatch = useDispatch<AppDispatch>();
    const status = useSelector((state: RootState) => state.config.status);
    const error = useSelector((state: RootState) => state.config.error);
    const message = useSelector((state: RootState) => state.config.message);

    const updateSettings = (settings: FormData) => {
        dispatch(updateSettingsById(settings));
    }

    return {status, error, updateSettings, message};
};

// create hook to delete settings
export const useDeleteSettings = () => {
    const dispatch = useDispatch<AppDispatch>();
    const status = useSelector((state: RootState) => state.config.status);
    const error = useSelector((state: RootState) => state.config.error);
    const message = useSelector((state: RootState) => state.config.message);

    const deleteSettings = (id: number) => {
        dispatch(deleteSettingsById(id));
    }

    return {status, error, deleteSettings, message};
};

// create hook to clear messages
export const useClearMessages = () => {
    const dispatch = useDispatch<AppDispatch>();

    const clsMessages = () => {
        dispatch(clearMessages());
    }

    return {clsMessages};
};