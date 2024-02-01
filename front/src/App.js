import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login/login';
import ZaboravljenaSifra from './ZaboravljenaSifra/zaboravljenaSifra';
import Register from './Register/register';
import Home from './Home/home';

function App() {
  return (
    <Router>

    <Routes>
      <Route path="/" element={<Login /> } />
      <Route path="/Password" element={<ZaboravljenaSifra/>}> </Route>
      <Route path="/Register" element={<Register/>}> </Route>
      <Route path="/Home" element= {<Home/>}> </Route>

      {/* <Route path="/register" element={<Register />} />
      <Route path="/recept" element={<Recept />} />
     <Route path= "/home" element= {<Home></Home>}> </Route> */}

     {/* <Route path= "/dodavanjeRecepta" element= {<DodavanjeRecepte></DodavanjeRecepte>}> </Route> */}
    
    </Routes>
   
    
  </Router>
  );
}

export default App;
