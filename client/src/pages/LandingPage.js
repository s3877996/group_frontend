import React from 'react'
import LandingNavBar from "../components/Landing/LandingNavBar"
import LandingHero from "../components/Landing/LandingHero" 
import HomeFooter from "../components/Footer/HomeFooter" 

const LandingPage = () => {
  return (
    
    // <div className="h-full">
    //     <LandingNavBar/>
    //     <LandingHero/>
    // </div>

    <div className="flex flex-col min-h-screen">
        <main className="flex-grow bg-white-700 overflow-auto">
            <div className="mx-auto max-w-screen-xl h-full w-full">
                <LandingNavBar/>
                <LandingHero/>
            </div>
        </main>
        <HomeFooter/>
    </div>
  )
}

export default LandingPage