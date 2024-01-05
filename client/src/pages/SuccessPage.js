import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import success from "../image/success.png";
import api from '../api';
import Navbar from "../components/Navigation/Navbar";

const SuccessPage = () => {

    const navigate = useNavigate();

    const toggleButtonSuccess = () => {
        navigate('/home');
    }

    return (
        <div className="flex flex-col ">
            <main className="flex-grow bg-white-700 overflow-auto">
                <div className="mx-auto max-w-screen-xl h-full w-full">
                    <Navbar/>
                </div>
                    < div className = "w-full min-h-[80vh] flex flex-col justify-center items-center" >
                        < div className = "my-50 text-green-600 text-2xl mx-auto flex flex-col justify-center items-center" >
                            < img
                                src = {success}
                                alt = ""
                                width = {220}
                                height = {220}
                            />
                            <h3 className="text-4xl pt-20 lg:pt-0 font-bold text-center text-slate-700">
                                Payment Successfully
                            </h3>
                            <button onClick={toggleButtonSuccess} className="w-40 uppercase bg-[#009C96] text-white text-xl my-16 px-2 py-2 rounded">
                                Home Page
                            </button>
                        </div>
                    </div>
            </main>
        </div>
    )
}

export default SuccessPage
