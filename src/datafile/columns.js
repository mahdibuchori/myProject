import { BtnStok } from '../page/forms/datastok/BtnStok';
import { BtnProvider } from '../page/forms/eksternalProvider/BtnProvider';
import { BtnPengadaan } from '../page/forms/pengadaan/BtnPengadaan';

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
        maxwidth:175,
    },
    {
        headerName: 'S_Akhir',
        field : 'saldo_akhir',
        width: 100,
        maxwidth:175,
    },
    {
        headerName: 'Rtrn Prod',
        field : 'ret_prod',
        width: 150,
        maxwidth:255,
    },
    {
        headerName: 'Permintaan Prod',
        field : 'perm_prod',
        width: 150,
        maxwidth:255,
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
        maxwidth:350,
        field : 'nama_provider',
    },
    {
        headerName: 'Telephon',
        field : 'tlp_provider',
        width: 150,
        maxwidth:175,
    },
    {
        headerName: 'Alamat',
        field : 'almt_provider',
        width: 500,
        maxwidth:755,
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
        maxwidth:155,
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
        maxwidth:155,
        pinned: 'left'
    },
    {
        headerName: 'Tanggal',
        field : 't_pengadaan',
        width: 110,
        maxwidth:115,
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
        maxwidth:105,
    },
    {
        headerName: 'Unit',
        field : 'satuan',
        valueGetter: params => {
            let nilai  = params.data.qty_pengadaan[0].satuan;
            return nilai;
        },
        width: 80,
        maxwidth:95,
    },
    {
        field : 'status',
        width: 100,
        maxwidth:115,
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
        maxwidth: 450
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