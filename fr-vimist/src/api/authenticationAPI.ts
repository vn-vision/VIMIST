import axios from "axios";


// userInterface
export interface User {
    username:string;
    contact:string | null;
    email: string | null;
    password: string;
}


const loginUrl = "http://localhost:8000/api/users/login";  // Login
const adminReg = "http://localhost:8000/api/users/sa_register";  // admin reg
const userReg = "http://localhost:8000/api/users/register";  // user reg


// different API points: Register Admin, register user, login

export const adminRegister = async (user: User) =>{
    // register user with admin priviledges
    try{
        const response = await axios.post(`${adminReg}/`, user);
        return response.data;
    } catch (error: any){
        console.error("Error registering admin", error);
        throw new Error('Error occured', error.response.data);
    }
};


export const userRegister = async (user: User) =>{
    //  register a user with user priviledges
    try {
        const response = await axios.post(`${userReg}/`, user);
        return response.data;
    } catch (error: any){
        console.error('Error registering User', error);
        throw new Error(error.response.data);
    }
};


export const userLogin = async (login: User) =>{
    try {
        const response = await axios.post(`${loginUrl}`, login)
        return response.data;
    } catch (error: any){
        console.error('Error trying to login', error);
        throw new Error(error.response.data);
    }
};


