import React, { useState, useCallback } from 'react';
import {AiOutlineMenu} from 'react-icons/ai'
import Avatar from './Avatar'
import MenuItem from './MenuItem'
import { useNavigate } from 'react-router-dom';
import {
    CubeTransparentIcon,
    UserCircleIcon,
    CodeBracketSquareIcon,
    Square3Stack3DIcon,
    ChevronDownIcon,
    Cog6ToothIcon,
    InboxArrowDownIcon,
    LifebuoyIcon,
    PowerIcon,
    RocketLaunchIcon,
    QueueListIcon,
    Bars2Icon,
    ReceiptRefundIcon,
    HomeIcon,
    CreditCardIcon,
   
} from "@heroicons/react/24/solid";
//import { MenuItem } from '@mui/material';
import { useAuth } from '../../provider/authProvider';

const UserMenu = () =>{
    const { setToken } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = useCallback(() => {
        setIsOpen((value) => !value)
    },[]);
    
    const handleSignOut = () => {
        setToken();
        navigate('/');
    }

    const handleUserProfile = () => {
        navigate('/userprofile');
    }

    const handleProfileToggling = () => {
        navigate('/profile');
    }

    const handleSubscriptionToggling = () => {
        navigate('/subscription');
    }

    const handleDocumentHistory = () => {
        navigate('/document_history');
    }

    const handleHome = () => {
        navigate('/home');
    }

    return(
        <div className="relative">
            <div className="flex flex-row items-center gap-3">
                <div onClick={() => {}} className="hidden md:block text-sm font-semibold py-3 px-4 roundded-full hover:bg-neutral-100 transition cursor-pointer">
                An AI Writing Partner 
                </div>
                <div onClick={toggleOpen} className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition">
                    <AiOutlineMenu/>
                    <div className="hidden md:block">
                        <Avatar/>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm">

                    <div className="flex flex-col cursor-pointer">
                    <>
                        <MenuItem onClick={handleHome} label="Home" Icon={HomeIcon} />
                        <MenuItem onClick={handleUserProfile} label="My Profile" Icon={UserCircleIcon}/>
                        <MenuItem onClick={handleSubscriptionToggling} label="My Subscription" Icon={CreditCardIcon}/>
                        <MenuItem onClick={handleProfileToggling} label="Detail Information" Icon={ReceiptRefundIcon}/>
                        <MenuItem onClick={handleDocumentHistory} label="Document History" Icon={QueueListIcon}/>
                        <hr/>
                        <MenuItem onClick={handleSignOut} label="Sign Out" Icon={() => <PowerIcon className="text-red-500 mr-2 h-5 w-5"/>} />

                     </>
                    </div>
                </div>
            )}



        </div>
    );

}

export default UserMenu;