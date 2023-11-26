import axios from 'axios';
import React, { useContext, useEffect, useMemo, useState } from 'react'
import LoadingOverlay from '../../templates/LoadingOverlay';
import { useNavigate, useParams } from 'react-router-dom';
import { Collapse, Divider, Grid, MenuItem, Paper, Select, TextField } from '@mui/material';

import usdt from '../../assets/imgs/usdt.png'
import usd from '../../assets/imgs/usd.png'
import brl from '../../assets/imgs/brl.png'
import limit from '../../assets/imgs/limit.png'
import ConfirmationDialog from '../../components/Modals/ConfirmationDialog';
import CustomFileUpload from '../../components/Fields/CustomFileInputField';
import { AuthContext } from '../../contexts/AuthContext';

const imgs = {
    'BRL': brl,
    'USD': usd,
    'USDT': usdt,
    'LIMITE': limit
}

export default function Deposit() {
    const navigate = useNavigate();
    const { userJwt } = useContext(AuthContext);

    const [currencies, setCurrencies] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    const [amount, setAmount] = useState(0);
    const [receiptFile, setReceiptFile] = useState(null);

    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [date, setDate] = useState(null);

    const [secondStep, setSecondStep] = useState(false);

    const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get currencies
                const res = await axios.get('/currencies');
                setCurrencies(res.data.data);
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

        if (selectedCurrency?.isCash) {
            try {
                // Check country
                if (!country) {
                    alert('Digite o país');
                    return;
                }

                // Check state
                if (!state) {
                    alert('Digite o estado');
                    return;
                }

                // Check city
                if (!city) {
                    alert('Digite a cidade');
                    return;
                }

                // Check date
                if (!date) {
                    alert('Digite a data');
                    return;
                }

                // Check amount bigger than 0
                if (amount <= 0) {
                    alert('Quantidade deve ser maior que 0');
                    return;
                }

                // Create a new depost transaction
                const data = {
                    type: 'TOKEN',
                    totalAmount: amount,
                    currency: selectedCurrency?.currencyCode,
                    receiverId: userJwt?.id,
                    status: 'PENDENTE',
                    senderId: '',
                    country,
                    state,
                    city,
                }
                const res = await axios.post(`/transactions`, data);
                const transaction = res.data;

                navigate(`/transacoes/${transaction._id}/`);

            }
            catch (error) {
                console.error(error);
                alert('Erro ao adicionar fundos');
                return;
            }
            finally {
                setOpenConfirmationDialog(false);
                setLoading(false);
            }
        }
        else {

            try {
                // Check amount bigger than 0
                if (amount <= 0) {
                    alert('Quantidade deve ser maior que 0');
                    return;
                }

                // Check receipt file
                if (!receiptFile) {
                    alert('Adicione um comprovante');
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
                // Create a new depost transaction
                const data = {
                    type: 'DEPOSITO',
                    totalAmount: amount,
                    currency: selectedCurrency?.currencyCode,
                    receiverId: userJwt?.id,
                    status: 'PENDENTE',
                    senderId: '',
                }
                const res = await axios.post(`/transactions`, data);
                const transaction = res.data;

                // Add pending payment to transaction
                const formData = new FormData();
                formData.append('receipt', receiptFile);
                formData.append('transactionId', transaction._id);
                formData.append('type', transaction.type);
                formData.append('amount', transaction.totalAmount);
                formData.append('currency', transaction.currency);
                formData.append('status', transaction.status);
                formData.append('userId', transaction.receiverId);

                // print form fields
                for (var pair of formData.entries()) {
                    console.log(pair[0] + ', ' + pair[1]);
                }

                await axios.post(`/payments`, formData);

                alert('Depósito realizado com sucesso, aguarde a confirmação do pagamento.');
                navigate(`/carteira`);
            }
            catch (error) {
                console.error(error);
            }
            finally {
                setOpenConfirmationDialog(false);
                setLoading(false);
            }
        }
    }

    if (loading) return <LoadingOverlay />
    return (
        <Grid container spacing={1} justifyContent={'center'}>
            <Grid item xs={12}>
                <h1>Realizar Depósito</h1>
            </Grid>
            <Grid item xs={12}>
                <Divider />
            </Grid>

            <Grid item xs={12} style={{ textAlign: 'center' }}>
                <Paper elevation={3} style={{ padding: '20px 20px 40px 20px', margin: '0px 20px 0px 20px', }}>
                    <Grid container spacing={0} justifyContent={'center'}>

                        <Grid item xs={12} style={{ textAlign: 'center' }}>
                            <h1>Realize um depósito e adicione fundos à sua carteira</h1>
                            <p>Siga as instruções abaixo para fazer um depósito e depois faça o upload do comprovante para adicionar fundos à sua carteira.</p>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider />
                        </Grid>
                        <Grid item xs={12}>
                            <br />
                        </Grid>
                        <Grid item xs={12}>
                            <p>{selectedCurrency?.transferInstructions}</p>
                        </Grid>
                        <Grid item xs={12}>
                            <p style={{ cursor: 'pointer' }} onClick={() => {
                                navigator.clipboard.writeText(selectedCurrency?.transferTo)
                                alert('Copiado para a área de transferência')
                            }}>{selectedCurrency?.transferTo}</p>
                        </Grid>


                        <Grid item xs={12}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                <Collapse in={!secondStep}>
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
                                                                <img src={imgs[currency?.currencyCode]} width="18" height="18" style={{ padding: '5px' }} />
                                                                {currency.currencyCode}
                                                            </div>
                                                        </MenuItem>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </div>
                                </Collapse>
                                <Collapse in={secondStep}>
                                    <div style={{ textAlign: 'left' }}>
                                        <Grid container spacing={3}>
                                            <div style={{ textAlign: 'left' }}>
                                                <label>Moeda</label>
                                                <p>{selectedCurrency?.currencyCode}</p>
                                            </div>
                                            <Grid item xs={12}>
                                                <label>Quantidade</label>
                                                <br />
                                                <TextField
                                                    placeholder='Quantidade'
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                    type='number'
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <label>País</label>
                                                <br />
                                                <TextField
                                                    placeholder='País'
                                                    value={country}
                                                    onChange={(e) => setCountry(e.target.value)}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <label>Estado</label>
                                                <br />
                                                <TextField
                                                    placeholder='Estado'
                                                    value={state}
                                                    onChange={(e) => setState(e.target.value)}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <label>Cidade</label>
                                                <br />
                                                <TextField
                                                    placeholder='Cidade'
                                                    value={city}
                                                    onChange={(e) => setCity(e.target.value)}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <label>{`Data`}</label><br />
                                                <TextField
                                                    type="date"
                                                    value={date}
                                                    onChange={(e) => setDate(e.target.value)}
                                                    InputLabelProps={{
                                                        shrink: true,

                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </div>
                                </Collapse>
                                <Collapse in={!secondStep}>
                                    <div style={{ textAlign: 'left' }}>
                                        <button className='button-outlined' onClick={() => setSecondStep(true)}>
                                            {selectedCurrency?.isCash ? 'Solicitar operação de Vivo' : 'Pagamento Realizado'}
                                        </button>
                                    </div>
                                </Collapse>
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <br />
                        </Grid>
                        <Grid item xs={12}>

                            <Collapse in={secondStep && !selectedCurrency?.isCash}>
                                <CustomFileUpload
                                    btnText={receiptFile ? 'Substituir Comprovante' : 'Adicionar Comprovante'}
                                    file={receiptFile}
                                    setFile={setReceiptFile}
                                    accept={'image/*,application/pdf'}
                                />
                            </Collapse>
                        </Grid>
                        <Grid item xs={12}>
                            <br />
                        </Grid>
                        <Grid item xs={12}>
                            <Collapse in={secondStep}>
                                <br />
                                <button className='button' onClick={() => {
                                    if (!selectedCurrency) {
                                        alert('Selecione uma moeda');
                                        return;
                                    }

                                    if (!amount) {
                                        alert('Digite uma quantidade');
                                        return;
                                    }
                                    setOpenConfirmationDialog(true)
                                }}>
                                    {selectedCurrency?.isCash ? 'Iniciar operação de Vivo' : 'Confirmar depósito'}
                                </button>
                            </Collapse>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <ConfirmationDialog
                open={openConfirmationDialog}
                title={'Adicionar Fundos'}
                message={
                    selectedCurrency?.isCash ?
                        `Tem certeza que deseja iniciar uma operação de Vivo? Você depositará ${new Intl.NumberFormat('pt-BR', { style: 'decimal', minimumFractionDigits: 2 }).format(amount)} ${selectedCurrency?.currencyCode} (${selectedCurrency?.name}) em dinheiro e receberá o valor em créditos na plataforma.`
                        :
                        `Você já realizou o depósito? Confirme para adicionar ${new Intl.NumberFormat('pt-BR', { style: 'decimal', minimumFractionDigits: 2 }).format(amount)} ${selectedCurrency?.currencyCode} (${selectedCurrency?.name}) à sua carteira.`
                }
                confirmBtnText={'Adicionar'}
                cancelBtnText={'Cancelar'}
                onConfirm={submit}
                onCancel={() => { setOpenConfirmationDialog(false) }}
            />
        </Grid>

    )
}
