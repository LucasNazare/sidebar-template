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


export default function AdminDashboard() {
    const columns = [{ label: 'Campo Teste', key: 'name', onSort: () => console.log('Sort clicked'), isMain: true },
    { label: 'Teste', key: 'age', width: '75px', dateFilter: true, },
    { label: 'Testando', key: 'address', disableSorting: false, width: '200px' }, { label: 'Pix', key: 'pix', disableSorting: true }];


    const rows = [
        { name: 'John', age: 30, address: '123 Main St' },
        { name: 'Jane', age: 25, address: '456 Oak St' },
        { name: 'John', age: 30, address: '123 Main St' },
        { name: 'JanTestee', age: 25, address: '456 Oak St', pix: '1291392342' },
        { name: 'John', age: 30, address: '123 Main St' },
        { name: 'Jane', age: 25, address: '456 Oak St' },
        { name: 'John', age: 30, address: '123 Main St' },
        { name: 'Jane', age: 25, address: '456 Oak St' },
        // ... more rows
    ];
    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <h1>Dashboard</h1>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <NumberCard title={'BRL'} number={'R$573.000,00'} img={brl} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <NumberCard title={'USD'} number={'R$230.000,00'} img={usd} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <NumberCard title={'USDT'} number={'R$360.000,00'} img={usdt} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <NumberCard title={'LIMITE'} number={'R$280.000,00'} img={limit} />
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
                            baseUrl={'/dashboard'}
                            pageTitle={'Transações'}
                        />
                    </div>

                </div>
            </Grid>
        </Grid>
    )
}
