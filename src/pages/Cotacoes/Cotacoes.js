import { Divider, Grid, IconButton, MenuItem, Paper, Select, TextField } from '@mui/material'
import React, { useContext } from 'react'
import NumberCard from '../../components/Cards/NumberCard'
import DynamicDataGrid from '../../components/Tables/DynamicDataGrid'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import usdt from '../../assets/imgs/usdt.png'
import usd from '../../assets/imgs/usd.png'
import brl from '../../assets/imgs/brl.png'
import limit from '../../assets/imgs/limit.png'
import FormControl from '@mui/material/FormControl';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { DesignContext } from '../../contexts/DesignContext';
import { useNavigate } from 'react-router-dom';


export default function Cotacoes() {
    const { palette } = useContext(DesignContext);
    const navigate = useNavigate()
    return (
        <Grid container spacing={1} justifyContent={'center'}>
            <Grid item xs={12}>
                <h1>Cotações</h1>
            </Grid>
            <Grid item xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={12}>
                <h2>Meu Saldo</h2>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <NumberCard title={'BRL'} number={'R$573.000,00'} img={brl} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <NumberCard title={'USD'} number={'R$230.000,00'} img={usd} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <NumberCard title={'USDT'} number={'R$360.000,00'} img={usdt} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <NumberCard title={'LIMITE'} number={'R$280.000,00'} img={limit} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <br />
            </Grid>


            <Grid item xs={12} style={{ textAlign: 'left' }}>
                <button className='button-outlined' onClick={() => navigate('/carteira')}>Realizar Depósito</button>
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
                <Paper elevation={3} style={{ padding: '20px 20px 40px 20px', margin: '0px 20px 0px 20px', }}>
                    <Grid container spacing={0} justifyContent={'center'}>

                        <Grid item xs={12} style={{ textAlign: 'center' }}>
                            <h1>Swaps</h1>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider />
                        </Grid>
                        <Grid item xs={12}>
                            <br />
                        </Grid>

                        <Grid item xs={12}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                <div style={{ textAlign: 'left' }}>
                                    <label>Moeda</label>
                                    <br />
                                    <Select value="BRL" style={{ width: '150px' }}>
                                        <MenuItem value="BRL">
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                                <img src={brl} width="18" height="18" style={{ padding: '5px' }} />
                                                BRL
                                            </div>
                                        </MenuItem>
                                        <MenuItem value="USD">
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                                <img src={usd} width="18" height="18" style={{ padding: '5px' }} />
                                                USD
                                            </div>
                                        </MenuItem>
                                        <MenuItem value="USDT">
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                                <img src={usdt} width="18" height="18" style={{ padding: '5px' }} />
                                                USDT
                                            </div>
                                        </MenuItem>
                                    </Select>
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <label>Quantidade</label>
                                    <br />
                                    <TextField placeholder='Quantidade' />
                                </div>
                            </div>
                        </Grid>


                        <Grid item xs={12}>
                            <br />
                        </Grid>


                        <Grid item xs={12}>
                            <IconButton>
                                <SwapHorizIcon style={{ fontSize: '5rem', color: palette.secondaryColor }} />
                            </IconButton>

                        </Grid>

                        <Grid item xs={12}>
                            <br />
                        </Grid>

                        <Grid item xs={12}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>

                                <div style={{ textAlign: 'left' }}>
                                    <label>Quantidade</label>
                                    <br />
                                    <TextField placeholder='Quantidade' />
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <label>Moeda</label>
                                    <br />
                                    <Select value="USD" style={{ width: '150px' }}>
                                        <MenuItem value="USD">
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                                <img src={usd} width="18" height="18" style={{ padding: '5px' }} />
                                                USD
                                            </div>
                                        </MenuItem>
                                        <MenuItem value="BRL">
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                                <img src={brl} width="18" height="18" style={{ padding: '5px' }} />
                                                BRL
                                            </div>
                                        </MenuItem>
                                        <MenuItem value="USDT">
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                                <img src={usdt} width="18" height="18" style={{ padding: '5px' }} />
                                                USDT
                                            </div>
                                        </MenuItem>
                                    </Select>
                                </div>
                            </div>
                        </Grid>


                        <Grid item xs={12}>
                            <br />
                        </Grid>



                        <Grid item xs={12}>
                            <button className='button'>Obter Cotação</button>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid >
        </Grid >
    )
}
