import React from "react";
import {AppBar, Toolbar, Typography, Box, Button} from '@mui/material';
import { Link, useLinkClickHandler } from "react-router-dom";

const pages = [{'title': 'My Pastes', 'href': '/my-pastes'}];

export default function PastegramAppBar()
{
    return (
        <AppBar position="sticky">
            <Toolbar variant="dense">
                <Typography variant="h6" sx={{mr: 2}}>
                    <Link to="/" style={{color: 'white', textDecoration: 'none'}}>
                        Pastegram
                    </Link>
                </Typography>
                <Box sx={{flexGrow: 1, float: 'right'}}>
                    {pages.map(d => (
                        <Destination to={d.href} key={d.href}>{d.title}</Destination>
                    ))}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

function Destination({to, children}: {to: string, children: string})
{
    const handler = useLinkClickHandler<HTMLButtonElement>(to);
    return <Button sx={{my: 2, display: 'block', color: 'white'}} onClick={handler}>{children}</Button>;
}