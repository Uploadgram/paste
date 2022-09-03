
import {Routes, Route} from 'react-router-dom';
import NotFound from './Components/NotFound';
import { GlobalStyles } from '@mui/styled-engine';
import { blue } from '@mui/material/colors';
import { lazy, Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import PastegramAppBar from './Components/PastegramAppBar';

const Home = lazy(() => import('./Components/Home'));
const MyPastes = lazy(() => import('./Components/MyPastes'));
const Paste = lazy(() => import('./Components/Paste'));

const styles = <GlobalStyles styles={{
    'a': {color: blue[400], textDecoration: 'none'},
    '#root': {display: 'flex', flexFlow: 'column'},
    'html,body,#root' : {width:'100%', height: '100%'},
}} />;

export default function App()
{
    // re-render the app bar in each different component for optional custom actions
    return (
        <>
            {styles}
            <Routes>
                <Route path="/" element={
                    <Suspense fallback={LoadingScreen}>
                        <Home />
                    </Suspense>
                } />
                <Route path="/my-pastes" element={
                    <Suspense fallback={LoadingScreen}>
                        <MyPastes />
                    </Suspense>
                } />
                <Route path="/:id" element={
                    <Suspense fallback={LoadingScreen}>
                        <Paste />
                    </Suspense>
                }/>
                <Route path="*" element={<>
                    <PastegramAppBar />
                    <NotFound type="page" />
                </>} />
            </Routes>
        </>
    );
}

function LoadingScreen() {
    return <>
        <PastegramAppBar />
        <Box sx={{flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <CircularProgress />
        </Box>
    </>;
}