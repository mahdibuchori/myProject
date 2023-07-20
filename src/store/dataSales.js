import produce from 'immer';
import create from 'zustand';
import { persist } from 'zustand/middleware';

import { API_GSHEET } from '../apis/apisData';
const initialCustomer = [];
const initialProduct = [];
const initialSales = [];
const useDataSales = create(
    persist(
        (set) => ({
            customer: initialCustomer,
            product: initialProduct,
            sales: initialSales,
            customerReady: false,
            salesReady: false,
            productReady: false,
            fetchCustomer : async () => {
                let date = new Date()
                try {
                    const { data } = await API_GSHEET.get(`exec?tipe=dataCustomer&date=${date}`);
                    console.log(data)
                    set(produce((state) => {
                        state.customer = data;
                        state.customerReady = true;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            falseCustomer : async () => {
                try {
                    set(produce((state) => {
                        state.customerReady = false;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            fetchProduct : async () => {
                let date = new Date()
                try {
                    const { data } = await API_GSHEET.get(`exec?tipe=dataProduct&date=${date}`);
                    console.log(data)
                    set(produce((state) => {
                        state.product = data;
                        state.productReady = true;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            falseProduct : async () => {
                try {
                    set(produce((state) => {
                        state.productReady = false;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            fetchSales : async () => {
                let date = new Date()
                try {
                    const { data } = await API_GSHEET.get(`exec?tipe=dataSales&date=${date}`);
                    set(produce((state) => {
                        state.sales = data;
                        state.salesReady = true;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            falseSales : async () => {
                try {
                    set(produce((state) => {
                        state.salesReady = false;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
        }),
        {
            name: 'sales-storage',
            getStorage: () => localStorage,
        }
    )
);

export const selectCustomer = (state) => state.customer;
export const selectFetchCustomer = (state) => state.fetchCustomer;
export const selectCustomerReady = (state) => state.customerReady;
export const selectFalseCustomer = (state) => state.falseCustomer;

export const selectProduct = (state) => state.product;
export const selectFetchProduct = (state) => state.fetchProduct;
export const selectProductReady = (state) => state.productReady;
export const selectFalseProduct = (state) => state.falseProduct;

export const selectSales = (state) => state.sales;
export const selectFetchSales = (state) => state.fetchSales;
export const selectSalesReady = (state) => state.salesReady;
export const selectFalseSales = (state) => state.falseSales;

export default useDataSales;