import { PropsWithChildren } from "react";
import {AppBar, Toolbar, Typography, Box, Button} from '@mui/material';
import { Link, useLinkClickHandler } from "react-router-dom";

const pages = [{'title': 'My Pastes', 'href': '/my-pastes'}];

export default function PastegramAppBar({children}: PropsWithChildren<{}> = {})
{
    return (
        <AppBar position="sticky">
            <Toolbar variant="regular">
                <Typography variant="h6" sx={{mr: 2}}>
                    <Link to="/" style={{color: 'white', textDecoration: 'none'}}>
                        Pastegram
                    </Link>
                </Typography>
                <Box sx={{flexGrow: 1}}>
                    {pages.map(d => (
                        <Destination to={d.href} key={d.href}>{d.title}</Destination>
                    ))}
                </Box>
                {children}
            </Toolbar>
        </AppBar>
    );
}

function Destination({to, children}: {to: string, children: string})
{
    const handler = useLinkClickHandler<HTMLButtonElement>(to);
    return <Button sx={{mr: 2, display: 'block', color: 'white'}} onClick={handler}>{children}</Button>;
}