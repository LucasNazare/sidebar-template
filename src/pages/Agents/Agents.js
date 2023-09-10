import { Grid } from '@mui/material'
import React from 'react'
import NumberCard from '../../components/Cards/NumberCard'
import InfiniteTable from '../../components/Tables/InfiniteTable'

export default function Agents() {
    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <h1>Agentes</h1>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <NumberCard title={'Agentes'} number={20} items={[{ number: 2, text: ' R2s' }, { number: 14, text: ' R1s' }, { number: 4, text: ' R0s' }]} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <NumberCard title={'Gross'} number={4} items={[{ number: 4, text: ' R2s' }, { number: 14, text: ' R1s' }, { number: 4, text: ' R0s' }]} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <NumberCard title={'Net'} number={3} items={[{ number: 2, text: ' R2s' }, { number: 14, text: ' R1s' }, { number: 4, text: ' R0s' }]} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <NumberCard title={'Distratos'} number={1} items={[{ number: 2, text: ' R2s' }, { number: 14, text: ' R1s' }, { number: 4, text: ' R0s' }]} />
            </Grid>

            <Grid item xs={12}>
                <InfiniteTable />
            </Grid>
        </Grid>
    )
}
