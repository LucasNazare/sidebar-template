import { Divider, Grid, MenuItem, Paper, Select, TextField } from '@mui/material'
import React from 'react'

export default function MyAccount() {
    return (
        <Grid container spacing={0}>
            <Grid item xs={12}>
                <h1>Minha Conta</h1>
            </Grid>
            <Grid item xs={12}>
                <Paper elevation={3} style={{ padding: '20px 20px 40px 20px', margin: '0px 20px 0px 20px', }}>
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            <h3>Dados Pessoais</h3>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider />
                            <br />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={4}>
                                    <label>Nome Completo</label>
                                    <TextField
                                        placeholder='Nome Completo'
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <label>Email</label>
                                    <TextField
                                        fullWidth
                                        placeholder='Email'
                                    />
                                </Grid>
                                <Grid xs={1}>   </Grid>
                                <Grid item xs={12} sm={4}>
                                    <label>Telefone</label>
                                    <TextField
                                        placeholder='Telefone'
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} style={{ marginTop: ' 10px', }}>
                                    <button className='button'>Alterar Senha</button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid container spacing={0} style={{ marginTop: ' 10px' }}>
                        <Grid item xs={12}>
                            <h3>Dados Profissionais</h3>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider />
                            <br />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={4}>
                                    <label>Cargo</label>
                                    <Select
                                        fullWidth
                                    >
                                        <MenuItem value={"OP"}>Operating Principal</MenuItem>
                                        <MenuItem value={"TL"}>Team Leader</MenuItem>
                                        <MenuItem value={"MCA"}>Market Center Administrator</MenuItem>
                                        <MenuItem value={"PC"}>Productivity Coach</MenuItem>
                                        <MenuItem value={"DOFI"}>Director of First Impressions</MenuItem>
                                    </Select>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <label>Adiciona Pagamentos</label>
                                    <Select
                                        fullWidth
                                    >
                                        <MenuItem value={true}>SIM</MenuItem>
                                        <MenuItem value={false}>NAO</MenuItem>
                                    </Select>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <label>Aprova Pagamentos</label>
                                    <Select
                                        fullWidth
                                    >
                                        <MenuItem value={true}>SIM</MenuItem>
                                        <MenuItem value={false}>NAO</MenuItem>
                                    </Select>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    )
}
