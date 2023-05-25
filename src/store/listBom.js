import produce from 'immer';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API_AUTH } from '../apis/apisData';

const initialBom = [];
const bomByID = [];

const useBomStore = create(
    persist(
        (set) => ({
            bom: initialBom,
            bomById : bomByID,
            bomReady: false,
            bomIdReady: false,
            fetchBom : async () => {
                try {
                    const { data } = await API_AUTH.get(`/bom`);
                    set(produce((state) => {
                        state.bom = data;
                        state.bomReady = true;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            fetchBomByID: async (id) => {
                try {
                    const data  = await API_AUTH.get(`/bom/${id}`);
                    set(produce((state) => {
                        state.bomById = data.data;
                        state.bomIdReady = true;
                    }))
                } catch (error) {
                    set(produce((state) => {
                        console.log(error);
                    }))
                }
            },
        }),
        {
            name: 'bom-storage',
            getStorage: () => localStorage,
        }
    )
);

export const selectBom = (state) => state.bom;
export const selectFetchBom = (state) => state.fetchBom;
export const selectBomReady = (state) => state.bomReady;

export const selectBomID = (state) => state.bomById;
export const selectFetchBomByID = (state) => state.fetchBomByID;
export const selectBomIdReady = (state) => state.bomIdReady;

export default useBomStore;

