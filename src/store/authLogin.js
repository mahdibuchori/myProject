import produce from 'immer';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API_AUTH } from '../apis/apisData';
const emptyString = '';
const initialUser = [];
const useAuthStore = create(
    persist(
        (set) => ({
            errorLogin: emptyString,
            user: initialUser,
            authReady: false,
            onAuth: async (token) => {
                try {
                    const data  = await API_AUTH.get(`/dashboard`,{headers: { 
                        'Access-Control-Allow-Origin': '*', 
                        'Content-type': 'Application/json', 
                        'authorization': token
                      }})
                      
                      console.log(data)
                    set(produce((state) => {
                        state.user = data.data;
                        state.authReady = true;
                        state.errorLogin = emptyString;
                    }))
                } catch (error) {
                    set(produce((state) => {
                        state.errorLogin = error.message;
                    }))
                }
            },
            authFalse : async () => {
                try {
                    set(produce((state) => {
                        state.authReady = false;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            /* onRegister: async (email, password) => {
                try {
                    await createUserWithEmailAndPassword(auth, email, password);

                    set(produce((state) => {
                        state.userReady = true;
                        state.errorLogin = emptyString;
                        state.errorRegister = emptyString;
                    }))
                } catch (error) {
                    set(produce((state) => {
                        state.errorRegister = error.message;
                    }))
                }
            },
            onLogout: async () => {
                try {
                    await signOut(auth);
                    set(produce((state) => {
                        state.userReady = false;
                    }))
                } catch (error) {
                    console.log(error);
                }
            } */
        }),
        {
            name: 'login-storage', // nama untuk menyimpan di storage
            getStorage: () => sessionStorage, // (optional) by default akan 'localStorage', bisa pakai sessionStorage, dll
        }
    )
);

// selector bisa dibuat di sini, biar bisa reusesable
export const selectAuthReady = (state) => state.authReady;
export const selectAuthFalse = (state) => state.authFalse;
export const selectErrorLogin = (state) => state.errorLogin;
export const selectOnAuth = (state) => state.onAuth;
export const selectUser = (state) => state.user;

export default useAuthStore;