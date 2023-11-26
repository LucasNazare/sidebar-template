import { Chip, Grid, IconButton } from '@mui/material'
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
import ArticleIcon from '@mui/icons-material/Article';

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
    const [users, setUsers] = useState([]);

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

                // Get users
                const usersResponse = await axios.get('/users');
                setUsers(usersResponse.data.data);

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


    const columns = [
        {
            label: 'Data',
            key: 'createdAt',
            dateFilter: true,
            render: (row) => new Date(row.createdAt).toLocaleDateString('pt-BR'),
        },
        {
            label: 'Status',
            key: 'status',
            render: (row) => <Chip label={row.status} color={row.status === 'PENDENTE' ? 'warning' : row.status === 'APROVADO' ? 'success' : 'error'} />
        },
        {
            label: 'Tipo de Transação',
            key: 'type',
            render: (row) => <Chip label={row.type} color={row.role === 'SAQUE' ? 'secondary' : 'primary'} />

        },
        {
            label: 'Moeda',
            key: 'currency',
        },
        {
            label: 'Valor Total',
            key: 'totalAmount',
            numberFilter: true,
            render: (row) => currencies?.find(currency => currency.currencyCode === row.currency)?.prefix + new Intl.NumberFormat('pt-BR', { style: 'decimal', minimumFractionDigits: 2 }).format(row.totalAmount)
        },
        {
            label: 'Valor Realizado',
            key: 'fulfilledAmount',
            numberFilter: true,
            render: (row) => currencies?.find(currency => currency.currencyCode === row.currency)?.prefix + new Intl.NumberFormat('pt-BR', { style: 'decimal', minimumFractionDigits: 2 }).format(row.fulfilledAmount)
        },
        {
            label: 'Remetente',
            key: 'senderId',
            render: (row) => users?.find(user => user._id === row.senderId)?.name
        },
        {
            label: 'Destinatário',
            key: 'receiverId',
            render: (row) => users?.find(user => user._id === row.receiverId)?.name
        },
    ];

    if (loading) return <LoadingOverlay />

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <h1>Carteira de {user?.name}</h1>
            </Grid>
            {
                currencies?.map((currency, index) => {
                    return (
                        <Grid item xs={12} sm={6} md={3} key={currency.currencyCode + index}>
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
            <Grid item xs={12} sm={6} md={3}>
                <br />
            </Grid>
            <Grid item xs={12}>
                <h1>Transações de {user?.name}</h1>
                <div style={{ display: 'flex', justifyContent: 'center', overflowX: 'hidden' }}>
                    <div style={{ maxWidth: '85vw', width: '100%', overflowX: 'auto' }}>
                        <DynamicDataGrid
                            columns={columns}
                            allowMultipleSelection
                            actions={[
                                { element: <IconButton><ArticleIcon /></IconButton>, onClick: (row) => navigate(`/transacoes/${row._id}`) },
                            ]}
                            baseUrl={`/carteira/${id}`}
                            queryUrl={`/transactions/user/${id}`}
                            pageTitle={'Transações'}
                        />
                    </div>

                </div>
            </Grid>
        </Grid>
    )
}
