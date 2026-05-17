"use client";

import React from "react";
import { Button } from "@mui/material";
import { LuFileQuestion } from "react-icons/lu";
import { useRouter } from "next/navigation";

function NotFound() {
    const router = useRouter();

    return (
        <main className="h-dvh w-full flex items-center justify-center bg-[#f5f5f5] px-4">

            <div className="bg-white rounded-3xl shadow-2xl px-10 py-12 flex flex-col items-center gap-6 max-w-[500px] w-full">

                <div className="h-20 w-20 rounded-full bg-[#e6e6e6] flex items-center justify-center">
                    <LuFileQuestion size={42} />
                </div>

                <div className="flex flex-col items-center gap-2">

                    <h1 className="text-4xl font-black tracking-tight">
                        404
                    </h1>

                    <span className="text-xl font-semibold text-center">
                        Página no encontrada
                    </span>

                    <p className="text-[#757575] text-center leading-relaxed max-w-[360px]">
                        La página que intentas visitar no existe o fue movida dentro del ecosistema JUB.
                    </p>

                </div>

                <Button
                    variant="contained"
                    onClick={() => router.push("/")}
                    sx={{
                        backgroundColor: "black",
                        "&:hover": {
                            backgroundColor: "#1a1a1a",
                        },
                    }}
                >
                    Volver al inicio
                </Button>

            </div>

        </main>
    );
}

export default NotFound;