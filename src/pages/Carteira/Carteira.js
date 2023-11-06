import { Grid, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import NumberCard from '../../components/Cards/NumberCard'
import DynamicDataGrid from '../../components/Tables/DynamicDataGrid'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import usdt from '../../assets/imgs/usdt.png'
import usd from '../../assets/imgs/usd.png'
import brl from '../../assets/imgs/brl.png'
import limit from '../../assets/imgs/limit.png'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const imgs = {
    'BRL': brl,
    'USD': usd,
    'USDT': usdt,
    'LIMITE': limit
}

export default function Carteira() {
    const navigate = useNavigate();

    const [currencies, setCurrencies] = useState([]);
    const [wallet, setWallet] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = 'Minha Carteira';
        const fetchData = async () => {
            try {
                // Get user data
                const userResponse = await axios.get('/auth/me');
                setWallet(userResponse.data.user.wallet ? userResponse.data.user.wallet : {});
                console.log(userResponse.data.wallet);

                // Get currencies
                const response = await axios.get('/currencies');
                setCurrencies(response.data.data);
            } catch (error) {
                console.error(error);
            }
            finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    function formatCurrency(value) {
        let formatter = new Intl.NumberFormat('pt-BR', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        return formatter.format(value);
    }



    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <h1>Minha Carteira</h1>
            </Grid>
            <Grid item xs={12}>
                <button className='button-outlined' onClick={() => navigate('/carteira')}>Solicitar Saque</button>
                <button className='button' onClick={() => navigate('/carteira')}>Realizar Depósito</button>
            </Grid>
            {
                currencies?.map((currency) => {
                    return (
                        <Grid item xs={12} sm={6} md={3} key={currency._id}>
                            <NumberCard
                                title={currency.currencyCode}
                                number={currency.prefix + ' ' + (wallet[currency.currencyCode] ? formatCurrency(wallet[currency.currencyCode]) : formatCurrency(0))}
                                img={imgs[currency.currencyCode]}
                            />

                        </Grid>
                    )
                })
            }
            {/* <Grid item xs={12} sm={6} md={3}>
                <NumberCard title={'USD'} number={'R$230.000,00'} img={usd} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <NumberCard title={'USDT'} number={'R$360.000,00'} img={usdt} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <NumberCard title={'LIMITE'} number={'R$280.000,00'} img={limit} />
            </Grid> */}
            <Grid item xs={12} sm={6} md={3}>
                <br />
            </Grid>
        </Grid>
    )
}
