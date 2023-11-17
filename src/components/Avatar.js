import avatar from "../image/avatar.png"

const Avatar = () =>{
    return(
        <img className="rounded-full" height="30" width="30" src={avatar} alt = {avatar}></img>
    );

}

export default Avatar;