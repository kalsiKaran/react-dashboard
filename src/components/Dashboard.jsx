import React from 'react'
import '../styles/dashboard.scss'
import Navbar from './Navbar';
import TotalPandL from './TotalPandL';
import ChargesandTaxes from './ChargesandTaxes';
import OtherCredits from './OtherCredits';
import WinsAndLosses from './WinsAndLosses';
import RecentTrades from './RecentTrades';
import DashboardChart from './DashboardChart';

function Dashboard() {
  return (
    <section className='dashboard text-white h-full w-full'>
      <Navbar />
      <div className='dashboard-container'>
        <div className="block md:flex h-full">
          <div className='w-full md:w-9/12'>
            <div className="block md:flex mb-[1rem]">
              <TotalPandL />
              <ChargesandTaxes />
              <OtherCredits />
            </div>
            <DashboardChart />
          </div>
          <div className='w-full md:w-3/12'>
            <div className="block md:flex flex-col h-full">
              <WinsAndLosses />
              <RecentTrades />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Dashboard