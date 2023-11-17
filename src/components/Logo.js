import * as React from "react";
import logo from "../image/logo.png"

const Logo = () =>{
    return(
        <img src={logo} className="hidden md:block cursor-pointer" height="100" width="100" alt="logo">
            
        </img>
    );

}

export default Logo;