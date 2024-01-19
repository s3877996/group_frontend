import React from "react";
import Navbar from "../components/Navigation/Navbar"
import FileRender from "../components/FileRender/FileRender";

const HomePage = ()  =>{

    return (
<div className="flex flex-col ">
    <header className="fixed top-0 w-full">
        <Navbar/>
    </header>
    <main className="flex-grow bg-white-700 overflow-auto pt-12"> {/* Add padding-top to prevent content being hidden by the fixed navbar */}
        <div className="mx-auto max-w-screen-xl h-full w-full">
            <FileRender/>
        </div>
    </main>
</div>

    );
}
export default HomePage;
