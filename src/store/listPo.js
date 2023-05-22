import produce from 'immer';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API_AUTH } from '../apis/apisData';

const initialPo = [];
const poByID = [];
const usePoStore = create(
    persist(
        (set) => ({
            po: initialPo,
            poById : poByID,
            poReady: false,
            poIdReady: false,
            fetchPo: async (id) => {
                try {
                    const { data } =  await API_AUTH.get(`getPO/${id}`);
                    set(produce((state) => {
                        state.po = data;
                        state.poReady = true;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            falsePo : async () => {
                try {
                    set(produce((state) => {
                        state.poReady = false;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
        }),
        {
            name: 'po-storage',
            getStorage: () => localStorage,
        }
    )
);

export const selectPo = (state) => state.po;
export const selectFetchPo = (state) => state.fetchPo;
export const selectPoReady = (state) => state.poReady;
export const selectFalsePo = (state) => state.falsePo;

export default usePoStore;