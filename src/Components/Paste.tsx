import { Box, CircularProgress, Typography, Icon } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchPaste, FileNotFoundError } from "../api";
import {darcula} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import SyntaxHighlighter from 'react-syntax-highlighter';
import NotFound from "./NotFound";
import { languageAliases } from "../utils";

export default function Paste()
{
    const { id } = useParams();
    const [content, setContent] = useState<string|null|undefined>(undefined);
    const [error, setError] = useState<string|null>(null);
    let downloadId_tmp = id!;
    let language: string | undefined = undefined;
    if (id!.indexOf('.') !== -1) {
        const pos = id!.indexOf('.');
        downloadId_tmp = id!.substr(0, pos);
        language = id!.substr(pos + 1);
        if (language in languageAliases) {
            language = languageAliases[language as keyof typeof languageAliases];
        }
    }
    const downloadId = downloadId_tmp;
    useEffect(() => {
        let trimmedHash = document.location.hash.trim()
        if (trimmedHash[0] === '#') trimmedHash = trimmedHash.substr(1);
        if (trimmedHash === '') return setError('No key found in the URL fragment.'); 
        fetchPaste(downloadId, trimmedHash).then(setContent).catch(error => {
            if (error instanceof FileNotFoundError) return setContent(null);
            console.error(error);
            setError((error as any).toString())
        });
    }, [downloadId]);
    return content === undefined ? error !== null ? (<Box sx={{flexGrow: 1, display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <Icon sx={{fontSize: '3.5rem', marginBottom: '16px'}}>error</Icon>
        <Typography variant="h5">
            {error}
        </Typography>
    </Box>) : (<Box sx={{flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <CircularProgress />
    </Box>) : content === null ? <NotFound type="file" /> : (<Box sx={{flexGrow: 1, padding: '16px 28px'}}>
        <SyntaxHighlighter language={language} showLineNumbers={true} showInlineLineNumbers={true} style={darcula} customStyle={{background: 'none', fontFamily: "'Cascadia Code', 'Cascadia Mono', 'Source Code Sans Pro', 'Courier New', Courier, monospace", margin: 0, padding: 0}}>
            {content}
        </SyntaxHighlighter>
    </Box>);
}
