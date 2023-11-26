import { Checkbox, Grid, Paper, TextField } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import CustomFileInputField from '../../components/Fields/CustomFileInputField';
import LoadingOverlay from '../../templates/LoadingOverlay';

export default function EditCurrency() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [currency, setCurrency] = useState(null);
    const [name, setName] = useState('');
    const [currencyCode, setCurrencyCode] = useState('');
    const [prefix, setPrefix] = useState('');
    const [spreadBuy, setSpreadBuy] = useState('');
    const [spreadSell, setSpreadSell] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [isCash, setIsCash] = useState(false);
    const [transferTo, setTransferTo] = useState('');
    const [transferInstructions, setTransferInstructions] = useState('');
    const [isCrypto, setIsCrypto] = useState(false);
    const [yahooFinanceSymbol, setYahooFinanceSymbol] = useState('');

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getCurrency = async () => {
            try {
                const response = await axios.get(`/currencies/${id}`);
                setCurrency(response.data);
                setName(response.data.name);
                setCurrencyCode(response.data.currencyCode);
                setPrefix(response.data.prefix);
                setSpreadBuy(response.data.spreadBuy);
                setSpreadSell(response.data.spreadSell);
                setIsCash(response.data.isCash ? true : false);
                setTransferTo(response.data.transferTo);
                setTransferInstructions(response.data.transferInstructions);
                setIsCrypto(response.data.isCrypto ? true : false);
                setYahooFinanceSymbol(response.data.yahooFinanceSymbol);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        }
        getCurrency();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('image', imageFile);
            formData.append('name', name);
            formData.append('currencyCode', currencyCode);
            formData.append('prefix', prefix);
            formData.append('spreadBuy', spreadBuy);
            formData.append('spreadSell', spreadSell);
            formData.append('isCash', isCash ? 'true' : 'false');
            formData.append('transferTo', transferTo);
            formData.append('transferInstructions', transferInstructions);
            formData.append('isCrypto', isCrypto ? 'true' : 'false');
            formData.append('yahooFinanceSymbol', yahooFinanceSymbol);

            const response = await axios.put(`/currencies/${id}`, formData);
            alert('Moeda editada com sucesso!');
            navigate('/configuracoes');
        } catch (error) {
            console.error(error);
            alert('Erro ao editar moeda!');
        }
        finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <LoadingOverlay />
    }

    return (
        <Grid container spacing={0}>
            <Grid item xs={12}>
                <h1>Editar Moeda</h1>
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
                        <Grid item xs={12}>
                            <label>Prefixo</label>
                            <TextField label="Prefixo" variant="outlined" fullWidth value={prefix} onChange={(e) => setPrefix(e.target.value)} />
                        </Grid>
                        <Grid item xs={6}>
                            <label>Instruções de Transferência</label>
                            <TextField label="Instruções de Transferência" variant="outlined" fullWidth value={transferInstructions} onChange={(e) => setTransferInstructions(e.target.value)} />
                        </Grid>
                        <Grid item xs={6}>
                            <label>Conta de Transferência</label>
                            <TextField label="Conta de Transferência" variant="outlined" fullWidth value={transferTo} onChange={(e) => setTransferTo(e.target.value)} />
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
                        <Grid item xs={12}>
                            <label>Dinheiro Vivo</label>
                            <Checkbox checked={isCash} onChange={(e) => setIsCash(e.target.checked)}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <label>Criptomoeda</label>
                            <Checkbox checked={isCrypto} onChange={(e) => setIsCrypto(e.target.checked)}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <label>Símbolo Yahoo Finance</label>
                            <TextField label="Símbolo Yahoo Finance"
                                variant="outlined"
                                fullWidth
                                value={yahooFinanceSymbol}
                                onChange={(e) => setYahooFinanceSymbol(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <CustomFileInputField
                                label='Imagem'
                                file={imageFile}
                                setFile={setImageFile}
                                onChange={(e) => setImageFile(e.target.files[0])}
                                accept='image/*'
                                btnText={'Substituir Imagem'}
                                showPreview
                            />
                        </Grid>

                    </Grid>
                    <div item xs={12} style={{ textAlign: 'right' }}>
                        <br />
                        <button className='button' onClick={handleSubmit}>Salvar</button>
                    </div>
                </Paper>
            </Grid>
        </Grid>
    )
}
