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
        <div className="flex h-full">
          <div className='w-9/12'>
            <div className="flex mb-[1rem]">
              <TotalPandL />
              <ChargesandTaxes />
              <OtherCredits />
            </div>
            <DashboardChart />
          </div>
          <div className='w-3/12'>
            <div className="flex flex-col h-full">
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