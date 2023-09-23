import { Grid, Hidden, Paper, TextField, Typography } from '@mui/material'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import logo from '../../assets/imgs/victory.png'

export default function Login() {
    const { setToken, setUser, token, user } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [creatingAccount, setCreatingAccount] = useState(false);

    const changeValue = (e) => {
        const { name, value } = e.target
        if (name === 'email') {
            setEmail(value)
        } else {
            setPassword(value)
        }
    }

    const submit = (e) => {
        e.preventDefault();

        // TODO retrieve from API
        const token = '123';

        localStorage.setItem('token', token);
        setToken(token);
    }

    return (
        <Grid container alignItems={'center'} justifyContent={'center'} style={{ textAlign: 'center', height: '100vh' }}>
            <Grid item xs={12}>
                <form onSubmit={submit}>
                    <Grid container spacing={3} justify={'center'} alignItems={'center'}>
                        <Grid item xs={12}>
                            <Hidden mdUp>
                                <img src={logo} alt='KW Vale Logo' style={{ height: 'auto', width: '90vw' }} />
                            </Hidden>
                            <Hidden mdDown>
                                <img src={logo} alt='KW Vale Logo' style={{ height: 'auto', width: '20vw' }} />
                            </Hidden>
                        </Grid>

                        <Grid item xs={12}>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Paper elevation={3} style={{ padding: '20px 20px 30px 20px', margin: '0px 20px 0px 20px', maxWidth: '360px' }}>
                                    <Grid container spacing={3} alignContent={'center'} alignItems={'center'}>
                                        <Grid item xs={12}>
                                            <h3>Seja bem vindo!</h3>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField label="Email" type='email' variant='outlined' color='primary' name='email' onChange={changeValue} value={email} fullWidth />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField label="Senha" type='password' variant='outlined' color='primary' name='password' onChange={changeValue} value={password} fullWidth />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <button className='button-outlined' type='button'>CRIAR CONTA</button>
                                            <button className='button' type='submit'>ENTRAR</button>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <a href='#'>Esqueci minha senha</a>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </div>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
        </Grid>
    )
}
