import React, { useState } from 'react';
import { Chart } from 'primereact/chart';
import * as chartData from '../../data/chart'

const Charts = () => {
    const [basicData] = useState({
        labels: chartData.basicLabels,
        datasets: chartData.basicDatasets
    });

    const [pieChartData] = useState({
        labels: chartData.pieChartLabels,
        datasets: chartData.pieChartDatasets
    });

    const { basicOptions } = chartData.getDarkTheme();
    const { pieChartOptions } = chartData.getDarkTheme();

    return (
      
    <div className='w-full h-[calc(100vh-5rem)]'>

        <div className="flex h-1/2 mb-[1rem]">
            <div className='primary-box w-9/12 h-full'>
                <Chart type="line" height='100%' data={basicData} options={basicOptions} />
            </div>
            <div className='primary-box w-3/12 h-full ml-[1rem]'>
                <Chart type="pie" height='75%' data={pieChartData} options={pieChartOptions} />
            </div>
        </div>
        
        <div className="flex h-1/2">
            <div className='primary-box w-9/12 h-full'>
                <Chart type="bar" height='100%' data={basicData} options={basicOptions} />
            </div>
            <div className='primary-box w-3/12 h-full ml-[1rem]'>
                <Chart type="doughnut" height='75%' data={pieChartData} options={pieChartOptions} />
            </div>
        </div>


      {/* <div className="card">
          <h5>Horizontal</h5>
          <Chart type="bar" data={basicData} options={horizontalOptions} />
      </div>

      <div className="card">
          <h5>Multi Axis</h5>
          <Chart type="bar" data={multiAxisData} options={multiAxisOptions} />
      </div> */}

      {/* <div className="card">
          <h5>Stacked</h5>
          <Chart type="bar" data={basicData} options={basicOptions} />
      </div> */}
    </div>
    )
}

export default Charts
