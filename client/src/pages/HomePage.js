import React from "react";
import Navbar from "../components/Navigation/Navbar"
import FileRender from "../components/FileRender/FileRender";

const HomePage = ()  =>{

    return (
      <div className="flex flex-col ">
        <main className="flex-grow bg-white-700 overflow-auto">
            <div className="mx-auto max-w-screen-xl h-full w-full">
              <Navbar/>

              <div className="flex flex-col items-center justify-center min-h-screen">
                  {/* File Upload and Display */}
                  <div className="w-full lg:w-3/4 xl:w-2/3 px-4 py-6">
                      <FileRender/>
                  </div>
              </div>
            </div>
        </main>
      </div>
    );
}
export default HomePage;