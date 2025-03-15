import { create } from "zustand";

import axios from "axios";
const API_URL = import.meta.env.MODE ==="development" ?'http://localhost:4000/api/auth' : "/api/auth";


axios.defaults.withCredentials = true ;
const useAuthStore= create((set)=>({
    user : null,
    isAuthenticated : false,
    error : null,
    isLoading : false,
    isCheckingAuth : true,

    signup : async(email, password, name)=>{
        set({isLoading:true, error:null});
        try{
           const response = await axios.post(`${API_URL}/signup`,{email, password, name})
            set({user:response.data.user,isAuthenticated:true, isLoading:false});

        }
        catch(err){
            set({error:err.response.data.message || "error occured", isLoading:false});
            throw err;
        }
    },

    verifyEmail: async(code)=>{
        set({isLoading: true, error: null});
        try{
            const response = await axios.post(`${API_URL}/verify-email`, {code});
            set({user: response.data.user, isAuthenticated: true, isLoading: false});
        }catch(error){
            set({error: error.response.message || "error in verifying", isLoading: false});
            throw error;
        }
    },

    signin: async(email,password)=>{

            set({ isLoading: true, error: null });

            try {
                const response = await axios.post(`${API_URL}/login`, { email, password });

                set({
                    isAuthenticated: true,
                    user: response.data.user,
                    error: null,
                    isLoading: false,
                });
            } catch (error) {
                set({
                    error: error.response?.data?.message || "Error logging in",
                    isLoading: false,
                });
                throw error;
            }
    },

    checkAuth: async ()=>{
        set({isCheckingAuth: true, error: null});
        try{
            const response = await axios.get(`${API_URL}/check-auth`);
            set({user : response.data.user, isAuthenticated: true, isCheckingAuth: false});
        }catch(error){
            set({error:null, isCheckingAuth:false, isAuthenticated: false});
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
        await axios.post(`${API_URL}/logout`);
        set({user: null, isAuthenticated: false, error: null, isLoading: false });
        } catch (error){
        set({ error: "Error logging out", isLoading: false });
        throw error;
        }
    },

    forgetPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/forget-password`, { email });
            set({ message: response.data.message, isLoading: false });
        } catch (error) {
            set({
                isLoading: false,
                error: error.response.data.message || "error in sending email for reset password"
            });
            throw error;
        }
    },

    resetPassword: async(token, password)=>{
        set({isLoading: true, error: null});
        try{
            const response = await axios.post(`${API_URL}/reset-password/${token}`, {password})
            set({isLoading: false});
        }
        catch(error){
            set({
                isLoading: false,
                error: error.response.data.message || "error in sending email for reset password"
            });
            throw error;
        }
    }
}));



export default useAuthStore;
