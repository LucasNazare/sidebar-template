import { Divider, Grid, Paper, TextField } from '@mui/material'
import DynamicDataGrid from '../../components/Tables/DynamicDataGrid'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import React, { useState } from 'react'
import ConfirmationDialog from '../../components/Modals/ConfirmationDialog';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

export default function Config() {
    const navigate = useNavigate();
    const [itemToBeDeleted, setItemToBeDeleted] = useState(null);
    const [reload, setReload] = useState(false);

    const columns = [
        {
            label: 'Imagem',
            key: 'image',
            disableFilter: true,
            disableSorting: true,
            isMain: true,
            render: (row) => <img src={row.image} alt={row.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }} />
        },
        {
            label: 'Moeda',
            key: 'name',
        },
        {
            label: 'Código',
            key: 'currencyCode'
        },
        {
            label: 'Spread Compra',
            key: 'spreadBuy',
            numberFilter: true,
        },
        {
            label: 'Spread Venda',
            key: 'spreadSell',
            numberFilter: true,
        }
    ];

    const deleteItem = async () => {
        try {
            await axios.delete(`/currencies/${itemToBeDeleted._id}`);
            alert('Moeda deletada com sucesso!');
            setItemToBeDeleted(null);
            setReload(!reload);
        } catch (error) {
            console.error(error);
            alert('Erro ao deletar moeda!');
        }
    }
    return (
        <Grid container spacing={0}>
            <Grid item xs={12}>
                <h1>Configurações</h1>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <Paper elevation={3} style={{ padding: '20px' }}>
                            <Grid container spacing={0}>
                                <Grid item xs={12}>
                                    <h3>Configurações Gerais</h3>
                                </Grid>
                                <Grid item xs={12}>
                                    <label>Usuário Master</label>
                                    <br />
                                    <TextField
                                        label="Usuário Master"
                                        variant="outlined"
                                    />

                                    <Grid item xs={12} style={{ textAlign: 'right' }}>
                                        <button className='button'>Salvar</button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Paper>
                        <Grid item xs={12}>
                            <br />
                            <Divider />
                            <br />
                        </Grid>
                        <Grid item xs={12}>

                            <div style={{ maxWidth: '73vw', width: '100%', overflowX: 'auto', margin: '0px 20px 0px 20px', }}>
                                <DynamicDataGrid
                                    title={<>
                                        Moedas Disponíveis
                                        <button className='button-outlined' onClick={() => navigate('/configuracoes/cadastrar-moeda')}>Adicionar Moeda</button>
                                    </>}
                                    columns={columns}
                                    loading={false}
                                    baseUrl={'/configuracoes'}
                                    queryUrl={'/currencies'}
                                    reload={reload}
                                    actions={[
                                        { element: <IconButton><EditIcon /></IconButton>, onClick: (row) => navigate(`/configuracoes/editar-moeda/${row._id}`) },
                                        { element: <IconButton><DeleteIcon /></IconButton>, onClick: (row) => setItemToBeDeleted(row) },
                                    ]}
                                />
                            </div>
                            <ConfirmationDialog
                                open={itemToBeDeleted != null}
                                title={`Tem certeza que deseja deletar a moeda ${itemToBeDeleted?.name}?`}
                                message={'Essa ação não poderá ser desfeita!'}
                                confirmBtnText={'Deletar'}
                                cancelBtnText={'Cancelar'}
                                onConfirm={deleteItem}
                                onCancel={() => { setItemToBeDeleted(null) }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}
