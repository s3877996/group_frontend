import * as React from "react";
import logo from "../../image/logo1.png"
import {useNavigate} from "react-router-dom";

const AdminLogo = () =>{
    const navigate = useNavigate();
    const handleHome = () => {
        navigate('/admin/dashboard');
    }
    return(
        <img src={logo} className="hidden md:block cursor-pointer" height="200" width="200" alt="logo" onClick={handleHome}>

        </img>
    );

}

export default AdminLogo;