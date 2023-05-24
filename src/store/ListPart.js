import produce from 'immer';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API_AUTH } from '../apis/apisData';

const initialPart = [];
const initialPartId = [];

const usePartStore = create(
    persist(
        (set) => ({
            part: initialPart,
            partId: initialPartId,
            partReady: false,
            partReadyId: false,
            fetchPart: async (id) => {
                try {
                    const { data } = await API_AUTH.get(`partID/${id}`);
                    set(produce((state) => {
                        state.part = data;
                        state.partReady = true;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            falsePart : async () => {
                try {
                    set(produce((state) => {
                        state.partReady = false;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            fetchPartID: async (id,plan) => {
                try {
                    const { data } = await API_AUTH.get(`orderPart/${id}/${plan}`);
                    set(produce((state) => {
                        state.partId = data;
                        state.partReadyId = true;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            falsePartID : async () => {
                try {
                    set(produce((state) => {
                        state.partReadyId = false;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            
        }),
        {
            name: 'part-storage',
            getStorage: () => localStorage,
        }
    )
);

export const selectPart = (state) => state.part;
export const selectFetchPart = (state) => state.fetchPart;
export const selectPartReady = (state) => state.partReady;
export const selectFalsePart = (state) => state.falsePart;

export const selectPartID = (state) => state.partId;
export const selectFetchPartID = (state) => state.fetchPartID;
export const selectPartReadyID = (state) => state.partReadyId;
export const selectFalsePartID = (state) => state.falsePartID;

export default usePartStore;