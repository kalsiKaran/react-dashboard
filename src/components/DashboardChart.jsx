import React, { useState } from 'react';
import { Chart } from 'primereact/chart';
import { basicLabels, basicDatasets, getDarkTheme } from '../data/chart';

const DashboardChart = () => {
    const [basicData] = useState({
        labels: basicLabels,
        datasets: basicDatasets
    });

    const { basicOptions } = getDarkTheme();

    return (
      
    <div className='mr-0 md:mr-4 chart'>
      <div className='col-span-3 primary-box w-full h-full'>
        <Chart type="line" height='100%' data={basicData} options={basicOptions} />
      </div>
    </div>
    )
}

export default DashboardChart
