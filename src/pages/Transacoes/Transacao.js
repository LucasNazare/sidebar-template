import { Autocomplete, Chip, Divider, Grid, IconButton, Paper, TextField } from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DynamicDataGrid from '../../components/Tables/DynamicDataGrid';
import ArticleIcon from '@mui/icons-material/Article';
import NumberCard from '../../components/Cards/NumberCard';
import { AuthContext } from '../../contexts/AuthContext';
import ConfirmationDialog from '../../components/Modals/ConfirmationDialog';
import LoadingOverlay from '../../templates/LoadingOverlay';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import QRCode from 'qrcode.react';

export default function Transacao() {
    const { userJwt } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const [transacao, setTransacao] = useState(null);

    const [currencies, setCurrencies] = useState([]);
    const [users, setUsers] = useState([]);
    const [collectors, setCollectors] = useState([]);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

    const [address, setAddress] = useState('');
    const [collector, setCollector] = useState(null);
    const [extraInfo, setExtraInfo] = useState('');

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get transacao data
                const res = await axios.get(`/transactions/${id}`);
                setTransacao(res.data);

                // Get currencies
                const currenciesResponse = await axios.get('/currencies');
                setCurrencies(currenciesResponse.data.data);

                // Get users
                const usersResponse = await axios.get('/users');
                setUsers(usersResponse.data.data);

                // Get collectors from user list
                const collectors = usersResponse.data.data.filter(user => user.role === 'RECOLHEDOR');
                setCollectors(collectors);

                // Fill up token operation fields
                setAddress(res.data.address);
                setCollector(collectors.find(collector => collector._id === res.data.collectorId));
                setExtraInfo(res.data.extraInfo);

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
            label: 'Hora',
            key: 'createdAt',
            disableFilter: true,
            // no seconds
            render: (row) => new Date(row.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        },
        {
            label: 'Status',
            key: 'status',
            customFilterOptions: [{ label: 'Pendente', value: 'PENDENTE' }, { label: 'Concluída', value: 'CONCLUIDA' }, { label: 'Cancelada', value: 'CANCELADA' }],
            render: (row) => <Chip label={row.status} color={row.status === 'PENDENTE' ? 'warning' : row.status === 'CONCLUIDA' ? 'success' : 'error'} />
        },
        {
            label: 'Tipo de Pagamento',
            key: 'type',

            customFilterOptions: [{ label: 'Depósito', value: 'DEPOSITO' }, { label: 'Saque', value: 'SAQUE' }],
            render: (row) => <Chip label={row.type} color={row.role === 'SAQUE' ? 'secondary' : 'primary'} />

        },
        {
            label: 'Valor',
            key: 'amount',
            numberFilter: true,
            render: (row) => currencies?.find(currency => currency.currencyCode === row.currency)?.prefix + new Intl.NumberFormat('pt-BR', { style: 'decimal', minimumFractionDigits: 2 }).format(row.amount)
        },
        {
            label: 'Pagador',
            key: 'userId',
            render: (row) => users?.find(user => user._id === row.userId)?.name
        },
        {
            label: 'Recibo',
            key: 'receipt',
            disableFilter: true,
            render: (row) => row.receipt !== 'NAN' ? <IconButton onClick={() => window.open(row.receipt, '_blank')}><ArticleIcon /></IconButton> : <></>
        },
    ];

    const shouldAddPayment = () => {
        if (transacao?.status !== 'PENDENTE') return false;
        if (transacao?.totalAmount === transacao?.fulfilledAmount) return false;
        if (transacao?.type === 'TOKEN' && !transacao?.tokenValidated) return false;
        if (userJwt?.role === 'OPERADOR' || userJwt?._id === transacao?.senderId) return true;
        if (userJwt?.role === 'ADMIN' || userJwt?._id === transacao?.senderId) return true;
        if (userJwt?.id === transacao.collectorId) return true;

        return false;
    }

    const cancelTransaction = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.put(`/transactions/${id}/cancel`);
            setTransacao(res.data);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
            setConfirmationDialogOpen(false);
        }
    }

    const changePaymentStatus = async (row, status) => {
        try {
            setLoading(true);
            const res = await axios.put(`/payments/${row._id}`, { status });

            // If CANCELADA and type is DEPOSITO, cancel transaction as well
            if (status === 'CANCELADA' && transacao?.type === 'DEPOSITO') {
                await axios.put(`/transactions/${id}/`, { status: 'CANCELADA' });
            }
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);

            // Trigger page refresh
            setTransacao(null);
            const res = await axios.get(`/transactions/${id}`);
            setTransacao(res.data);

        }
    }

    const submitTokenOperation = async (e) => {
        e.preventDefault();

        // Check if all fields are filled
        if (!address || !collector) {
            alert('Preencha todos os campos');
            return;
        }

        try {
            setLoading(true);
            const res = await axios.put(`/transactions/${id}/token`, { address, collectorId: collector?._id, extraInfo });
            setTransacao(res.data);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    }



    if (loading) return (<LoadingOverlay />)
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <h1>Transação</h1>
            </Grid>


            <Grid item xs={12} sm={6} md={3}>
                <NumberCard title={'STATUS'} number={transacao?.status} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <NumberCard title={'VALOR TOTAL'} number={'R$ ' + new Intl.NumberFormat('pt-BR', { style: 'decimal', minimumFractionDigits: 2 }).format(transacao?.totalAmount)} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <NumberCard title={'VALOR REALIZADO'} number={'R$ ' + new Intl.NumberFormat('pt-BR', { style: 'decimal', minimumFractionDigits: 2 }).format(transacao?.fulfilledAmount)} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <NumberCard title={'VALOR PENDENTE'} number={'R$ ' + new Intl.NumberFormat('pt-BR', { style: 'decimal', minimumFractionDigits: 2 }).format(transacao?.totalAmount - transacao?.fulfilledAmount)} />
            </Grid>
            <Grid item xs={12}>
                <Paper elevation={3} style={{ padding: '20px 20px 40px 20px', margin: '0px 20px 0px 20px', }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <h3>Informações da Transação</h3>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider />
                        </Grid>
                        <Grid item xs={6}>
                            <label>Data de Solicitação:</label>
                            <p>{new Date(transacao?.createdAt).toLocaleDateString('pt-BR')}</p>
                        </Grid>
                        <Grid item xs={6}>
                            <label>Data da Última Atualização:</label>
                            <p>{new Date(transacao?.updatedAt).toLocaleDateString('pt-BR')}</p>
                        </Grid>
                        <Grid item xs={6}>
                            <label>Status:</label>
                            <br />
                            <Chip label={transacao?.status} color={transacao?.status === 'PENDENTE' ? 'warning' : transacao?.status === 'CONCLUIDA' ? 'success' : 'error'} />
                        </Grid>
                        <Grid item xs={6}>
                            <label>Tipo de Transação:</label>
                            <br />
                            <Chip label={transacao?.type} color={transacao?.type === 'SAQUE' ? 'secondary' : 'primary'} />
                        </Grid>
                        <Grid item xs={6}>
                            <label>Valor Total:</label>
                            <p>{currencies?.find(currency => currency.currencyCode === transacao?.currency)?.prefix + new Intl.NumberFormat('pt-BR', { style: 'decimal', minimumFractionDigits: 2 }).format(transacao?.totalAmount)}</p>
                        </Grid>
                        <Grid item xs={6}>
                            <label>Valor Realizado:</label>
                            <p>{currencies?.find(currency => currency.currencyCode === transacao?.currency)?.prefix + new Intl.NumberFormat('pt-BR', { style: 'decimal', minimumFractionDigits: 2 }).format(transacao?.fulfilledAmount)}</p>
                        </Grid>
                        <Grid item xs={6}>
                            <label>Remetente:</label>
                            <p>{users?.find(user => user._id === transacao?.senderId)?.name}</p>
                        </Grid>
                        <Grid item xs={6}>
                            <label>Destinatário:</label>
                            <p>{users?.find(user => user._id === transacao?.receiverId)?.name}</p>
                        </Grid>
                        <Grid item xs={6}>
                            <label>Moeda:</label>
                            <p>{transacao?.currency}</p>
                        </Grid>
                        {transacao?.status === 'PENDENTE' && transacao?.fulfilledAmount === 0 && ((userJwt?.role === 'OPERADOR' || userJwt?.role === 'ADMIN') || transacao?.senderId === userJwt?.id || transacao?.receiverId === userJwt?.id) &&
                            <Grid item xs={6}>
                                <button className='button-outlined' style={{ color: 'red', borderColor: 'red' }} onClick={() => setConfirmationDialogOpen(true)}>Cancelar Transação</button>
                            </Grid>
                        }
                    </Grid>
                </Paper>
            </Grid>

            {
                (userJwt?.role === 'OPERADOR' || userJwt?.role === 'ADMIN' || userJwt?.role === 'RECOLHEDOR') &&
                <Grid item xs={12}>
                    <Paper style={{ padding: '20px 20px 40px 20px', margin: '0px 20px 0px 20px', }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <h3>Informações da Operação de Token</h3>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>
                            {
                                transacao?.tokenUrl &&
                                <Grid item xs={6}>
                                    <label>Token QR CODE</label>
                                    <br />
                                    <QRCode
                                        value={`${window.location.origin}${transacao?.tokenUrl}`}

                                    />
                                </Grid>
                            }

                            <Grid item xs={6}>
                                <label>País:</label>
                                <p>{transacao?.country}</p>
                            </Grid>
                            <Grid item xs={6}>
                                <label>Estado:</label>
                                <p>{transacao?.state}</p>
                            </Grid>
                            <Grid item xs={6}>
                                <label>Cidade:</label>
                                <p>{transacao?.city}</p>
                            </Grid>
                            {transacao?.tokenUrl &&
                                <Grid item xs={6}>
                                    <label>Recolhedor Já Recebeu Token?</label>
                                    <p>{transacao?.tokenValidated ? 'Sim' : 'Não'}</p>
                                </Grid>
                            }
                            <Grid item xs={12}>
                                <label>Recolhedor Designado *</label>
                                <Autocomplete
                                    disablePortal
                                    options={collectors}
                                    getOptionLabel={(option) => option?.name} // Display the label
                                    sx={{ width: 235 }}
                                    renderInput={(params) => <TextField {...params} />}
                                    noOptionsText={'Nenhuma opção'}
                                    value={collector}
                                    disabled={userJwt?.role !== 'OPERADOR' && userJwt?.role !== 'ADMIN'}
                                    onChange={(e, newValue) => setCollector(newValue)}
                                />


                            </Grid>
                            <Grid item xs={6}>
                                <label>Endereço de Entrega *</label>
                                <TextField
                                    fullWidth
                                    value={address}
                                    disabled={userJwt?.role !== 'OPERADOR' && userJwt?.role !== 'ADMIN'}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <label>Informações Adicionais / Instruções</label>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    disabled={userJwt?.role !== 'OPERADOR' && userJwt?.role !== 'ADMIN'}
                                    value={extraInfo}
                                    onChange={(e) => setExtraInfo(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                {(userJwt?.role === 'OPERADOR' || userJwt?.role === 'ADMIN') &&
                                    <button className={transacao?.tokenUrl ? 'button-outlined' : 'button'} onClick={submitTokenOperation}>
                                        {transacao?.tokenUrl ? 'Atualizar Detalhes' : 'Salvar e Gerar Token (QR Code)'}
                                    </button>
                                }
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            }

            <Grid item xs={12} style={{ padding: '20px 20px 40px 20px', margin: '0px 20px 0px 20px', }}>
                <div style={{ display: 'flex', justifyContent: 'center', overflowX: 'hidden' }}>
                    <div style={{ maxWidth: '85vw', width: '100%', overflowX: 'auto' }}>
                        <DynamicDataGrid
                            title={shouldAddPayment() ? <>Histórico de Pagamentos <button className='button-outlined' onClick={() => navigate(`/transacoes/${id}/adicionar-pagamento`)}>Adicionar Pagamento</button></> : 'Histórico de Pagamentos'}
                            columns={columns}
                            allowMultipleSelection
                            baseUrl={`/transacoes/${id}`}
                            queryUrl={`/payments/transaction/${id}`}
                            pageTitle={'Transações'}
                            actions={
                                transacao?.status === 'PENDENTE' && (transacao?.type === 'DEPOSITO' || transacao?.type === 'TOKEN') && (userJwt?.role === 'OPERADOR' || userJwt?.role === 'ADMIN') ?
                                    [
                                        { element: <IconButton color='success'><CheckIcon /></IconButton>, tooltip: 'Aprovar Pagamento', onClick: (row) => changePaymentStatus(row, 'CONCLUIDA'), hideIf: (row) => row.status === 'CONCLUIDA' || row.status === 'CANCELADA' },
                                        { element: <IconButton color='warning'><ClearIcon /></IconButton>, tooltip: 'Reprovar Pagamento', onClick: (row) => changePaymentStatus(row, 'CANCELADA'), hideIf: (row) => row.status === 'CONCLUIDA' || row.status === 'CANCELADA' },
                                    ] : []}
                        />
                    </div>

                </div>
                <ConfirmationDialog
                    open={confirmationDialogOpen}
                    title={'Cancelar Transação'}
                    message={`Tem certeza que deseja cancelar a transação?`}
                    confirmBtnText={'Confirmar'}
                    cancelBtnText={'Cancelar'}
                    onConfirm={cancelTransaction}
                    onCancel={() => { setConfirmationDialogOpen(false) }}
                />


            </Grid>
        </Grid>
    )
}
