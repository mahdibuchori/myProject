import produce from 'immer';
import create from 'zustand';
import { persist } from 'zustand/middleware';

import { API_AUTH } from '../apis/apisData';

const initialTally = [];
const saveTally = [];
const lotTally = [];
const tallyByID = [];
const useTallyStore = create(
    persist(
        (set) => ({
            tally: initialTally,
            saveTally: saveTally,
            lotTally: lotTally,
            tallyById : tallyByID,
            tallyReady: false,
            lottallyReady: false,
            saveTallyReady: false,
            tallyIdReady: false,
            fetchTally: async (filter_bulan, item, plan, idForm) => {
                try {
                    const data  =  await API_AUTH.get('/tallysheet', {
                        params: {
                            filter_bulan : filter_bulan,
                            item : item,
                            idForm : idForm,
                            plan : plan
                        }
                    });
                    set(produce((state) => {
                        state.tally = data.data;
                        state.tallyReady = true;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            falseTally : async () => {
                try {
                    set(produce((state) => {
                        state.tallyReady = false;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            fetchLotTally: async (filter_bulan, plan) => {
                try {
                    const data  =  await API_AUTH.get('/lottallysheet', {
                        params: {
                            filter_bulan : filter_bulan,
                            plan : plan
                        }
                    });
                    set(produce((state) => {
                        state.lotTally = data.data;
                        state.lottallyReady = true;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            falseLotTally : async () => {
                try {
                    set(produce((state) => {
                        state.lottallyReady = false;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            fetchTallyId: async (id, plan) => {
                try {
                    const data  =  await API_AUTH.get(`/tallysheet/${id}/${plan}`);
                    console.log(data.data)
                    set(produce((state) => {
                        state.tallyByID = data.data;
                        state.tallyIdReady = true;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            falseTallyId : async () => {
                try {
                    set(produce((state) => {
                        state.tallyIdReady = false;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
        }),
        {
            name: 'permintaan-storage',
            getStorage: () => localStorage,
        }
    )
);

export const selectTally = (state) => state.tally;
export const selectFetchTally = (state) => state.fetchTally;
export const selectTallyReady = (state) => state.tallyReady;
export const selectFalseTally = (state) => state.falseTally;

export const selectLotTally = (state) => state.lotTally;
export const selectFetchLotTally = (state) => state.fetchLotTally;
export const selectLottallyReady = (state) => state.lottallyReady;
export const selectFalseLotTally = (state) => state.falseLotTally;

export const selectTallyByID = (state) => state.tallyByID;
export const selectFetchTallyId = (state) => state.fetchTallyId;
export const selectTallyIdReady = (state) => state.tallyIdReady;
export const selectFalseTallyId = (state) => state.falseTallyId;

export default useTallyStore;