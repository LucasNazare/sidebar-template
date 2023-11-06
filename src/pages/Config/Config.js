import { Divider, Grid, Paper } from '@mui/material'
import DynamicDataGrid from '../../components/Tables/DynamicDataGrid'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Config() {
    const navigate = useNavigate();
    const columns = [
        {
            label: 'Moeda',
            key: 'name',
            isMain: true
        },
        {
            label: 'Código',
            key: 'currencyCode'
        },
        {
            label: 'Spread Compra',
            key: 'spreadBuy',
        },
        {
            label: 'Spread Venda',
            key: 'spreadSell',
        },
        {
            label: 'Ações',
            key: 'actions',
            render: (row) => (
                <div>
                    <IconButton onClick={() => navigate(`/usuarios/${row.id}`)}><EditIcon /></IconButton>
                    <IconButton><DeleteIcon /></IconButton>
                </div>
            )
        },
    ];
    return (
        <Grid container spacing={0}>
            <Grid item xs={12}>
                <h1>Configurações</h1>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={0}>
                    {/* <Grid item xs={12}>
                        <h3>Taxas e Spreads</h3>
                    </Grid>
                    <Grid item xs={12}>
                        <br />
                        <Divider />
                        <br />
                    </Grid> */}
                    <Grid item xs={12}>
                        <h3>Moedas Disponíveis</h3>
                        <br />
                        <button className='button-outlined' onClick={() => navigate('/configuracoes/cadastrar-moeda')}>Adicionar Moeda</button>
                        <br />
                        <DynamicDataGrid
                            columns={columns}
                            rows={[]}
                            loading={false}
                            baseUrl={'/configuracoes'}
                            queryUrl={'/currencies'}
                        />

                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}
