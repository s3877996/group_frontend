import * as React from "react";
import logo from "../../image/logo.png"

const Logo = () =>{
    return(
        <img src={logo} className="hidden md:block cursor-pointer" height="200" width="200" alt="logo">
            
        </img>
    );

}

export default Logo;