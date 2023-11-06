import { Grid, IconButton } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import NumberCard from '../../components/Cards/NumberCard'
import DynamicDataGrid from '../../components/Tables/DynamicDataGrid'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import usdt from '../../assets/imgs/usdt.png'
import usd from '../../assets/imgs/usd.png'
import brl from '../../assets/imgs/brl.png'
import limit from '../../assets/imgs/limit.png'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import LoadingOverlay from '../../templates/LoadingOverlay';
import { AuthContext } from '../../contexts/AuthContext';

const imgs = {
    'BRL': brl,
    'USD': usd,
    'USDT': usdt,
    'LIMITE': limit
}

export default function UserWallet() {
    const { userJwt } = useContext(AuthContext);
    const navigate = useNavigate();
    const { id } = useParams();

    const [currencies, setCurrencies] = useState([]);
    const [wallet, setWallet] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get user data
                const userResponse = await axios.get(`/users/${id}`);
                console.log(userResponse.data);
                setWallet(userResponse.data.wallet ? userResponse.data.wallet : {});
                setUser(userResponse.data);

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


    if (loading) return <LoadingOverlay />

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <h1>Carteira de {user?.name}</h1>
            </Grid>
            {
                currencies?.map((currency) => {
                    return (
                        <Grid item xs={12} sm={6} md={3}>
                            <NumberCard
                                title={currency.currencyCode}
                                number={currency.prefix + ' ' + (wallet[currency.currencyCode] ? formatCurrency(wallet[currency.currencyCode]) : formatCurrency(0))}
                                img={imgs[currency.currencyCode]}
                                itemFloat='center'
                                items={userJwt?.role === 'ADMIN' ?
                                    [{
                                        number: '',
                                        text: 'Adicionar Fundos',
                                        onClick: () => navigate(`/carteira/adicionar-fundos/${user._id}?currency=${currency._id}`)
                                    }] : []}
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
