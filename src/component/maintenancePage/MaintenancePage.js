import React from 'react';
import './maintenancePage.css';

export const MaintenancePage = () => {
  return (
    <div className='maintenancePage'>
        <div className='maintenanceWidget'>
          <span className='icon'>
          <i class="bi bi-gear"></i>
          </span>
          <span className='title'>
              <h3>Under Maintenance</h3>
          </span>
        </div>
    </div>
  )
}
