import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import Navbar from './Components/Navbar';
import Dashboard from './Pages/Dashboard';
import Agents from './Pages/Agents';
import Tasks from './Pages/Tasks';
import Login from './Pages/Login';
import Footer from './Pages/Footer';

function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Dashboard/>}/>
        <Route path='/agents' element={<Agents/>}/>
        <Route path='/tasks' element={<Tasks/>}/>
        <Route path='/login' element={<Login/>}/>
      </Routes>
      <Toaster/>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
