import produce from 'immer';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API_AUTH } from '../apis/apisData';

const initialProvider = [];
const providerByID = [];

const useProviderStore = create(
    persist(
        (set) => ({
            provider: initialProvider,
            providerReady: false,
            providerById : providerByID,
            providerIdReady: false,
            fetchProvider: async () => {
                try {
                    const { data } = await API_AUTH.get(`/provider`);
                    set(produce((state) => {
                        state.provider = data;
                        state.providerReady = true;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            falseProvider : async () => {
                try {
                    set(produce((state) => {
                        state.provider = false;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            fetchProviderByID: async (id) => {
                try {
                    const data  = await API_AUTH.get(`/provider/${id}`);
                    set(produce((state) => {
                        state.providerById = data.data;
                        state.providerIdReady = true;
                    }))
                } catch (error) {
                    set(produce((state) => {
                        state.errorLogin = error.message;
                    }))
                }
            },
        }),
        {
            name: 'provider-storage',
            getStorage: () => localStorage,
        }
    )
);

export const selectProvider = (state) => state.provider;
export const selectFetchProvider = (state) => state.fetchProvider;
export const selectProviderReady = (state) => state.providerReady;
export const selectFalseProvider = (state) => state.falseProvider;

export const selectProviderID = (state) => state.providerById;
export const selectFetchProviderByID = (state) => state.fetchProviderByID;
export const selectProviderIdReady = (state) => state.providerIdReady;

export default useProviderStore;

