import { IconButton, CircularProgress } from "@mui/material";
import { ReactNode, useState } from "react";


export default function LoadingButton({onClick, children}: {onClick: () => Promise<any>, children: ReactNode}) {

    const [isLoading, setLoading] = useState<boolean>(false);

    function click() {
        setLoading(true);
        onClick().finally(() => setLoading(false));
    }

    return <IconButton onClick={isLoading ? () => {} :click}>
            {isLoading ? <CircularProgress sx={{color: '#ffffff'}} size="1.5rem" /> : children}
        </IconButton>;
}