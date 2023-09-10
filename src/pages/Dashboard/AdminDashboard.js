import { Grid } from '@mui/material'
import React from 'react'
import NumberCard from '../../components/Cards/NumberCard'

export default function AdminDashboard() {
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
        </Grid>
    )
}
