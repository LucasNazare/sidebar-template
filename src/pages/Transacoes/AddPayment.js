import axios from 'axios';
import React, { useContext, useEffect, useMemo, useState } from 'react'
import LoadingOverlay from '../../templates/LoadingOverlay';
import { useNavigate, useParams } from 'react-router-dom';
import { Divider, Grid, MenuItem, Paper, Select, TextField } from '@mui/material';

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

export default function AddPayment() {
    const { id } = useParams();
    const { userJwt } = useContext(AuthContext);
    const navigate = useNavigate();

    const [transaction, setTransaction] = useState(null);
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    const [amount, setAmount] = useState(0);
    const [receiptFile, setReceiptFile] = useState(null);

    const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get transaction
                const res = await axios.get(`/transactions/${id}`);
                setTransaction(res.data);
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
            // Validation checks
            if (amount <= 0) {
                alert('Quantidade deve ser maior que 0');
                return;
            }

            if (!receiptFile) {
                alert('Adicione o comprovante de pagamento');
                return;
            }

            if (!['image/jpeg', 'image/png', 'application/pdf'].includes(receiptFile.type)) {
                alert('Formato do arquivo inválido');
                return;
            }

            // Create form data
            const formData = new FormData();
            if (transaction.type === 'TOKEN')
                formData.append('status', 'PENDENTE')
            else
                formData.append('status', 'CONCLUIDA')
            formData.append('amount', amount);
            formData.append('currency', selectedCurrency || transaction.currency);
            formData.append('receipt', receiptFile, receiptFile.name); // Ensure the filename is included
            formData.append('userId', userJwt.id);
            formData.append('transactionId', id);
            formData.append('type', transaction.type);

            setLoading(true);

            // Send request with appropriate headers
            const res = await axios.post(`/payments`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // This is crucial for FormData
                }
            });

            alert('Pagamento adicionado com sucesso');
            navigate(`/transacoes/${id}`);

        } catch (error) {
            console.error(error);
            alert('Erro ao adicionar pagamento');
        } finally {
            setLoading(false);
        }

    };



    if (loading) return <LoadingOverlay />
    return (
        <Grid container spacing={1} justifyContent={'center'}>
            <Grid item xs={12}>
                <h1>Adicionar Pagamento</h1>
            </Grid>
            <Grid item xs={12}>
                <Divider />
            </Grid>

            <Grid item xs={12} style={{ textAlign: 'center' }}>
                <Paper elevation={3} style={{ padding: '20px 20px 40px 20px', margin: '0px 20px 0px 20px', }}>
                    <Grid container spacing={3} justifyContent={'center'}>

                        <Grid item xs={12} style={{ textAlign: 'center' }}>
                            <h1>Cadastrar pagamento efetuado na transação</h1>
                            <p>Faça o upload do comprovante de pagamento e adicione o valor pago</p>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider />
                        </Grid>

                        <Grid item xs={12}>
                            <CustomFileUpload
                                btnText={receiptFile ? 'Substituir Comprovante' : 'Adicionar Comprovante'}
                                file={receiptFile}
                                setFile={setReceiptFile}
                                accept={'image/*,application/pdf'}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                <div style={{ textAlign: 'left' }}>
                                    <label>Valor</label>
                                    <br />

                                    <TextField
                                        placeholder='Valor'
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        type='number'
                                    />
                                </div>
                            </div>
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
                title={'Adicionar Pagamento'}
                message={`Tem certeza que deseja confirmar o pagamento no valor de ${new Intl.NumberFormat('pt-BR', { style: 'decimal', minimumFractionDigits: 2 }).format(amount)} ${transaction?.currency}?`}
                confirmBtnText={'Confirmar'}
                cancelBtnText={'Cancelar'}
                onConfirm={submit}
                onCancel={() => { setOpenConfirmationDialog(false) }}
            />
        </Grid>

    )
}
