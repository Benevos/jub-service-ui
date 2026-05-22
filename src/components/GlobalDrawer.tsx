"use client";

import { toggleDrawer } from '@/lib/features/drawer/drawerSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { Drawer, Icon, Tooltip, useMediaQuery, useTheme } from '@mui/material'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
import { PiNetwork, PiNetworkFill } from 'react-icons/pi';

function GlobalDrawer() {

    const paths = [
        {
            route: "/",
            name: "Servicios",
            icon: PiNetworkFill
        },
    ]

    const dispatch = useAppDispatch()

    const open = useAppSelector(state => state.drawer.open)

    const pathname = usePathname()

    const theme = useTheme();
    const isOnMoblieSize = useMediaQuery(theme.breakpoints.down('md'));

    const handleClose = () =>
    {
        dispatch(toggleDrawer())
    }

    return (
        <Drawer 
            open={open} 
            variant={"persistent"}
            hideBackdrop
            sx={{
                [`& .MuiDrawer-paper`]: {
                    top: "55px", 
                    height: "calc(100dvh-55px)",
                    boxShadow: "none",
                    borderRightWidth: "1px",
                    borderColor: "#e6e6e6",
                    width: !isOnMoblieSize ? "60px" : "200px"
                }
            }}>
                <div className='w-full h-full flex flex-col items-center gap-1 pt-2 max-md:items-start max-md:px-2'>

                    {
                        paths.map(path => (
                            <Link key={path.route} href={path.route} className='w-full'>
                                <div className='w-full'>
                                    <Tooltip title={path.name} placement='right' className='w-full'>
                                        <div className={`flex justify-center max-md:justify-start max-md:items-center max-md:gap-5 max-md:rounded-md 
                                                        ${pathname === path.route && isOnMoblieSize ? 'max-md:bg-[#e6e6e6]' : ""}`}>
                                            <div className={`flex items-center justify-center transition-all w-10 h-10 rounded-md
                                                            hover:bg-[#e6e6e6] ${pathname === path.route && !isOnMoblieSize ? "bg-[#e6e6e6]" : ""}`}>
                                                <path.icon size={25} color={`${pathname === path.route ? 'black' : '#757575'}`}/>
                                            </div>


                                            {
                                                isOnMoblieSize ?
                                                    <div className='font-bold text-sm md:hidden '>
                                                        {path.name}
                                                    </div>
                                                :
                                                    <></>
                                            }

                                            
                                        </div>
                                    </Tooltip>
                                </div>
                            </Link>
                        ))
                    }

                    
                </div>
        </Drawer>
    )
}

export default GlobalDrawer