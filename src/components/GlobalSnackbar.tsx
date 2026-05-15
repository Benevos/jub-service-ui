"use client";

import React from "react";
import { Alert, Snackbar } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { hideSnackbar } from "@/lib/features/snackbar/snackbarSlice";

function GlobalSnackbar() {

    const dispatch = useAppDispatch();

    const snackbar = useAppSelector((state) => state.snackbar);

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") return;

        dispatch(hideSnackbar());
    };

    return (
        <Snackbar
            open={snackbar.open}
            autoHideDuration={snackbar.autoHideDuration}
            onClose={handleClose}
            anchorOrigin={{
                horizontal: snackbar.anchorOrigin.horizontal,
                vertical: snackbar.anchorOrigin.vertical
            }}
        >
            <Alert
                onClose={handleClose}
                severity={snackbar.severity}
                variant="filled"
                sx={{ width: "100%" }}
            >
                {snackbar.message}
            </Alert>
        </Snackbar>
    );
}

export default GlobalSnackbar;