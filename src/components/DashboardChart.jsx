import React, { useState } from 'react';
import { Chart } from 'primereact/chart';

const DashboardChart = () => {
    const [basicData] = useState({
        labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'My First dataset',
                backgroundColor: '#42A5F5',
                data: [20, 12, 14, 30, 40, 20, 80, 75, 60, 90, 90, 100],
                borderColor: '#42A5F5',
                tension: .4,
            },
        ]
    });

    const getLightTheme = () => {
        let basicOptions = {
            maintainAspectRatio: false,
            aspectRatio: .8,
            plugins: {
                legend: {
                    labels: {
                        color: '#ced4da'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ced4da'
                    },
                    grid: {
                        color: '#495057'
                    }
                },
                y: {
                    ticks: {
                        color: '#ced4da'
                    },
                    grid: {
                        color: '#495057'
                    }
                }
            }
        };

        return { basicOptions }
    }

    const { basicOptions } = getLightTheme();

    return (
      
    <div className='chart'>
      <div className='col-span-3 primary-box w-full h-full'>
        <Chart type="line" height='100%' data={basicData} options={basicOptions} />
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

export default DashboardChart
