import { BtnStok } from '../page/forms/datastok/BtnStok';

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
        headerName: 'Saldo Awal',
        field : 'saldo_awal',
        width: 80,
        maxwidth:175,
    },
    {
        headerName: 'Saldo Akhir',
        field : 'saldo_akhir',
        width: 80,
        maxwidth:175,
    },
    {
        headerName: 'Return Produksi',
        field : 'ret_prod',
        width: 150,
        maxwidth:255,
    },
    {
        headerName: 'Permintaan Produksi',
        field : 'perm_prod',
        width: 150,
        maxwidth:255,
    },
    {
        headerName: 'Tipe',
        field : 'tipe_barng',
        width: 100,
        maxwidth:255,
    },
    {
        field : '',
        headerName: 'Action',
        cellRenderer: BtnStok,
        width: 120,
        pinned: 'right'
    }
]