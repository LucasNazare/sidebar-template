import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react'
import LoadingOverlay from '../../templates/LoadingOverlay';
import { useNavigate, useParams } from 'react-router-dom';
import { Divider, Grid, MenuItem, Paper, Select, TextField } from '@mui/material';

import usdt from '../../assets/imgs/usdt.png'
import usd from '../../assets/imgs/usd.png'
import brl from '../../assets/imgs/brl.png'
import limit from '../../assets/imgs/limit.png'
import ConfirmationDialog from '../../components/Modals/ConfirmationDialog';

const imgs = {
    'BRL': brl,
    'USD': usd,
    'USDT': usdt,
    'LIMITE': limit
}

export default function AddFunds() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [currencies, setCurrencies] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    const [amount, setAmount] = useState(0);

    const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get currencies
                const res = await axios.get('/currencies');
                setCurrencies(res.data.data);

                // Find selected query param
                const query = new URLSearchParams(window.location.search);
                const selected = res.data.data.find(currency => currency._id === parseInt(query.get('currency')));
                setSelectedCurrency(selected);


                // Get user data
                const userResponse = await axios.get(`/users/${id}`);
                setUser(userResponse.data);
            }
            catch (error) {
                console.error(error);
            }
            finally {
                setLoading(false);
            }
        }
        fetchData();

    }, []);



    const handleCurrencyChange = (e) => {
        e.preventDefault();
        setSelectedCurrency(e.target.value);
    }

    const submit = async (e) => {
        e.preventDefault();

        try {
            // Check amount bigger than 0
            if (amount <= 0) {
                alert('Quantidade deve ser maior que 0');
                return;
            }
        }
        catch (error) {
            console.error(error);
            alert('Erro ao adicionar fundos');
            return;
        }

        setLoading(true);
        try {
            // Add funds to user
            const data = { currency: selectedCurrency.currencyCode, amount: parseFloat(amount) }
            const res = await axios.post(`/users/${id}/addFunds`, data);
            alert('Fundos adicionados com sucesso!');
            navigate(`/carteira/${user._id}`);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    }

    if (loading) return <LoadingOverlay />
    return (
        <Grid container spacing={1} justifyContent={'center'}>
            <Grid item xs={12}>
                <h1>Adicionar Fundos</h1>
            </Grid>
            <Grid item xs={12}>
                <Divider />
            </Grid>

            <Grid item xs={12} style={{ textAlign: 'center' }}>
                <Paper elevation={3} style={{ padding: '20px 20px 40px 20px', margin: '0px 20px 0px 20px', }}>
                    <Grid container spacing={0} justifyContent={'center'}>

                        <Grid item xs={12} style={{ textAlign: 'center' }}>
                            <h1>Adicionando fundos para {user?.name}</h1>
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
                                    <Select
                                        value={selectedCurrency}
                                        onChange={handleCurrencyChange}
                                        style={{ width: '150px' }}
                                    >
                                        {
                                            currencies?.map((currency) => {
                                                return (
                                                    <MenuItem value={currency} key={currency._id}>
                                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                                            <img src={imgs[currency.currencyCode]} width="18" height="18" style={{ padding: '5px' }} />
                                                            {currency.currencyCode}
                                                        </div>
                                                    </MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <label>Quantidade</label>
                                    <br />
                                    <TextField
                                        placeholder='Quantidade'
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        type='number'
                                    />
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <br />
                        </Grid>
                        <Grid item xs={12}>
                            <br />
                            <button className='button' onClick={() => setOpenConfirmationDialog(true)}>Adicionar</button>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <ConfirmationDialog
                open={openConfirmationDialog}
                title={'Adicionar Fundos'}
                message={`Tem certeza que deseja adicionar ${new Intl.NumberFormat('pt-BR', { style: 'decimal', minimumFractionDigits: 2 }).format(amount)} ${selectedCurrency.currencyCode} (${selectedCurrency.name}) para ${user?.name}?`}
                confirmBtnText={'Adicionar'}
                cancelBtnText={'Cancelar'}
                onConfirm={submit}
                onCancel={() => { setOpenConfirmationDialog(false) }}
            />
        </Grid>

    )
}
