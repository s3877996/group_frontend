import React from "react";
import Navbar from "../components/Navigation/Navbar"
import FileRender from "../components/FileRender/FileRender";

const HomePage = ()  =>{

    return (
      <div className="flex flex-col ">
        <main className="flex-grow bg-white-700 overflow-auto">
            <div className="mx-auto max-w-screen-xl h-full w-full">
              <Navbar/>
              <FileRender/>
            </div>
        </main>
      </div>
    );
}
export default HomePage;
