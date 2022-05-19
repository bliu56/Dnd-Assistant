// import Axios from 'axios';
// import ReactDOM from 'react-dom';
import './App.css';

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';

import FileUpload from './pages/FileUpload.js';
import CharacterCreator from './pages/CharacterCreator';
import Spells from './pages/Spells';
import Test from './pages/test'
import Login from './comp/Login'
import SignUp from './comp/SignUp';
import PasswordRestore from './comp/PasswordRestore';

import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from './comp/NavigationBar'; 

function App() {
  return(
    <div>
      <Router>
        <NavigationBar/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='FileUpload' element={<FileUpload/>}/>
          <Route path='character' element={<CharacterCreator/>} />
          <Route path='spells' element={<Spells/>} />
          <Route path='test' element={<Test/>} />
          <Route path='login' element={<Login/>}/>
          <Route path='login/signup' element={<SignUp/>}/>
          <Route path='login/passwordrestore' element={<PasswordRestore/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
