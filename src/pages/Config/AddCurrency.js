import { Grid, Paper, TextField } from '@mui/material'
import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function AddCurrency() {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [currencyCode, setCurrencyCode] = useState('');
    const [spreadBuy, setSpreadBuy] = useState('');
    const [spreadSell, setSpreadSell] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/currencies', {
                name,
                currencyCode,
                spreadBuy,
                spreadSell
            });
            alert('Moeda cadastrada com sucesso!');
            navigate('/configuracoes');
        } catch (error) {
            console.error(error);
            alert('Erro ao cadastrar moeda!');
        }
    }

    return (
        <Grid container spacing={0}>
            <Grid item xs={12}>
                <h1>Cadastrar Moeda</h1>
            </Grid>
            <Grid item xs={12}>
                <Paper elevation={3} style={{ padding: '20px 20px 40px 20px', margin: '0px 20px 0px 20px', }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <h3>Preencha com os dados</h3>
                        </Grid>
                        <Grid item xs={12}>
                            <label>Nome da Moeda</label>
                            <TextField label="Nome  " variant="outlined" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
                        </Grid>
                        <Grid item xs={12}>
                            <label>Código da Moeda</label>
                            <TextField label="Código" variant="outlined" fullWidth value={currencyCode} onChange={(e) => setCurrencyCode(e.target.value)} />
                        </Grid>
                        <Grid item xs={6}>
                            <label>Spread Compra</label>
                            <TextField label="Spread Compra" variant="outlined" fullWidth value={spreadBuy} type='number'
                                onChange={(e) => setSpreadBuy(e.target.value)} />
                        </Grid>
                        <Grid item xs={6}>
                            <label>Spread Venda</label>
                            <TextField label="Spread Venda" variant="outlined" fullWidth value={spreadSell} type='number'
                                onChange={(e) => setSpreadSell(e.target.value)} />
                        </Grid>
                    </Grid>
                    <div item xs={12} style={{ textAlign: 'right' }}>
                        <br />
                        <button className='button' onClick={handleSubmit}>Cadastrar</button>
                    </div>
                </Paper>
            </Grid>
        </Grid>
    )
}
