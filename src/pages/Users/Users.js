import { Chip, Grid, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import NumberCard from '../../components/Cards/NumberCard'
import DynamicDataGrid from '../../components/Tables/DynamicDataGrid'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import usdt from '../../assets/imgs/usdt.png'
import usd from '../../assets/imgs/usd.png'
import brl from '../../assets/imgs/brl.png'
import limit from '../../assets/imgs/limit.png'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function Users() {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    const [nUsers, setNUsers] = useState(0);
    const [nProviders, setNProviders] = useState(0);
    const [nCollectors, setNCollectors] = useState(0);
    const [nClients, setNClients] = useState(0);

    const columns = [
        {
            label: 'Nome',
            key: 'name',
            isMain: true
        },
        {
            label: 'CPF/CNPJ',
            key: 'cpfCnpj',
        },
        {
            label: 'Telefone',
            key: 'phone',
        },
        {
            label: 'Email',
            key: 'email',
        },
        {
            label: 'Pix',
            key: 'pix',
        },
        {
            label: 'Função',
            key: 'role',
            render: (row) => <Chip label={row.role} color={row.role === 'CLIENTE' ? 'secondary' : 'primary'} />
        },
        {
            label: 'Data de Cadastro',
            key: 'createdAt',
            render: (row) => new Date(row.createdAt).toLocaleDateString('pt-BR'),
            dateFilter: true
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/users');
                let users = response.data?.data;
                setNUsers(users.length);
                setNProviders(users.filter(user => user.role === 'PROVEDOR').length);
                setNCollectors(users.filter(user => user.role === 'RECOLHEDOR').length);
                setNClients(users.filter(user => user.role === 'CLIENTE').length);
            }
            catch (error) {
                console.log(error);
            }
            finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);


    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <h1>Usuários</h1>
            </Grid>
            <Grid item xs={12}>
                <button className='button-outlined' onClick={() => navigate('/novo-usuario')}>Cadastrar Usuário</button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <NumberCard title={'USUÁRIOS'} number={nUsers} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <NumberCard title={'PROVEDORES'} number={nProviders} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <NumberCard title={'RECOLHEDORES'} number={nCollectors} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <NumberCard title={'CLIENTES'} number={nClients} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <br />
            </Grid>
            <Grid item xs={12}>
                <div style={{ display: 'flex', justifyContent: 'center', overflowX: 'hidden' }}>
                    <div style={{ maxWidth: '85vw', width: '100%', overflowX: 'auto' }}>
                        <DynamicDataGrid
                            columns={columns}
                            rows={rows}
                            allowMultipleSelection
                            actions={[
                                { element: <IconButton><AccountBalanceWalletIcon /></IconButton>, onClick: (row) => navigate(`/carteira/${row._id}`) },
                                { element: <IconButton><EditIcon /></IconButton>, onClick: (row) => navigate(`/usuarios/${row._id}`) },
                                { element: <IconButton><DeleteIcon /></IconButton>, onClick: (row) => console.log('Delete clicked', row), },
                            ]}
                            bulkActions={[{ label: 'Deletar itens selecionados', onClick: () => alert('Deletados') }]}
                            baseUrl={'/usuarios'}
                            pageTitle={'Usuários'}
                            queryUrl={'/users'}
                        />
                    </div>

                </div>
            </Grid>
        </Grid>
    )
}
