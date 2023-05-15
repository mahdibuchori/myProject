import produce from 'immer';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API_AUTH } from '../apis/apisData';
const initialMaterial = [];
const initialMaterialId = [];
const useMaterialStore = create(
    persist(
                (set) => ({
                    material: initialMaterial,
                    materialId: initialMaterialId,
                    materialReady: false,
                    materialReadyId: false,
                    fetchMaterial: async () => {
                        try {
                            const { data } = await API_AUTH.get('/gudang');
                            set(produce((state) => {
                                state.material = data;
                                state.materialReady = true;
                            }))
                        } catch (error) {
                            console.log(error);
                        }
                    },
                    falseMaterial : async () => {
                        try {
                            set(produce((state) => {
                                state.materialReady = false;
                            }))
                        } catch (error) {
                            console.log(error);
                        }
                    },
                }),
                {
                    name: 'material-storage',
                    getStorage: () => localStorage,
                }
            )
);

export const selectMaterial = (state) => state.material;
export const selectFetchMaterial = (state) => state.fetchMaterial;
export const selectMaterialReady = (state) => state.materialReady;
export const selectFalseMaterial = (state) => state.falseMaterial;

export default useMaterialStore;