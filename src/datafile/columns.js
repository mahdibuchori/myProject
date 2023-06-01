import { BtnBom } from '../page/forms/bom/BtnBom';
import { BtnStok } from '../page/forms/datastok/BtnStok';
import { BtnPengadaan } from '../page/forms/pengadaan/BtnPengadaan';
import { BtnSparepart } from '../page/forms/sparepart/BtnSparepart';
// import { BtnPermintaan } from '../page/forms/permintaan/BtnPermintaan';
import { BtnProvider } from '../page/forms/eksternalProvider/BtnProvider';

export const COLUMNS_GUDANG =[
    {
        headerName: 'Material',
        field : 'item',
        width: 250,
        suppressSizeToFit: true,
        filter: 'agTextColumnFilter',
    },
    {
        headerName: 'Unit',
        width: 80,
        field : 'unit',
    },
    {
        headerName: 'S_Awal',
        field : 'saldo_awal',
        width: 100,
        maxWidth:175,
    },
    {
        headerName: 'S_Akhir',
        field : 'saldo_akhir',
        width: 100,
        maxWidth:175,
    },
    {
        headerName: 'Rtrn Prod',
        field : 'ret_prod',
        width: 150,
        maxWidth:255,
    },
    {
        headerName: 'Permintaan Prod',
        field : 'perm_prod',
        width: 150,
        maxWidth:255,
    },
    {
        headerName: 'Status',
        field : 'ket_limit',
        width: 105,
        cellStyle: function(params) {
            if (params.value ==='STOCK LIMIT') {
                return {color: '#800000', backgroundColor: '#d07979a7', borderRadius: '8px', height: 30, lineHeight: 2, marginTop: '5px',textAlign: 'center'};
                
            }
            else if (params.value ==='PENGAJUAN') {
                return {color: '#918413', backgroundColor: '#e7d32260', borderRadius: '8px', height: 30, lineHeight: 2, marginTop: '5px',textAlign: 'center'};
            }
            else if (params.value ==='ORDER') {
                return {color: '#120cce', backgroundColor: '#120cce60', borderRadius: '8px', height: 30, lineHeight: 2, marginTop: '5px',textAlign: 'center'};
            }
            else if (params.value ==='AMAN') {
                return {color: '#008011', backgroundColor: '#38cc4c73', borderRadius: '8px', height: 30, lineHeight: 2, marginTop: '5px',textAlign: 'center'};
            }
            else if (params.value ==='TIDAK AKTIF') {
                return {color: '#7a0080', backgroundColor: '#a35ea6c4', borderRadius: '8px', height: 30, lineHeight: 2, marginTop: '5px',textAlign: 'center'};
            }
            else {
                return null;
            }
        }
    },
    {
        field : '',
        headerName: 'Action',
        cellRenderer: BtnStok,
        width: 150,
        pinned: 'right'
    }
]

export const COLUMNS_PROVIDER =[
    {
        headerName: 'ID',
        field : 'id_provider',
        width: 100,
        suppressSizeToFit: true,
        filter: 'agTextColumnFilter',
    },
    {
        headerName: 'Nama Pemasok',
        width: 200,
        maxWidth:350,
        field : 'nama_provider',
    },
    {
        headerName: 'Telephon',
        field : 'tlp_provider',
        width: 150,
        maxWidth:175,
    },
    {
        headerName: 'Alamat',
        field : 'almt_provider',
        width: 500,
        maxWidth:755,
    },
    {
        field : '',
        headerName: 'Action',
        cellRenderer: BtnProvider,
        width: 100,
        pinned: 'right'
    }
]

export const COLUMNS_PENGADAAN =[
    {
        headerName: 'ID',
        field : 'id_Pengadaan',
        width: 120,
        maxWidth:155,
        suppressSizeToFit: true,
        pinned: 'left',
        filter: 'agTextColumnFilter',
        headerCheckboxSelection: true,
        checkboxSelection: true,
        showDisabledCheckboxes: true,
    },
    {
        field : 'pemohon',
        valueGetter: params => {
            let nilai  = params.data.user[0].pemohon;
            return nilai;
        },
        width: 105,
        maxWidth:155,
        pinned: 'left'
    },
    {
        headerName: 'Tanggal',
        field : 't_pengadaan',
        width: 110,
        maxWidth:115,
    },
    {
        field : 'material',
        valueGetter: params => {
            let nilai  = params.data.material[0].material;
            return nilai;
        },
        width: 300
    },
    {
        field : 'order',
        valueGetter: params => {
            let nilai  = params.data.qty_pengadaan[0].order;
            return nilai;
        },
        width: 90,
        maxWidth:105,
    },
    {
        headerName: 'Unit',
        field : 'satuan',
        valueGetter: params => {
            let nilai  = params.data.qty_pengadaan[0].satuan;
            return nilai;
        },
        width: 80,
        maxWidth:95,
    },
    {
        field : 'status',
        width: 100,
        maxWidth:115,
        cellClassRules: {
            "rag-green": "x < 20",
            "rag-amber": "x >= 20 && x < 25",
            "rag-red": "x >= 25"
        },
        cellStyle: function(params) {
            if (params.value ==='Pengajuan') {
                return {color: '#800000', backgroundColor: '#d07979a7', borderRadius: '8px', height: 30, lineHeight: 2, marginTop: '5px',textAlign: 'center'};
                
            }
            else if (params.value ==='Verifikasi') {
                return {color: '#120cce', backgroundColor: '#120cce60', borderRadius: '8px', height: 30, lineHeight: 2, marginTop: '3px',textAlign: 'center'};
            }
            else if (params.value ==='Selesai') {
                return {color: '#008011', backgroundColor: '#38cc4c73', borderRadius: '8px', height: 30, lineHeight: 2, marginTop: '3px',textAlign: 'center'};
            }
            else if (params.value ==='Revisi') {
                return {color: '#7a0080', backgroundColor: '#a35ea6c4', borderRadius: '8px', height: 30, lineHeight: 2, marginTop: '3px',textAlign: 'center'};
            }
            else {
                return null;
            }
        }
    },
    {
        field : 'keterangan',
        minwidth:200,
        maxWidth: 450
    },
    {
        field : 'Action',
        headerName: 'Action',
        cellRenderer: BtnPengadaan,
          cellRendererParams: {
            clicked: function (field) {
              alert(`${field} was clicked`);
            },
          },
        width: 150,
        pinned: 'right'
    }
]

export const COLUMNS_SPAREPART =[
    {
        headerName: 'Item',
        field : 'nama_item',
        width: 250,
        maxWidth:375,
        suppressSizeToFit: true,
        pinned: 'left',
        filter: 'agTextColumnFilter',
        headerCheckboxSelection: true,
        checkboxSelection: true,
        showDisabledCheckboxes: true,
    },
    {
        headerName: 'Unit',
        field : 'unit',
        width: 95,
        maxWidth:105,
    },
    {
        headerName: 'Stok',
        field : 'stok',
        width: 95,
        maxWidth:155,
    },
    {
        headerName: 'Pengeluaran Akhir',
        field : 'pengeluaran',
        width: 115,
        maxWidth:155,
    },
    {
        headerName: 'Tgl Keluar',
        field : 'tgl_keluar',
        width: 115,
        maxWidth:155,
    },
    {
        headerName: 'Buffer',
        field : 'buffer',
        width: 100,
        maxWidth:115,
    },
    {
        headerName: 'Maksimal Stok',
        field : 'maks_Stok',
        width: 100,
        maxWidth:115,
    },
    {
        headerName: 'Status',
        field : 'status_item',
        width: 105,
        cellStyle: function(params) {
            console.log(params.value)
            if (params.value ==='STOCK LIMIT') {
                return {color: '#800000', backgroundColor: '#d07979a7', borderRadius: '8px', height: 30, lineHeight: 2, marginTop: '5px',textAlign: 'center'};
                
            }
            else if (params.value ==='PENGAJUAN') {
                return {color: '#918413', backgroundColor: '#e7d32260', borderRadius: '8px', height: 30, lineHeight: 2, marginTop: '5px',textAlign: 'center'};
            }
            else if (params.value ==='ORDER') {
                return {color: '#120cce', backgroundColor: '#120cce60', borderRadius: '8px', height: 30, lineHeight: 2, marginTop: '5px',textAlign: 'center'};
            }
            else if (params.value ==='AMAN') {
                return {color: '#008011', backgroundColor: '#38cc4c73', borderRadius: '8px', height: 30, lineHeight: 2, marginTop: '5px',textAlign: 'center'};
            }
            else if (params.value ==='TIDAK AKTIF') {
                return {color: '#7a0080', backgroundColor: '#a35ea6c4', borderRadius: '8px', height: 30, lineHeight: 2, marginTop: '5px',textAlign: 'center'};
            }
            else {
                return null;
            }
        }
    },
    {
        headerName: 'Tgl Pengajuan',
        field : 'tgl_pengajuan',
        width: 130,
        maxWidth:155,
    },
    {
        headerName: 'Tgl Order',
        field : 'tgl_order',
        width: 130,
        maxWidth:155,
    },
    {
        field : 'Action',
        headerName: 'Action',
        cellRenderer: BtnSparepart,
          cellRendererParams: {
            clicked: function (field) {
              alert(`${field} was clicked`);
            },
          },
        width: 150,
        pinned: 'right'
    }
]

export const COLUMNS_BOM =[
    {
        headerName: 'ID',
        field : 'id_bom',
        width: 120,
        suppressSizeToFit: true,
        filter: 'agTextColumnFilter',
    },
    {
        headerName: 'No BOM',
        width: 100,
        maxWidth:350,
        field : 'no_bom',
    },
    {
        headerName: 'No. Item',
        field : 'id_item',
        width: 80,
        maxWidth:175,
    },
    {
        headerName: 'Deskripsi Item',
        field : 'deskripsi_item',
        width: 500,
        maxWidth:755,
    },
    {
        headerName: 'Varian',
        field : 'varian',
        width: 100,
        maxWidth:255,
    },
    {
        headerName: 'Revisi',
        field : 'revisi',
        width: 100,
        maxWidth:255,
    },
    {
        field : '',
        headerName: 'Action',
        cellRenderer: BtnBom,
        width: 120,
        pinned: 'right'
    }
]

/* export const COLUMNS_PERMINTAAN =[
    {
        headerName: 'Item',
        field : 'nama_item',
        width: 150,
        maxWidth:175,
        suppressSizeToFit: true,
        pinned: 'left',
        filter: 'agTextColumnFilter',
    },
    {
        headerName: 'Estimasi',
        field : 'jmlEstimasi',
        valueGetter: params => {
            let nilai  = (parseFloat(params.data.jml_item[0].jmlEstimasi)*1000)/1000;
            return nilai;
        },
        width: 105,
        maxWidth:155,
        cellStyle: function(params) {
            return {textAlign: 'right',fontWeight: "bold"};
        }
    },
    {
        headerName: 'Permintaan',
        field : 'JmlPermintaan',
        valueGetter: params => {
            let nilaiPermint  = (parseFloat(params.data.jml_item[0].JmlPermintaan)*1000)/1000;
            return nilaiPermint;
        },
        width: 125,
        maxWidth:155,
        cellStyle: function(params) {
            return {textAlign: 'right',fontWeight: "bold"};
        }
    },
    {
        headerName: 'Pengeluaran',
        field : 'JmlPengeluaran',
        valueGetter: params => {
            let nilaiKeluar  = (parseFloat(params.data.jml_item[0].JmlPengeluaran)*1000)/1000;
            return nilaiKeluar;
        },
        width: 135,
        maxWidth:155,
        cellStyle: function(params) {
            return {textAlign: 'right',fontWeight: "bold"};
        }
    },
    {
        headerName: 'satuan',
        field : 'satuan',
        width: 100,
        maxWidth:115,
    },
    {
        headerName: 'Status Item',
        field : 'status_item',
        width: 105,
        cellStyle: function(params) {
            if (params.value ==='Pengajuan') {
                return {color: '#800000', backgroundColor: '#d07979a7', borderRadius: '8px', height: 30, lineHeight: 2, marginTop: '5px',textAlign: 'center',fontWeight: "bold"};
                
            }
            else if (params.value ==='Progress') {
                return {color: '#918413', backgroundColor: '#e7d32260', borderRadius: '8px', height: 30, lineHeight: 2, marginTop: '5px',textAlign: 'center',fontWeight: "bold"};
            }
            else if (params.value ==='Verify') {
                return {color: '#120cce', backgroundColor: '#120cce60', borderRadius: '8px', height: 30, lineHeight: 2, marginTop: '5px',textAlign: 'center',fontWeight: "bold"};
            }
            else if (params.value ==='Selesai') {
                return {color: '#008011', backgroundColor: '#38cc4c73', borderRadius: '8px', height: 30, lineHeight: 2, marginTop: '5px',textAlign: 'center',fontWeight: "bold"};
            }
            else if (params.value ==='Revisi') {
                return {color: '#7a0080', backgroundColor: '#a35ea6c4', borderRadius: '8px', height: 30, lineHeight: 2, marginTop: '5px',textAlign: 'center',fontWeight: "bold"};
            }
            else {
                return null;
            }
        }
    },
    {
        headerName: 'Waktu Kirim',
        field : 'Waktu Kirim',
        width: 130,
        maxWidth:155,
        valueGetter: params => {
            return params.data.waktu[0].jamPengiriman;
        },
        cellStyle: function(params) {
            return {textAlign: 'center',fontWeight: "bold"};
        }
    },
    {
        headerName: 'List',
        field : 'list_data',
        width: 300,
        maxWidth:405,
    },
    {
        field : 'Action',
        headerName: 'Action',
        cellRenderer: BtnPermintaan,
          cellRendererParams: {
            clicked: function (field) {
              alert(`${field} was clicked`);
            },
          },
        width: 160,
        pinned: 'right'
    }
] */