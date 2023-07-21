import produce from 'immer';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { API_GSHEET } from '../apis/apisData';

const initialBom = [];
const bomByID = [];
const nookpID = [];
const createOKP = [];
const saveOKP = [];
const delOKP = [];
const delNote = [];
const okpNote = [];

const useOkpStore = create(
    persist(
        (set) => ({
            okp: initialBom,
            okpById : bomByID,
            noOKP : nookpID,
            creOKP : createOKP,
            sveOKP : saveOKP,
            deleteOKP : delOKP,
            deleteNote : delNote,
            noteOKP : okpNote,
            okpReady: false,
            okpIdReady: false,
            createReady : false,
            saveReady : false,
            noteReady : false,
            deleteReady : false,
            deleNotReady : false,
            fetchOkp : async (id,tipe,sheet) => {
                try {
                    console.log(id+" "+tipe+" "+sheet)
                    const { data } = await API_GSHEET.get(`exec?tipe=${tipe}&date=${id}&sheet=${sheet}`);
                    console.log(data)
                    set(produce((state) => {
                        state.okp = data;
                        state.okpReady = true;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            falseOkp : async () => {
                try {
                    set(produce((state) => {
                        state.okpReady = false;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            fetchNoOKP : async (id,tipe) => {
                try {
                    const { data } = await API_GSHEET.get(`exec?tipe=getNoOKP&date=${id}`);
                    console.log(data)
                    set(produce((state) => {
                        state.noOKP = data.data;
                        state.noOKPReady = true;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            falseNoOkp : async () => {
                try {
                    set(produce((state) => {
                        state.noOKPReady = false;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            fetchCreateOKP : async (id,tgOKP,tgRev,rev,no) => {
                try {
                    const { data } = await API_GSHEET.get(`exec?tipe=createOKP&date=${id}&tOkp=${tgOKP}&tRev=${tgRev}&rev=${rev}&no=${no}`);
                    console.log(data)
                    set(produce((state) => {
                        state.creOKP = data.data;
                        state.createReady = true;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            falseCreateOkp : async () => {
                try {
                    set(produce((state) => {
                        state.createReady = false;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            fetchSaveOKP : async (tglOK,tglPro,revisi,no,id,produk,varian,revisiProd,batch) => {
                try {
                    const { data } = await API_GSHEET.get(`exec?tipe=saveOKP&date=${tglPro}&tOkp=${tglOK}&rev=${revisi}&no=${no}&idOKP=${id}&produk=${produk}&batch=${batch}&varian=${varian}&revisi=${revisiProd}&sheet`);
                    set(produce((state) => {
                        state.sveOKP = data;
                        state.saveReady = true;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            falseSaveOkp : async () => {
                try {
                    set(produce((state) => {
                        state.saveReady = false;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            fetchNoteOKP : async (tglOK,tglPro,revisi,no,note,noLama,noteLama) => {
                try {
                    const { data } = await API_GSHEET.get(`exec?tipe=saveNoteOKP&date=${tglPro}&tOkp=${tglOK}&rev=${revisi}&no=${no}&note=${note}&noLama=${noLama}&noteLama=${noteLama}&sheet&tRev`);
                    console.log(data)
                    set(produce((state) => {
                        state.noteOKP = data;
                        state.noteReady = true;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            falseNoteOkp : async () => {
                try {
                    set(produce((state) => {
                        state.noteReady = false;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            fetchDelOKP : async (tglOK,tglPro,revisi,no) => {
                try {
                    const { data } = await API_GSHEET.get(`exec?tipe=deleteOKP&date=${tglPro}&tOkp=${tglOK}&rev=${revisi}&no=${no}&sheet`);
                    console.log(data)
                    
                    set(produce((state) => {
                        state.deleteOKP = data;
                        state.deleteReady = true;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            falseDeleteOkp : async () => {
                try {
                    set(produce((state) => {
                        state.deleteReady = false;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            fetchDelNote : async (tglOK,tglPro,revisi,no,note) => {
                try {
                    const { data } = await API_GSHEET.get(`exec?tipe=deleteNote&date=${tglPro}&tOkp=${tglOK}&rev=${revisi}&no=${no}&note=${note}&sheet`);
                    console.log(data)
                    console.log(`exec?tipe=deleteNote&date=${tglPro}&tOkp=${tglOK}&rev=${revisi}&no=${no}&note=${note}&sheet`)
                    
                    set(produce((state) => {
                        state.deleteNote = data;
                        state.deleNotReady = true;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            falseDeleteNote : async () => {
                try {
                    set(produce((state) => {
                        state.deleNotReady = false;
                    }))
                } catch (error) {
                    console.log(error);
                }
            },
            
        }),
        {
            name: 'okp-storage',
            getStorage: () => localStorage,
        }
    )
);

export const selectOkp = (state) => state.okp;
export const selectFetchOkp = (state) => state.fetchOkp;
export const selectOkpReady = (state) => state.okpReady;
export const selectFalseOkp = (state) => state.falseOkp;


export const selectNoOkp = (state) => state.noOKP;
export const selectFetchNoOKP = (state) => state.fetchNoOKP;
export const selectNoOKPReady = (state) => state.noOKPReady;
export const selectFalseNoOkp = (state) => state.falseNoOkp;

export const selectCreOKP = (state) => state.creOKP;
export const selectFetchCreateOKP = (state) => state.fetchCreateOKP;
export const selectCreateReady = (state) => state.createReady;
export const selectFalseCreateOkp = (state) => state.falseCreateOkp;

export const selectSveOKP = (state) => state.sveOKP;
export const selectFetchSaveOKP = (state) => state.fetchSaveOKP;
export const selectSaveReady = (state) => state.saveReady;
export const selectFalseSaveOkp = (state) => state.falseSaveOkp;

export const selectNoteOKP = (state) => state.noteOKP;
export const selectFetchNoteOKP = (state) => state.fetchNoteOKP;
export const selectNoteReady = (state) => state.noteReady;
export const selectFalseNoteOkp = (state) => state.falseNoteOkp;

export const selectDeleteOKP = (state) => state.deleteOKP;
export const selectFetchDelOKP = (state) => state.fetchDelOKP;
export const selectDelReady = (state) => state.deleteReady;
export const selectFalseDelOkp = (state) => state.falseDeleteOkp;

export const selectDeleteNote = (state) => state.deleteNote;
export const selectFetchDelNote = (state) => state.fetchDelNote;
export const selectDeleNotReady = (state) => state.deleNotReady;
export const selectFalseDeleteNote = (state) => state.falseDeleteNote;
export default useOkpStore;

//
