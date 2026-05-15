import React, { useEffect, useState } from 'react'
import { TbFolderOff } from 'react-icons/tb'

function NoDataScreen() 
{
    return (
        <div className='h-[600px] max-md:h-[300px] bg-black flex items-center justify-center'>
            <div className='flex flex-col items-center mb-2'>
                <TbFolderOff color='white' size={40}/>

                <span className='text-white font-bold my-2'>
                    Sin datos ligados
                </span>
            </div>
        </div>
    )
}

export default NoDataScreen