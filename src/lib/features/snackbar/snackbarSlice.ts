import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SnackbarSeverity =
    | "success"
    | "error"
    | "warning"
    | "info";

type SnackbarVerticalPosition =
    | "top"
    | "bottom";

type SnackbarHorizontalPosition =
    | "left"
    | "center"
    | "right";

type SnackbarState = {
    open: boolean;
    message: string;
    severity: SnackbarSeverity;
    autoHideDuration: number;

    anchorOrigin: {
        vertical: SnackbarVerticalPosition;
        horizontal: SnackbarHorizontalPosition;
    };
};

const initialState: SnackbarState = {
    open: false,

    message: "",

    severity: "info",

    autoHideDuration: 3000,

    anchorOrigin: {
        vertical: "bottom",
        horizontal: "left",
    },
};

type ShowSnackbarPayload = {
    message: string;

    severity?: SnackbarSeverity;

    autoHideDuration?: number;

    anchorOrigin?: {
        vertical?: SnackbarVerticalPosition;
        horizontal?: SnackbarHorizontalPosition;
    };
};

export const snackbarSlice = createSlice({
    name: "snackbar",

    initialState,

    reducers: {

        showSnackbar: (
            state,
            action: PayloadAction<ShowSnackbarPayload>
        ) => {

            const {
                message,
                severity,
                autoHideDuration,
                anchorOrigin,
            } = action.payload;

            state.open = true;

            state.message = message;

            state.severity =
                severity ?? "info";

            state.autoHideDuration =
                autoHideDuration ?? 3000;   

            state.anchorOrigin = {
                vertical:
                    anchorOrigin?.vertical ?? "bottom",

                horizontal:
                    anchorOrigin?.horizontal ?? "left",
            };
        },

        hideSnackbar: (state) => {
            state.open = false;
        },
    },
});

export const {
    showSnackbar,
    hideSnackbar,
} = snackbarSlice.actions;

export default snackbarSlice.reducer;