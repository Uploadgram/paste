import { CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { theme } from "./themes";

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
);