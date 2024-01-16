import React from 'react'
import { Link } from 'react-router-dom';
import icon from "../../image/icon1.png"
import { Button } from '@mui/material';
// import Button from './Button';

const LandingNavBar = () => {
  return (
    <div className="p-4 bg-transparent flex items-center justify-between">
        <Link to="/login" className="flex items-center">
            <div className="realative h-8 w-8 mr-4"></div>
                <img className="h-12 w-12" alt={icon} src={icon}>
                </img>
                <h1 className="text-2xl font-bold text-green-600 font-serif ">ProsePilot</h1>
        </Link>

        <div className="flex items-center gap-x-2">
             <Link to="/login" className="flex items-center">
                <Button variant="contained" color="success" sx={{ borderRadius: '50px', textTransform: 'none', fontWeight: 'bold'}}>Get Started</Button>
             </Link>

        </div>
    </div>
  )
}

export default LandingNavBar;