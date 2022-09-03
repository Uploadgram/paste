import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import PastegramAppBar from "./PastegramAppBar";


export default function NotFound({type}: {type: "file" | "page"})
{
    const navigate = useNavigate();
    return <>
        <Box sx={{flexGrow: 1, display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <Typography variant="h1">
                404
            </Typography>
            <Typography variant="h5" sx={{textAlign: 'center'}}>
                {type === "file" ? 'The file was not found or can not be showed as a paste' : 'This page was not found.'}
            </Typography>
            <Button variant="text" onClick={() => navigate('/')} sx={{marginTop: '28px'}}>MAKE A NEW PASTE</Button>
        </Box>
    </>;
}