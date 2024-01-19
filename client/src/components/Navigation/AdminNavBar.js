import React from 'react';
import Container from "@mui/material/Container";
import Logo from './Logo'
import Search from './Search'
import AdminMenu from './AdminMenu';

const AdminNavBar = () => {
    return (
        <div className="fixed w-full bg-white z-10 shadow-sm">
            <div className="py-4 border-b-[1px]">
                <Container>
                    <div className="flex flex-row items-center justify-between gap-2 md:gap-0">
                        <Logo/>
                        <AdminMenu/>
                    </div>

                </Container>
                
            </div>
        </div>
    )
};

export default AdminNavBar;