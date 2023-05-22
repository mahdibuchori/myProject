import React, { useMemo } from 'react';
import './pengadaan.css';
import { Tablepengadaan } from './Tablepengadaan';
import { COLUMNS_PENGADAAN } from '../../../datafile/columns';

export const Pengadaan = () => {
    const columns = useMemo(() => COLUMNS_PENGADAAN, []);
  return (
    <div className='pengadaan'>
      <Tablepengadaan columns={columns}/>
    </div>
  )
}
