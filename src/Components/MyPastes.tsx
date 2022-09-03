import { Card, CardContent, Divider, Icon, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import database, { Paste } from "../database";
import * as api from '../api';
import { buildPasteUri } from "../utils";
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-async';
import darcula from "react-syntax-highlighter/dist/esm/styles/prism/darcula";
import { Link, useNavigate } from "react-router-dom";
import LoadingButton from "./LoadingButton";
import CopyButton from './CopyButton';
import PastegramAppBar from "./PastegramAppBar";

export default function MyPastes()
{
    const [pastes, setPastes] = useState<Paste[]|null>(null);
    const navigate = useNavigate();
    function reloadPastes() {
        database.fetchPastes().then((pastes) => setPastes(pastes.reverse()));
    }
    useEffect(reloadPastes, []);
    return <>
    <PastegramAppBar />
    {pastes === null ? null
    : pastes.length === 0 ? (
        <Box sx={{flexGrow: 1, display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', margin: '16px'}}>
            <Icon sx={{fontSize: '3.5rem', marginBottom: '16px'}}>heart_broken</Icon>
            <Typography variant="h5">
                No pastes have been found, <Link to="/">make a new one now</Link>!
            </Typography>
        </Box>
        ) : <Box>
            {pastes.map((paste, i) => (
                <Card key={i}>
                    <CardContent sx={{position: 'relative'}}>
                        <Box sx={{position: 'absolute', top: '8px', right: '8px', display: 'flex', flexFlow: 'row'}}>
                            <IconButton onClick={() => navigate(buildPasteUri(paste))}>
                                <Icon>open_in_browser</Icon>
                            </IconButton>
                            {'share' in navigator ?
                            <IconButton onClick={() => navigator.share({text: buildPasteUri(paste)})}>
                                <Icon>share</Icon>
                            </IconButton> : null}
                            <CopyButton text={document.location.origin + buildPasteUri(paste)} />
                            <LoadingButton onClick={() => api.deletePaste(paste.token).finally(reloadPastes)}>
                                <Icon>delete</Icon>
                            </LoadingButton>
                        </Box>
                        <SyntaxHighlighter showLineNumbers={true} showInlineLineNumbers={true} style={darcula} customStyle={{background: 'none', fontFamily: "'Cascadia Code', 'Cascadia Mono', 'Source Code Sans Pro', 'Courier New', Courier, monospace"}}>
                            {paste.codePreview}
                        </SyntaxHighlighter>
                    </CardContent>
                    <Divider />
                </Card>
            ))}
        </Box>}
    </>;
}