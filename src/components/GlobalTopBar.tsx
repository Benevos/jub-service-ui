"use client";

import { toggleDrawer } from '@/lib/features/drawer/drawerSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { IconButton } from '@mui/material'
import React from 'react'
import { MdMenu } from 'react-icons/md'

function GlobalTopBar() 
{
    const dispatch = useAppDispatch()

    const openDrawer = useAppSelector(state => state.drawer.open)

    const handleClick = () =>
    {
        dispatch(toggleDrawer())
    }

    return (
        <>
            <div className="bg-white h-[55px] fixed top-0 w-full border-b border-b-[#e6e6e6] z-50">
                <div className="h-full flex items-center justify-start px-1">
                <IconButton onClick={handleClick}>
                    <MdMenu size={35} 
                        className='transition-all' 
                        style={{
                            transform: openDrawer ? "rotate(90deg)" : "rotate(0deg)"
                    }}/>
                </IconButton>
                </div>
            </div>

            <div className="h-[55px]"/>
        </>
    )
}

export default GlobalTopBar