import { Checkbox, Grid, Paper, TextField } from '@mui/material'
import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import CustomFileInputField from '../../components/Fields/CustomFileInputField';

export default function AddCurrency() {
    const navigate = useNavigate();

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('image', imageFile);
            formData.append('name', name);
            formData.append('currencyCode', currencyCode);
            formData.append('prefix', prefix);
            formData.append('spreadBuy', spreadBuy);
            formData.append('spreadSell', spreadSell);
            formData.append('isCash', isCash);
            formData.append('transferTo', transferTo);
            formData.append('transferInstructions', transferInstructions);
            formData.append('isCrypto', setIsCrypto);
            formData.append('yahooFinanceSymbol', yahooFinanceSymbol);


            const response = await axios.post('/currencies', formData);
            alert('Moeda cadastrada com sucesso!');
            navigate('/configuracoes');
        } catch (error) {
            console.error(error);
            alert('Erro ao cadastrar moeda!');
        }
    }

    return (
        <Grid container spacing={0}>
            <Grid item xs={12}>
                <h1>Cadastrar Moeda</h1>
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
                                accept='image/*'
                                label='Imagem'
                                onChange={(e) => setImageFile(e.target.files[0])}
                                btnText={imageFile ? 'Substituir Imagem' : 'Adicionar Imagem'}
                                file={imageFile}
                                setFile={setImageFile}
                                showPreview={true}
                            />
                        </Grid>
                    </Grid>
                    <div item xs={12} style={{ textAlign: 'right' }}>
                        <br />
                        <button className='button' onClick={handleSubmit}>Cadastrar</button>
                    </div>
                </Paper>
            </Grid>
        </Grid>
    )
}
