import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthProvider from './contexts/AuthContext';
import AdminDashboard from './pages/Dashboard/AdminDashboard.js'
import PageLayout from './templates/MainMenu/PageLayout';
import DesignProvider from './contexts/DesignContext';
import LoggedInWrapper from './templates/LoggedInWrapper';
import MyAccount from './pages/MyAccount/MyAccount';
import Agents from './pages/Agents/Agents';



function App() {
  return (
    <div className="App">
      <DesignProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route exact path='/minha-conta' element={<LoggedInWrapper><MyAccount /></LoggedInWrapper>} />
              <Route exact path='/dashboard' element={<LoggedInWrapper><AdminDashboard /></LoggedInWrapper>} />
              <Route exact path='/agentes' element={<LoggedInWrapper><Agents /></LoggedInWrapper>} />
              <Route exact path='/receita' element={<LoggedInWrapper><div>receita</div></LoggedInWrapper>} />
              <Route exact path='/pagamentos' element={<LoggedInWrapper><div>pagamentos</div></LoggedInWrapper>} />
              <Route exact path='/balanco' element={<LoggedInWrapper><div>balanco</div></LoggedInWrapper>} />
              <Route exact path='/relatorios' element={<LoggedInWrapper><div>relatorios</div></LoggedInWrapper>} />
              <Route exact path='/configuracoes' element={<LoggedInWrapper><div>configuracoes</div></LoggedInWrapper>} />
              <Route path='/*' element={<div>yo</div>} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </DesignProvider>
    </div>
  );
}

export default App;
