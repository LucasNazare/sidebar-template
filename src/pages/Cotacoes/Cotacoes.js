import { CircularProgress, Divider, Grid, IconButton, LinearProgress, MenuItem, Paper, Select, TextField } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import NumberCard from '../../components/Cards/NumberCard'
import DynamicDataGrid from '../../components/Tables/DynamicDataGrid'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import usdt from '../../assets/imgs/usdt.png'
import usd from '../../assets/imgs/usd.png'
import brl from '../../assets/imgs/brl.png'
import limit from '../../assets/imgs/limit.png'
import FormControl from '@mui/material/FormControl';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { DesignContext } from '../../contexts/DesignContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingOverlay from '../../templates/LoadingOverlay';
import ConfirmationDialog from '../../components/Modals/ConfirmationDialog';


export default function Cotacoes() {
    const { palette } = useContext(DesignContext);
    const navigate = useNavigate()

    const [currencies, setCurrencies] = useState([])
    const [user, setUser] = useState({})
    const [wallet, setWallet] = useState([])

    const [swapFrom, setSwapFrom] = useState(null);
    const [amountFrom, setAmountFrom] = useState(null);

    const [swapTo, setSwapTo] = useState(null);
    const [amountTo, setAmountTo] = useState(null);

    const [pairPrice, setPairPrice] = useState(null);
    const [preSwap, setPreSwap] = useState(null);
    const [counter, setCounter] = useState(10);

    const [open, setOpen] = useState(false);

    const [loading, setLoading] = useState(true)
    const [loadingPairPrice, setLoadingPairPrice] = useState(false)

    useEffect(() => {
        async function fetchData() {
            try {
                // Get list of currencies
                const response = await axios.get('/currencies')
                setCurrencies(response.data.data)

                // Get user data
                const responseUser = await axios.get('/auth/me')
                setUser(responseUser.data.user)
                // Convert object wallet {usd: 4000,brl: 3000} to array
                const walletArray = Object.entries(responseUser.data.user.wallet).map(([key, value]) => ({ key, value }));
                setWallet(walletArray)

                if (walletArray.length > 0) {
                    let j = {}
                    j[walletArray[0].key] = walletArray[0].value
                    setSwapFrom(j)
                    setSwapTo(j)
                }
                if (walletArray.length > 1) {
                    let j = {}
                    j[walletArray[1].key] = walletArray[1].value
                    setSwapTo(j)
                }
            }
            catch (err) {
                console.log(err)
            }
            finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])


    const handleSwapToChange = (e) => {
        e.preventDefault()
        setSwapTo(e.target.value);
    }

    const handleSwapFromChange = (e) => {
        e.preventDefault()
        setSwapFrom(e.target.value);
    }

    const reverseButton = (e) => {
        e.preventDefault()

        // Revert swapFrom and swapTo with amount
        let aux = swapFrom
        setSwapFrom(swapTo)
        setSwapTo(aux)
        setAmountTo(0)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!swapFrom || !swapTo || !amountFrom)
            return alert('Preencha todos os campos!');

        setLoadingPairPrice(true)
        try {
            // Get pair price
            const response = await axios.get(
                `/swaps/pairPrice?currencyFrom=${swapFrom.yahooFinanceSymbol}&currencyTo=${swapTo.yahooFinanceSymbol}&amountFrom=${amountFrom}`);
            setPairPrice(response.data.price)
            setPreSwap(response.data.preSwap)
            setAmountTo(amountFrom * response.data.price)
            // Count down to 0
            let i = 10
            const interval = setInterval(() => {
                i--
                setCounter(i)
            }
                , 1000)

            // After 5 seconds, clear interval and reset counter
            setTimeout(() => {
                clearInterval(interval)
                setCounter(10)
                setPairPrice(null)
                setPreSwap(null)
                setAmountTo(null)
                setOpen(false);
            }, 10 * 1000);

        } catch (error) {
            console.error(error);
            alert('Erro ao obter cotação!');
        }
        finally {
            setLoadingPairPrice(false);
        }
    }

    const handleSwap = async (e) => {
        e.preventDefault();
        if (!swapFrom || !swapTo || !amountFrom)
            return alert('Preencha todos os campos!');

        if (!preSwap)
            return alert('Obtenha a cotação antes de travar!');


        setLoading(true);
        try {
            const response = await axios.post(`/swaps/${preSwap?._id}`);


            // Update user data
            const responseUser = await axios.get('/auth/me')
            setUser(responseUser.data.user)

            // Convert object wallet {usd: 4000,brl: 3000} to array
            const walletArray = Object.entries(responseUser.data.user.wallet).map(([key, value]) => ({ key, value }));
            setWallet(walletArray)

            // Reset fields
            setAmountTo(null)
            setPairPrice(null)
            setPreSwap(null)

            alert('Transação realizada com sucesso!');


        }
        catch (err) {
            console.log(err)
        }
        finally {
            setLoading(false);
            setOpen(false);
        }

    }

    if (loading)
        return <LoadingOverlay />

    return (
        <Grid container spacing={1} justifyContent={'center'}>
            <Grid item xs={12}>
                <h1>Cotações</h1>
            </Grid>
            <Grid item xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={12}>
                <h2>Meu Saldo</h2>
            </Grid>
            {
                wallet?.map((item, index) => {
                    return (
                        <Grid item xs={12} sm={6} md={3}>
                            <NumberCard
                                title={item.key}
                                number={parseFloat(item.value).toFixed(2)}
                                img={
                                    item.key === 'BRL'
                                        ? brl
                                        : item.key === 'USD'
                                            ? usd
                                            : item.key === 'USDT'
                                                ? usdt
                                                : limit
                                }
                            />
                        </Grid>
                    )
                })
            }
            <Grid item xs={12} sm={6} md={3}>
                <br />
            </Grid>


            <Grid item xs={12} style={{ textAlign: 'left' }}>
                <button className='button-outlined' onClick={() => navigate('/carteira/deposito')}>Realizar Depósito</button>
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
                <Paper elevation={3} style={{ padding: '20px 20px 40px 20px', margin: '0px 20px 0px 20px', }}>
                    <Grid container spacing={0} justifyContent={'center'}>

                        <Grid item xs={12} style={{ textAlign: 'center' }}>
                            <h1>Swaps</h1>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider />
                        </Grid>
                        <Grid item xs={12}>
                            <br />
                        </Grid>

                        <Grid item xs={12}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                <div style={{ textAlign: 'left' }}>
                                    <label>Moeda</label>
                                    <br />
                                    <Select
                                        value={swapFrom}
                                        onChange={handleSwapFromChange}
                                        style={{ width: '150px' }}
                                    >
                                        {
                                            currencies?.map((item) => (
                                                <MenuItem value={item} key={item._id}>
                                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                                        <img
                                                            src={
                                                                item.currencyCode === 'BRL' ? brl :
                                                                    item.currencyCode === 'USD' ? usd :
                                                                        item.currencyCode === 'USDT' ? usdt :
                                                                            limit
                                                            }
                                                            width="18"
                                                            height="18"
                                                            style={{ padding: '5px' }}
                                                            alt={item.currencyCode}
                                                        />
                                                        {item.currencyCode}
                                                    </div>
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <label>Quantidade</label>
                                    <br />
                                    <TextField
                                        value={amountFrom}
                                        onChange={(e) => setAmountFrom(e.target.value)}
                                        placeholder='Quantidade'
                                        type='number'
                                        disabled={pairPrice ? true : false}
                                    />
                                </div>
                            </div>
                        </Grid>


                        <Grid item xs={12}>
                            <br />
                        </Grid>


                        <Grid item xs={12}>
                            <IconButton onClick={reverseButton} disabled={pairPrice ? true : false}>
                                <SwapHorizIcon style={{ fontSize: '5rem', color: palette.secondaryColor }} />
                            </IconButton>

                        </Grid>

                        <Grid item xs={12}>
                            <br />
                        </Grid>

                        <Grid item xs={12}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>

                                <div style={{ textAlign: 'left' }}>
                                    <label>Quantidade</label>
                                    <br />
                                    <TextField
                                        placeholder='Quantidade'
                                        value={amountTo}
                                        type='number'
                                        disabled
                                    />
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <label>Moeda</label>
                                    <br />
                                    <Select
                                        value={swapTo}
                                        onChange={handleSwapToChange}
                                        style={{ width: '150px' }}
                                    >
                                        {
                                            currencies?.map((item) => (
                                                <MenuItem value={item} key={item._id}>
                                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                                        <img
                                                            src={
                                                                item.currencyCode === 'BRL' ? brl :
                                                                    item.currencyCode === 'USD' ? usd :
                                                                        item.currencyCode === 'USDT' ? usdt :
                                                                            limit
                                                            }
                                                            width="18"
                                                            height="18"
                                                            style={{ padding: '5px' }}
                                                            alt={item.currencyCode}
                                                        />
                                                        {item.currencyCode}
                                                    </div>
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>

                                </div>
                            </div>
                        </Grid>


                        <Grid item xs={12}>
                            <br />
                        </Grid>



                        <Grid item xs={12}>
                            {!pairPrice && !loadingPairPrice && <button className='button' onClick={handleSubmit}>Obter Cotação</button>}
                            {
                                !pairPrice && loadingPairPrice &&
                                <button className='button' disabled><CircularProgress /></button>
                            }
                            {pairPrice && <LinearProgress />}
                            {pairPrice &&
                                <Paper style={{ padding: '20px' }}>
                                    <p>Cotação travada por {counter} segundos</p>
                                    <h3>Preço: {pairPrice < 1 ? 1 / pairPrice : pairPrice}</h3>
                                    <p style={{ color: 'red' }}>Taxas: {preSwap?.currencyToFee}</p>
                                    <p>Valor Líquido: {swapTo?.currencyCode} {preSwap?.netAmountTo}</p>
                                    {
                                        !loadingPairPrice &&
                                        <button className='button' onClick={() => setOpen(true)}>Realizar Transação</button>
                                    }

                                </Paper>
                            }
                            <ConfirmationDialog
                                open={open}
                                onClose={() => setOpen(false)}
                                title={'Confirmação de Transação'}
                                message={`Deseja realizar a transação de ${amountFrom} ${swapFrom?.currencyCode} para ${amountTo} ${swapTo?.currencyCode}?`}
                                onConfirm={handleSwap}
                                onCancel={() => setOpen(false)}
                                confirmBtnText={'Confirmar'}
                                cancelBtnText={'Cancelar'}
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </Grid >
        </Grid >
    )
}
