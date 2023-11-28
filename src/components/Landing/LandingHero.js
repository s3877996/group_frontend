import React from 'react';
import { Link } from 'react-router-dom';
import TyperWriterComponent from "typewriter-effect";
import { Button } from '@mui/material';

const LandingHero = () => {
  return (
    <div className="text-green-500 font-bold py-36 text-center space-y-5">
      <div className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold leading-normal">
        <h1>The Best AI Tool for </h1>
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 ">
          <TyperWriterComponent options={{strings: ["Grammar.","Tone.","Punctuation.","Wordiness."
          ],
            autoStart:true,
            loop: true,
          }}/>
        </div>
      </div>

      <div className="text-sm md:text-xl font-light text-zinc-400">
        Instantly generate clear, compelling writing while maintaining your unique voice.
      </div>

      <div>
        <Link to="/login">
        <Button variant="contained" color="success" sx={{ 
            borderRadius: '50px', 
            textTransform: 'none', 
            fontWeight: 'bold',
            backgroundImage: 'linear-gradient(to right, #7C3AED, #EC4899)', 
            '&:hover': {
              backgroundImage: 'linear-gradient(to right, #7C3AED, #EC4899)',
            },
          }}>
            Get Generating For Free
        </Button>


        </Link>
      </div>
    </div>
  )
}

export default LandingHero;
