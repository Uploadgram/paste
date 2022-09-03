import { CssBaseline, ThemeProvider } from "@mui/material";
import {StrictMode} from "react";
import {render} from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { theme } from "./themes";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ThemeProvider>
    </StrictMode>,
    document.getElementById('root')
);

serviceWorkerRegistration.register();