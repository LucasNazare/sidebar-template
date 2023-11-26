import { Chip, Grid, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import NumberCard from '../../components/Cards/NumberCard'
import DynamicDataGrid from '../../components/Tables/DynamicDataGrid'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import usdt from '../../assets/imgs/usdt.png'
import usd from '../../assets/imgs/usd.png'
import brl from '../../assets/imgs/brl.png'
import limit from '../../assets/imgs/limit.png'
import ArticleIcon from '@mui/icons-material/Article';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CustomChart from '../../components/Charts/CustomChart';
import LoadingOverlay from '../../templates/LoadingOverlay';


export default function Pendentes() {
    const navigate = useNavigate();

    const [transactions, setTransactions] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [users, setUsers] = useState([]);
    const [currencyToIdArr, setCurrencyToIdArr] = useState([]);
    const [userToIdArr, setUserToIdArr] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                // Get currencies
                const response = await axios.get('/currencies');
                setCurrencies(response.data.data);

                // Get users
                const usersResponse = await axios.get('/users');
                setUsers(usersResponse.data.data);

                // Create an array of objects with label: name and value: _id
                const currencyToIdArr = response.data.data.map(currency => ({ label: currency.name, value: currency.currencyCode }));
                setCurrencyToIdArr(currencyToIdArr);

                // Create an array of objects with label: name and value: _id
                const userToIdArr = usersResponse.data.data.map(user => ({ label: user.name, value: user._id }));
                setUserToIdArr(userToIdArr);
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
            customFilterOptions: [{ label: 'Pendente', value: 'PENDENTE' }, { label: 'Concluída', value: 'CONCLUIDA' }, { label: 'Cancelada', value: 'CANCELADA' }],
            render: (row) => <Chip label={row.status} color={row.status === 'PENDENTE' ? 'warning' : row.status === 'CONCLUIDA' ? 'success' : 'error'} />
        },
        {
            label: 'Tipo de Transação',
            key: 'type',
            customFilterOptions: [{ label: 'Depósito', value: 'DEPOSITO' }, { label: 'Saque', value: 'SAQUE' }],
            render: (row) => <Chip label={row.type} color={row.role === 'SAQUE' ? 'secondary' : 'primary'} />

        },
        {
            label: 'Moeda',
            key: 'currency',
            customFilterOptions: currencyToIdArr,
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
            customFilterOptions: userToIdArr,
            nFilter: true,
            render: (row) => users?.find(user => user._id === row.senderId)?.name
        },
        {
            label: 'Destinatário',
            key: 'receiverId',
            customFilterOptions: userToIdArr,
            nFilter: true,
            render: (row) => users?.find(user => user._id === row.receiverId)?.name
        },
    ];

    useEffect(() => {
        async function getTransactions() {
            try {
                const response = await axios.get('/transactions?status=PENDENTE');
                setTransactions(response.data.data);
            }
            catch (error) {
                console.error(error);
            }
        }
        getTransactions();
    }, []);


    if (loading) {
        return <LoadingOverlay />
    }
    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <h1>Transações Pendentes</h1>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <NumberCard title={'TRANSAÇÕES'} number={transactions.length} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <NumberCard title={'CONCLUIDAS'} number={transactions.filter(transaction => transaction.status === 'CONCLUIDA').length} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <NumberCard title={'PENDENTES'} number={transactions.filter(transaction => transaction.status === 'PENDENTE').length} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <NumberCard title={'CANCELADAS'} number={transactions.filter(transaction => transaction.status === 'CANCELADA').length} />
            </Grid>
            <Grid item xs={6} style={{ textAlign: 'center' }}>
                <CustomChart
                    data={transactions}
                    dataKeys={[
                        { key: 'type', label: 'Tipo', type: 'count' },
                    ]}
                    chartType="bar"
                    colors={['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(75, 192, 192, 0.5)']}
                />
            </Grid>
            <Grid item xs={6} style={{ textAlign: 'center' }}>
                <CustomChart
                    data={transactions}
                    dataKeys={[
                        { key: 'currency', label: 'Moeda', type: 'count' },
                    ]}
                    chartType="bar"
                    colors={['rgba(54, 162, 235, 0.5)', 'rgba(75, 192, 192, 0.5)']}
                />
            </Grid>
            <Grid item xs={12}>
                <div style={{ display: 'flex', justifyContent: 'center', overflowX: 'hidden' }}>
                    <div style={{ maxWidth: '85vw', width: '100%', overflowX: 'auto' }}>
                        <DynamicDataGrid
                            columns={columns}
                            allowMultipleSelection
                            actions={[
                                { element: <IconButton><ArticleIcon /></IconButton>, onClick: (row) => navigate(`/transacoes/${row._id}`) },
                            ]}
                            baseUrl={'/transacoes/pendentes'}
                            queryUrl={'/transactions?status=PENDENTE'}
                            pageTitle={'Transações'}
                        />
                    </div>

                </div>
            </Grid>
        </Grid>
    )
}
