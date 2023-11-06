import { Grid, IconButton } from '@mui/material'
import React from 'react'
import NumberCard from '../../components/Cards/NumberCard'
import DynamicDataGrid from '../../components/Tables/DynamicDataGrid'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import usdt from '../../assets/imgs/usdt.png'
import usd from '../../assets/imgs/usd.png'
import brl from '../../assets/imgs/brl.png'
import limit from '../../assets/imgs/limit.png'


export default function Transacoes() {
    const columns = [
        {
            label: 'Tipo de Transação',
            key: 'type',
            onSort: () => console.log('Ordenar por Tipo'),
            isMain: true
        },
        {
            label: 'Data',
            key: 'date',
            onSort: () => console.log('Ordenar por Data'),
            dateFilter: true
        },
        {
            label: 'ID do Remetente',
            key: 'senderId',
            onSort: () => console.log('Ordenar por ID do Remetente'),
        },
        {
            label: 'ID do Destinatário',
            key: 'receiverId',
            onSort: () => console.log('Ordenar por ID do Destinatário'),
        },
        {
            label: 'Valor',
            key: 'amount',
            onSort: () => console.log('Ordenar por Valor'),
        },
        {
            label: 'Moeda',
            key: 'currencyCode',
            onSort: () => console.log('Ordenar por Moeda'),
        }
    ];



    const rows = [
        {
            type: 'swap',
            date: '2023-10-30',
            senderId: '123',
            receiverId: '456',
            amount: 100.00,
            currencyCode: 'USD'
        },
        {
            type: 'deposit',
            date: '2023-10-29',
            senderId: '789',
            receiverId: '012',
            amount: 200.50,
            currencyCode: 'EUR'
        },
        {
            type: 'withdrawal',
            date: '2023-10-28',
            senderId: '345',
            receiverId: '678',
            amount: 150.75,
            currencyCode: 'GBP'
        }
    ];
    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <h1>Transações</h1>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <NumberCard title={'TRANSAÇÕES REALIZADAS'} number={'68'} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <NumberCard title={'VOLUME'} number={'$230.000,00'} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <NumberCard title={'USDT'} number={'R$360.000,00'} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <NumberCard title={'LIMITE'} number={'R$280.000,00'} />
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
                                { element: <IconButton><EditIcon /></IconButton>, onClick: (row) => console.log('Edit clicked', row) },
                                { element: <IconButton><DeleteIcon /></IconButton>, onClick: (row) => console.log('Delete clicked', row), },
                            ]}
                            bulkActions={[{ label: 'Deletar itens selecionados', onClick: () => alert('Deletados') }]}
                            baseUrl={'/transacoes'}
                            pageTitle={'Transações'}
                        />
                    </div>

                </div>
            </Grid>
        </Grid>
    )
}
