import { Icon, IconButton, Snackbar, Alert } from "@mui/material";
import { useState } from "react";
import { copyText } from "../../utils";

export default function CopyButton({text}: {text: string}) {
    const [success, setSuccess] = useState<boolean | null>(null);

    function copy() {
        setSuccess(copyText(text));
    }

    return <>
        <IconButton onClick={copy}>
            <Icon>content_copy</Icon>
        </IconButton>
        <Snackbar open={success === true} autoHideDuration={3000} onClose={() => setSuccess(null)}>
            <Alert severity="success">
                Copy successful!
            </Alert>
        </Snackbar>
        <Snackbar open={success === false} autoHideDuration={3000} onClose={() => setSuccess(null)}>
            <Alert severity="error">
                Copy failed.
            </Alert>
        </Snackbar>
    </>;
}