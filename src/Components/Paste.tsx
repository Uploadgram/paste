import { Box, CircularProgress, Typography, Icon, IconButton } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { deletePaste, fetchPaste, FileNotFoundError } from "../api";
import NotFound from "./NotFound";
import darcula from "react-syntax-highlighter/dist/esm/styles/prism/darcula";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism-async";
import { languageAliases } from "../utils";
import PastegramAppBar from "./PastegramAppBar";
import database, { Paste as PasteInterface } from "../database";
import LoadingButton from "./LoadingButton";
import CopyButton from "./CopyButton";

interface PasteActionProps {
    downloadId: string;
}

function PasteActions({downloadId}: PasteActionProps)
{
    const [paste, setPaste] = useState<PasteInterface | undefined>(undefined);
    useEffect(function() {
        database.fetchPaste(downloadId, true).then((paste) => {
            if (paste !== undefined) setPaste(paste);
        });
    }, [downloadId])
    const navigate = useNavigate();

    function doDeletePaste() {
        return deletePaste(paste!.token).finally(() => navigate('/my-pastes'));
    }

    const actions: ReactNode[] = [
        <CopyButton text={document.location.toString()} />
    ];

    if ('share' in navigator) {
        actions.unshift(<IconButton onClick={() => navigator.share({text: document.location.toString()})}>
                            <Icon>share</Icon>
                        </IconButton>);
    }
    
    if (paste !== undefined) {
        actions.push(<LoadingButton onClick={doDeletePaste}>
            <Icon>delete</Icon>
        </LoadingButton>);
    }



    return <>{actions}</>;

}

export default function Paste()
{
    const { id } = useParams();
    const [content, setContent] = useState<string|null|undefined>(undefined);
    const [error, setError] = useState<string|null>(null);
    let downloadId_tmp = id!;
    let language: string | undefined = undefined;
    if (id!.indexOf('.') !== -1) {
        const pos = id!.indexOf('.');
        downloadId_tmp = id!.substring(0, pos);
        language = id!.substring(pos + 1);
        if (language in languageAliases) {
            language = languageAliases[language as keyof typeof languageAliases];
        }
    }
    const downloadId = downloadId_tmp;
    useEffect(() => {
        console.log('fetching paste...')
        let trimmedHash = document.location.hash.trim()
        if (trimmedHash[0] === '#') trimmedHash = trimmedHash.substring(1);
        if (trimmedHash === '') return setError('No key found in the URL fragment.'); 
        fetchPaste(downloadId, trimmedHash).then(setContent).catch(error => {
            if (error instanceof FileNotFoundError) return setContent(null);
            console.error(error);
            setError((error as any).toString())
        });
    }, [downloadId]);
    return <>
    <PastegramAppBar>
        <PasteActions downloadId={downloadId} />
    </PastegramAppBar>
    {content === undefined ? error !== null ? <Box sx={{flexGrow: 1, display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <Icon sx={{fontSize: '3.5rem', marginBottom: '16px'}}>error</Icon>
        <Typography variant="h5">
            {error}
        </Typography>
    </Box> : <Box sx={{flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <CircularProgress />
    </Box> : content === null ?
    <NotFound type="file" /> : <Box sx={{flexGrow: 1, padding: '16px 28px'}}>
        <SyntaxHighlighter language={language} showLineNumbers={true} showInlineLineNumbers={true} style={darcula} customStyle={{background: 'none', fontFamily: "'Cascadia Code', 'Cascadia Mono', 'Source Code Sans Pro', 'Courier New', Courier, monospace", margin: 0, padding: 0}}>
            {content}
        </SyntaxHighlighter>
    </Box>}
    </>;
}
