import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthProvider from './contexts/AuthContext';
import AdminDashboard from './pages/Dashboard/AdminDashboard.js'
import PageLayout from './templates/MainMenu/PageLayout';
import DesignProvider from './contexts/DesignContext';
import LoggedInWrapper from './templates/LoggedInWrapper';
import MyAccount from './pages/MyAccount/MyAccount';
import Agents from './pages/Agents/Agents';
import Cotacoes from './pages/Cotacoes/Cotacoes';
import Transacoes from './pages/Transacoes/Transacoes';
import Carteira from './pages/Carteira/Carteira';
import Users from './pages/Users/Users';
import NewUser from './pages/Users/NewUser';
import axios from 'axios';
import EditUser from './pages/Users/EditUser.js';
import Config from './pages/Config/Config.js';
import AddCurrency from './pages/Config/AddCurrency.js';
import UserWallet from './pages/Carteira/UserWallet.js';
import AddFunds from './pages/Carteira/AddFunds.js';



function App() {

  axios.defaults.baseURL = 'http://localhost:3000';
  return (
    <div className="App">
      <DesignProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route exact path='/minha-conta' element={<LoggedInWrapper><MyAccount /></LoggedInWrapper>} />
              <Route exact path='/dashboard' element={<LoggedInWrapper><AdminDashboard /></LoggedInWrapper>} />
              <Route exact path='/agentes' element={<LoggedInWrapper><Agents /></LoggedInWrapper>} />
              <Route exact path='/cotacoes' element={<LoggedInWrapper><Cotacoes /></LoggedInWrapper>} />
              <Route exact path='/transacoes' element={<LoggedInWrapper><Transacoes /></LoggedInWrapper>} />
              <Route exact path='/carteira' element={<LoggedInWrapper><Carteira /></LoggedInWrapper>} />
              <Route exact path='/carteira/:id' element={<LoggedInWrapper><UserWallet /></LoggedInWrapper>} />
              <Route exact path='/carteira/adicionar-fundos/:id' element={<LoggedInWrapper><AddFunds /></LoggedInWrapper>} />
              <Route exact path='/relatorios' element={<LoggedInWrapper><div>relatorios</div></LoggedInWrapper>} />
              <Route exact path='/usuarios' element={<LoggedInWrapper><Users /></LoggedInWrapper>} />
              <Route exact path='/novo-usuario' element={<LoggedInWrapper><NewUser /></LoggedInWrapper>} />
              <Route exact path='/usuarios/:id' element={<LoggedInWrapper><EditUser /></LoggedInWrapper>} />
              <Route exact path='/configuracoes' element={<LoggedInWrapper><Config /></LoggedInWrapper>} />
              <Route exact path='/configuracoes/cadastrar-moeda' element={<LoggedInWrapper><AddCurrency /></LoggedInWrapper>} />
              <Route path='/*' element={<div>yo</div>} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </DesignProvider>
    </div>
  );
}

export default App;
