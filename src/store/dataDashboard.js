import produce from 'immer';
import create from 'zustand';
import { persist } from 'zustand/middleware';

import { API_GSHEET } from '../apis/apisData';

const initialDashboard = [];
const initialYearDash = [];
const initialFinishgood = [];
const initialPpic = [];
const initialWip = [];

const useDashboardStore = create(
    persist(
        (set) => ({
            dashboard: initialDashboard,
            yDash: initialYearDash,
            dashFg : initialFinishgood,
            dashPpic : initialPpic,
            dashWip : initialWip,
            dashboardReady: false,
            yDashReady: false,
            fgReady: false,
            ppicReady: false,
            wipReady: false,
            fetchDashboard : async () => {
                let date = new Date()
                try {
                    const { data } = await API_GSHEET.get(`exec?tipe=reportPurch&date=${date}`);
                    console.log(data)
                    set(produce((state) => {
                        state.dashboard = data;
                        state.dashboardReady = true;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            falseDashboard : async () => {
                try {
                    set(produce((state) => {
                        state.dashboardReady = false;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            fetchYdash : async () => {
                let date = new Date()
                try {
                    const { data } = await API_GSHEET.get(`exec?tipe=reportYearPurch&date=${date}`);
                    set(produce((state) => {
                        state.yDash = data;
                        state.yDashReady = true;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            falseYdash : async () => {
                try {
                    set(produce((state) => {
                        state.yDashReady = false;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            fetchDashFg : async () => {
                let date = new Date()
                try {
                    const { data } = await API_GSHEET.get(`exec?tipe=reportFinishGood&date=${date}`);
                    set(produce((state) => {
                        state.dashFg = data;
                        state.fgReady = true;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            falseDashFg : async () => {
                try {
                    set(produce((state) => {
                        state.fgReady = false;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            fetchDashPpic : async () => {
                let date = new Date()
                try {
                    const { data } = await API_GSHEET.get(`exec?tipe=reportPpic&date=${date}`);
                    set(produce((state) => {
                        state.dashPpic = data;
                        state.ppicReady = true;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            falseDashPpic : async () => {
                try {
                    set(produce((state) => {
                        state.ppicReady = false;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            fetchDashWip : async () => {
                let date = new Date()
                try {
                    const { data } = await API_GSHEET.get(`exec?tipe=reportWip&date=${date}`);
                    set(produce((state) => {
                        state.dashWip = data;
                        state.wipReady = true;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            falseDashWip : async () => {
                try {
                    set(produce((state) => {
                        state.wipReady = false;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
        }),
        {
            name: 'dashboard-storage',
            getStorage: () => localStorage,
        }
    )
);

export const selectDashboard = (state) => state.dashboard;
export const selectFetchDashboard = (state) => state.fetchDashboard;
export const selectDashboardReady = (state) => state.dashboardReady;
export const selectFalseDashboard = (state) => state.falseDashboard;

export const selectYdash = (state) => state.yDash;
export const selectFetchYdash = (state) => state.fetchYdash;
export const selectYdashReady = (state) => state.yDashReady;
export const selectFalseYdash = (state) => state.falseYdash;

export const selectDashFg = (state) => state.dashFg;
export const selectfetchDashFg = (state) => state.fetchDashFg;
export const selectFgReady = (state) => state.fgReady;
export const selectFalseDashFg = (state) => state.falseDashFg;

export const selectDashPpic = (state) => state.dashPpic;
export const selectFetchDashPpic = (state) => state.fetchDashPpic;
export const selectPpicReady = (state) => state.ppicReady;
export const selectFalseDashPpic = (state) => state.falseDashPpic;

export const selectDashWip = (state) => state.dashWip;
export const selectFetchDashWip = (state) => state.fetchDashWip;
export const selectWipReady = (state) => state.wipReady;
export const selectFalseDashWip = (state) => state.falseDashWip;

export default useDashboardStore;
