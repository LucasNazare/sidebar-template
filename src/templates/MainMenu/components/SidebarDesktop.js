import { Divider, Grid, IconButton, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import React, { useContext } from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { DesignContext } from '../../../contexts/DesignContext';
import logo from '../../../assets/imgs/KW_VALE.png'
import GroupIcon from '@mui/icons-material/Group';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentsIcon from '@mui/icons-material/Payments';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import { AuthContext } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';


export default function SidebarDesktop({ mobile }) {
    const { palette } = useContext(DesignContext);
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <div style={{ backgroundColor: palette.sidebarPrimaryColor, height: '100vh', width: mobile ? '300px' : '100%' }}>
            <Grid container alignItems="center" justifyContent={'center'}>

                {/* Logo */}
                <Grid item xs={12} style={{ textAlign: 'center', padding: '15px' }}>
                    <img src={logo} width={'150px'} />
                </Grid>

                <Grid item xs={12}>
                    <br />
                    <Divider />
                    <br />
                </Grid>

                <Grid item xs={12}>
                    <List style={{ textAlign: 'left' }}>
                        <ListItemButton onClick={() => navigate('/minha-conta')}>
                            <ListItemIcon>
                                <AccountCircleIcon />
                            </ListItemIcon>
                            <span style={{ fontSize: '1.2rem' }}>Minha Conta</span>
                        </ListItemButton>


                        <ListItemButton onClick={logout}>
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            <span style={{ fontSize: '1.2rem' }}>Sair</span>
                        </ListItemButton>
                    </List>
                </Grid>

                <Grid item xs={12}>
                    <br />
                    <Divider />
                    <br />
                </Grid>
                {/* Navigation */}
                <Grid item xs={12}>
                    <List style={{ textAlign: 'left' }}>
                        <ListItemButton onClick={() => navigate('/dashboard')}>
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <span style={{ fontSize: '1.2rem' }}>Dashboard</span>
                        </ListItemButton>


                        <ListItemButton onClick={() => navigate('/agentes')}>
                            <ListItemIcon>
                                <GroupIcon />
                            </ListItemIcon>
                            <span style={{ fontSize: '1.2rem' }}>Agentes</span>
                        </ListItemButton>


                        <ListItemButton onClick={() => navigate('/receita')}>
                            <ListItemIcon>
                                <ReceiptIcon />
                            </ListItemIcon>
                            <span style={{ fontSize: '1.2rem' }}>Receita</span>
                        </ListItemButton>


                        <ListItemButton onClick={() => navigate('/pagamentos')}>
                            <ListItemIcon>
                                <PaymentsIcon />
                            </ListItemIcon>
                            <span style={{ fontSize: '1.2rem' }}>Pagamentos</span>
                        </ListItemButton>


                        <ListItemButton onClick={() => navigate('/balanco')}>
                            <ListItemIcon>
                                <AccountBalanceWalletIcon />
                            </ListItemIcon>
                            <span style={{ fontSize: '1.2rem' }}>Balanço</span>
                        </ListItemButton>


                        <ListItemButton onClick={() => navigate('/relatorios')}>
                            <ListItemIcon>
                                <BarChartIcon />
                            </ListItemIcon>
                            <span style={{ fontSize: '1.2rem', }}>Relatórios</span>
                        </ListItemButton>
                    </List>

                    <Grid item xs={12}>
                        <br />
                        <Divider />
                        <br />
                    </Grid>


                    <Grid item xs={12}>
                        <List style={{ textAlign: 'left' }}>
                            <ListItemButton onClick={() => navigate('/configuracoes')}>
                                <ListItemIcon>
                                    <SettingsIcon />
                                </ListItemIcon>
                                <span style={{ fontSize: '1.2rem' }}>Configurações</span>
                            </ListItemButton>
                        </List>
                    </Grid>


                    <Grid item xs={12}>
                        <br />
                        <Divider />
                        <br />
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}