// import Axios from 'axios';
// import ReactDOM from 'react-dom';
import './App.css';

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
// import Spells from './pages/Spells';

import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from './comp/NavigationBar'; 

function App() {
  return(
    <div>
      <Router>
        <NavigationBar/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          {/* <Route path='spells' element={<Spells/>} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
