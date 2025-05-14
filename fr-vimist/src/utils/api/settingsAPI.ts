import axios from "axios";

const baseUrl = "http://localhost:8000/api/config/config"

// Has App name, logo, theme and other settings
export interface Settings {
    id: number;
    system_name: string;
    logo: string;
    primary_color:string;
    secondary_color:string;
    threshold:number;
}

export const getSettings = async () => {
    try {
        const response = await axios.get(`${baseUrl}/`);
        return response.data;
    }
    catch (error) {
        console.error("Error fetching settings", error);
        throw error;
    }
};

// get settings by id
export const getSettingById = async (id: number) => {
    try {
        const response = await axios.get(`${baseUrl}/${id}/`);
        return response.data;
    }
    catch (error){
        console.error("Error while fetching the settings", error);
        throw error;
    }
}

// add settings
export const postSettings = async (Settings: FormData) => {
    try {
        const myToken = sessionStorage.getItem("accessToken");
        const response = await axios.post(`${baseUrl}/`, Settings, {
            headers: {
                Authorization: `Bearer ${myToken}`,
                "Content-Type": "multipart/form-data",
            }
        });
        return response.data;
    }
    catch (error){
        console.error("Error adding settings", error);
        throw error;
    }
}

// update settings
export const updateSettings = async (Settings: FormData) => {
    try{
        const myToken = sessionStorage.getItem("accessToken");
        const id = Settings.get("id") as string;
        if (!id){
            throw new Error("ID not Found in Settings");
        }
        const response = await axios.put(`${baseUrl}/${id}/`, Settings, {
            headers: {
                Authorization: `Bearer ${myToken}`,
                "Content-Type": "multipart/form-data",
            }
        })
        return response.data;
    }
    catch (error){
        console.error("Error updating settings", error);
        throw error;
    }
}

// delete settings
export const deleteSettings = async (id: number) => {
    try {
        const myToken = sessionStorage.getItem("accessToken");
        const response = await axios.delete(`${baseUrl}/${id}/`, {
            headers: {
                Authorization: `Bearer ${myToken}`,
                "Content-Type": "application/json",
            }
        })
        return response.data;
    }
    catch (error){
        console.error("Error deleting settings", error);
        throw error;
    }
}