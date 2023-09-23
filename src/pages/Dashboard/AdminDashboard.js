import { Grid } from '@mui/material'
import React from 'react'
import NumberCard from '../../components/Cards/NumberCard'
import DynamicDataGrid from '../../components/Tables/DynamicDataGrid'

export default function AdminDashboard() {
    const columns = [{ label: 'Name', key: 'name', onSort: () => console.log('Sort clicked'), isMain: true }, { label: 'Age', key: 'age' }, { label: 'Address', key: 'address', disableSorting: true }];
    const rows = [
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
                <NumberCard title={'Agentes'} number={20} items={[{ number: 2, text: ' R2s' }, { number: 14, text: ' R1s' }, { number: 4, text: ' R0s' }]} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <NumberCard title={'Vendas'} number={4} items={[{ number: 4, text: ' R2s' }, { number: 14, text: ' R1s' }, { number: 4, text: ' R0s' }]} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <NumberCard title={'Faturamento'} number={'R$36.000,00'} items={[{ number: 2, text: ' R2s' }, { number: 14, text: ' R1s' }, { number: 4, text: ' R0s' }]} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <NumberCard title={'Custos'} number={'R$28.000,00'} items={[{ number: 2, text: ' R2s' }, { number: 14, text: ' R1s' }, { number: 4, text: ' R0s' }]} />
            </Grid>
            <Grid item xs={12}>
                <div style={{ display: 'flex', justifyContent: 'center', overflowX: 'hidden' }}>
                    <div style={{ maxWidth: '85vw', width: '100%', overflowX: 'auto' }}>
                        <DynamicDataGrid columns={columns} rows={rows} allowMultipleSelection actions={[
                            { label: 'Edit', onClick: (row) => console.log('Edit clicked', row) },
                            { label: 'Delete', onClick: (row) => console.log('Delete clicked', row), },
                        ]} />
                    </div>

                </div>
            </Grid>
        </Grid>
    )
}
