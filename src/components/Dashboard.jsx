import React from 'react'
import '../styles/dashboard.scss'
import Navbar from './Navbar';
import TotalPandL from './TotalPandL';
import ChargesandTaxes from './ChargesandTaxes';
import OtherCredits from './OtherCredits';
import WinsAndLosses from './WinsAndLosses';
import RecentTrades from './RecentTrades';
import Charts from './Charts';

function Dashboard() {
  return (
    <section className='dashboard text-white h-full w-full'>
      <Navbar />
      <div className='dashboard-container'>
        <TotalPandL />
        <ChargesandTaxes />
        <OtherCredits />
        <Charts />
        <WinsAndLosses />
        <RecentTrades />
      </div>
    </section>
  )
}

export default Dashboard