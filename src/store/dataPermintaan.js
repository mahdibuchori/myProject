import produce from 'immer';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API_AUTH } from '../apis/apisData';

const initialPermintaaan = [];
const savePermintaaan = [];
const permintaanByID = [];
const hpistori = [];

const usePermintaanStore = create(
    persist(
        (set) => ({
            permintaan: initialPermintaaan,
            pHistory : hpistori,
            savePermin: savePermintaaan,
            permintaanById : permintaanByID,
            permintaanReady: false,
            savePerminReady: false,
            permintaanIdReady: false,
            pHistoryReady : false,
            fetchPermintaan: async (id, plan) => {
                try {
                    const data  =  await API_AUTH.get('/permintaan', {
                        params: {
                            id_tglOKP: id,
                            plan : plan
                        }
                    });
                    set(produce((state) => {
                        state.permintaan = data.data.reverse();
                        state.permintaanReady = true;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            falsePermintaan : async () => {
                try {
                    set(produce((state) => {
                        state.permintaanReady = false;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            fetchHistory: async (id) => {
                try {
                    const data  =  await API_AUTH.get('/historiPerm', {
                        params: {
                            id_permintaan: id
                        }
                    });
                    set(produce((state) => {
                        state.pHistory = data.data;
                        state.pHistoryReady = true;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            falseHistory : async () => {
                try {
                    set(produce((state) => {
                        state.pHistoryReady = false;
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

export const selectPermintaan = (state) => state.permintaan;
export const selectFetchPermintaan = (state) => state.fetchPermintaan;
export const selectPermintaanReady = (state) => state.permintaanReady;
export const selectFalsePermintaan = (state) => state.falsePermintaan;

export const selectPhistory = (state) => state.pHistory;
export const selectFetchHistory = (state) => state.fetchHistory;
export const selectPhistoryReady = (state) => state.pHistoryReady;
export const selectFalseHistory = (state) => state.falseHistory;

export default usePermintaanStore;