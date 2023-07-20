import produce from 'immer';
import create from 'zustand';
import { persist } from 'zustand/middleware';

import { API_GSHEET } from '../apis/apisData';
const initialDashboard = [];
const initialYearDash = [];
const useDashboardStore = create(
    persist(
        (set) => ({
            dashboard: initialDashboard,
            yDash: initialYearDash,
            dashboardReady: false,
            yDashReady: false,
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

export default useDashboardStore;
