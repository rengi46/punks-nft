import { Route, Routes} from 'react-router-dom';
import Home from './pages/home';
import Punks from './pages/punks';
import ManinLayout from './layouts/main';
import Punk from './pages/punk';



function App() {

  return (
    <Routes>

        <Route path="/" element={<ManinLayout><Home/></ManinLayout>} />
        <Route path="/punks" exact element={<ManinLayout><Punks/></ManinLayout>} />
        <Route path="/punks/:tokenId" exact element={<ManinLayout><Punk/></ManinLayout>} />


    </Routes>
  );
}

export default App;
