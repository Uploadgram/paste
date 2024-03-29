import { CircularProgress, Fab, GlobalStyles, Icon, Alert, AlertTitle, Snackbar } from "@mui/material";
import React, { createRef, useEffect, useState } from "react";
import { savePaste, UploadFailedError } from "../api";
import { buildPasteUri } from "../utils";
import { useNavigate } from 'react-router-dom';
import PastegramAppBar from "./PastegramAppBar";

const styles = <GlobalStyles styles={{ textarea: {
    flexGrow: 1,
    background: 'none',
    border: 'none',
    fontSize: '1rem',
    color: 'rgb(186, 186, 186)',
    padding: '16px 26px',
    outline: 'none',
    fontFamily: "'Cascadia Code', 'Cascadia Mono', 'Source Code Sans Pro', 'Courier New', Courier, monospace",
    resize: 'none',
}}} />

export default function Home()
{
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string|null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const textAreaRef = createRef<HTMLTextAreaElement>();
    let isMounted = true;
    useEffect(() => {
        return () => {
            isMounted = false;
        }
    }, []);

    async function saveAction() {
        setIsLoading(true);
        try {
            if (!textAreaRef.current?.value?.replace(/ /g, '')) return;
            const paste = await savePaste(textAreaRef.current!.value);
            navigate(buildPasteUri(paste));
        } catch (e) {
            setSnackbarOpen(true);
            if (e instanceof UploadFailedError) return setError(e.message);
            if (e instanceof Error) return setError(e.name + ': ' + e.message);
            setError((e as any).toString());
        } finally {
            if (isMounted) setIsLoading(false);
        }
        
    }

    function keyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) 
    {
        if (event.ctrlKey && (event.key === 's' || event.key === 'S'))
        {
            event.stopPropagation();
            event.preventDefault();
            saveAction();    
        }
    }


    return (
        <>
            <PastegramAppBar />
            {styles}
            <textarea ref={textAreaRef} spellCheck='false' placeholder='Paste your code here' onKeyDown={keyDown} />
            <Fab color="primary" aria-label="save" sx={{position: 'fixed', bottom: '16px', right: '16px'}} onClick={isLoading ? undefined : saveAction}>
                {isLoading ? <CircularProgress sx={{color: '#000000'}} size="1.5rem" /> : <Icon>save</Icon>}
            </Fab>
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
                <Alert severity="error">
                    <AlertTitle>Failed to upload file</AlertTitle>
                    {error}
                </Alert>
            </Snackbar>
        </>
    );
}