import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Watchlist from './pages/Watchlist'
import { useState } from 'react';
import RefrshHandler from './RefrshHandler';
import MainLayout from './pages/MainLayout';
import QuickPick from './pages/QuickPick';
import BingeBytes from './pages/BingeBytes';
import CoolFacts from './pages/CoolFacts';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />
  }
  return (
    <div className="App">
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route element={<MainLayout />}>
        <Route path='/home' element={<PrivateRoute element={<Home />} />} />
        <Route path='/watchlist' element={<Watchlist />} />
        <Route path='/quickpick' element={<QuickPick />} />
        <Route path='/bingebytes' element={<BingeBytes />} />
        <Route path='/coolfacts' element={<CoolFacts />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App