"use client";

import { setAuth } from "@/lib/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { MdErrorOutline } from "react-icons/md";

function ProtectedRoute<P extends object>(
    Component: React.ComponentType<P>
) {
    return function ProtectedComponent(props: P) {

        const dispatch = useAppDispatch();

        const auth = useAppSelector(state => state.auth);

        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);

        const getAuth = async () => 
        {
            try {

                setLoading(true);
                setError(null);

                const response = await fetch(
                    "https://apix.tamps.cinvestav.mx/jub/api/v2/users/auth",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            username: "invitado",
                            password: "invitado",
                            scope: "jub",
                            expiration: "24h",
                            renew_token: false
                        })
                    }
                );

                if (!response.ok) {
                    throw new Error("No se pudo autenticar el usuario.");
                }

                const data = await response.json();

                dispatch(setAuth(data));

            } catch (error) {

                console.error(error);

                setError(
                    error instanceof Error
                        ? error.message
                        : "Ocurrió un error inesperado."
                );

            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            getAuth();
        }, []);

        if(loading) 
        {
            return (
                <main className="h-dvh w-full flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
                    
                    <div className="flex flex-col items-center gap-5 px-8 py-10 rounded-3xl bg-white shadow-2xl">
                        
                        <div className="h-12 w-12 rounded-full border-4 border-gray-600 border-t-black animate-spin" />

                        <div className="flex flex-col items-center gap-1">
                            <h1 className="text-black text-xl font-semibold tracking-wide">
                                Autenticando
                            </h1>

                            <p className="text-[#757575] text-sm text-center max-w-[280px] leading-relaxed">
                                Verificando credenciales y preparando acceso al ecosistema JUB.
                            </p>
                        </div>

                    </div>

                </main>
            )
        }


        if (error || !auth.access_token) {
            return (
                <main className="h-dvh w-full flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">

                    <div className="flex flex-col items-center gap-5 px-8 py-10 rounded-3xl bg-white shadow-2xl max-w-[380px]">

                        <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center">
                            <MdErrorOutline className="text-red-600 text-3xl" />
                        </div>

                        <div className="flex flex-col items-center gap-2">

                            <h1 className="text-black text-xl font-semibold tracking-wide text-center">
                                Error de autenticación
                            </h1>

                            <p className="text-red-500 text-sm text-center leading-relaxed">
                                {error ?? "No se pudo validar la sesión del usuario."}
                            </p>

                        </div>

                        <Button onClick={getAuth} variant="contained" color="error">
                            Reintentar
                        </Button>

                    </div>

                </main>
            );
        }

        return <Component {...props} />;
    };
}

export default ProtectedRoute;