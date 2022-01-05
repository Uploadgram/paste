
import PastegramAppBar from './Components/PastegramAppBar';
import {Routes, Route} from 'react-router-dom';
import Home from './Components/Home';
import MyPastes from './Components/MyPastes';
import Paste from './Components/Paste';
import NotFound from './Components/NotFound';
import { GlobalStyles } from '@mui/styled-engine';
import { blue } from '@mui/material/colors';

const styles = <GlobalStyles styles={{
    'a': {color: blue[400], textDecoration: 'none'},
    '#root': {display: 'flex', flexFlow: 'column'},
    'html,body,#root' : {width:'100%', height: '100%'},
}} />;

export default function App()
{
    return (
        <>
            {styles}
            <PastegramAppBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/my-pastes" element={<MyPastes />} />
                <Route path="/:id" element={<Paste />} />
                <Route path="*" element={<NotFound type="page" />} />
            </Routes>
        </>
    );
}