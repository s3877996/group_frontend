import React from "react";
import Navbar from "../components/Navigation/Navbar"
import FileRender from "../components/FileRender/FileRender";

const HomePage = ()  =>{

    return (
      <div className="flex flex-col ">
        <main className="flex-grow bg-white-700 overflow-auto">
            <div className="mx-auto max-w-screen-xl h-full w-full">
              <Navbar/>

              <div className="flex min-h-screen justify-center">
                {/*Insert file in the left-hand side container*/}
                <div className="sm:w-1/2 bg-white-500 text-white flex items-center justify-center">
                  <FileRender/>
                </div>
                {/*Insert file in the left-hand side container*/}

                {/*Right hand side Container*/}
                <div className="sm:w-1/2 bg-white flex items-center justify-center">
                  <h1>File after adjust</h1>
                </div>
                {/*Right-hand side Container*/}

               </div>
            </div>
        </main>
      </div>
    );
}
export default HomePage;