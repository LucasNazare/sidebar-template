import { Grid, Paper } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import logo from '../../assets/imgs/victory.png';

export default function ValidateToken() {
    const { id } = useParams();
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        async function getTransaction() {
            try {
                const response = await axios.get(`/transactions/${id}`);
                setTransaction(response.data);
            } catch (error) {
                console.log(error);
                alert('Erro ao buscar transação');
            }
            finally {
                setLoading(false);
            }

        }
        getTransaction();
    }, [id]);

    const submit = async () => {
        setLoading(true);
        try {
            const response = await axios.put(`/transactions/${id}/token/validate`);
            console.log(response);
            alert('Token validado com sucesso!');
        } catch (error) {
            console.log(error);
            alert(JSON.stringify(error.response.data));
        }

        // Close tab
        window.close();
    }

    return (
        <div>
            <Grid container spacing={3} textAlign={'center'} justifyContent={'center'} style={{ paddingTop: '40px', paddingBottom: '40px' }}>
                <Grid item xs={12}>
                    <img src={logo} alt='Logo' style={{ width: '200px' }} />
                </Grid>
                <Grid item xs={12}>
                    <h1>Validar Token</h1>
                    <p>Declare que o token foi validado e o pagamento foi realizado.</p>
                </Grid>

                <Grid item xs={12}>
                    <Paper elevation={3} style={{ padding: '20px', margin: '20px' }}>
                        {/* Valor formatted like money */}
                        <p>Valor: <strong>{transaction?.totalAmount.toLocaleString('pt-br', { style: 'currency', currency: transaction?.currency })}</strong></p>
                        <p>Moeda: <strong>{transaction?.currency}</strong></p>
                        <p>Endereço: <strong>{transaction?.address}</strong></p>
                        <p>Informações adicionais: <strong>{transaction?.extraInfo}</strong></p>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <button className='button' onClick={submit}>Validar Token</button>
                </Grid>
            </Grid>
        </div>
    )
}
