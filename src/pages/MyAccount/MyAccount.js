import React, { useEffect, useState } from 'react';
import { Divider, Grid, MenuItem, Paper, Select, TextField } from '@mui/material';
import axios from 'axios';

export default function MyAccount() {
    // States for personal 
    const [id, setId] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [phone, setPhone] = useState('');
    const [cpf, setCpf] = useState('');

    // States for bank details
    const [bank, setBank] = useState('');
    const [pix, setPix] = useState('');
    const [agency, setAgency] = useState('');
    const [account, setAccount] = useState('');
    const [digit, setDigit] = useState('');

    // States for professional details
    const [role, setRole] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // States for address
    const [cep, setCep] = useState('');
    const [address, setAddress] = useState('');
    const [number, setNumber] = useState('');
    const [complement, setComplement] = useState('');
    const [district, setDistrict] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');

    // Loading state
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log(axios.defaults.headers.common['Authorization'])
                let res = await axios.get('/auth/me');
                console.log(res.data)
                const user = res.data?.user;
                setId(user._id || '');
                setFullName(user.name || '');
                setEmail(user.email || '');
                setCountryCode(user.phoneCountryCode || '');
                setPhone(user.phone || '');
                setCpf(user.cpfCnpj || '');

                setBank(user.bank || '');
                setPix(user.pix || '');
                setAgency(user.ag || '');
                setAccount(user.cc || '');
                setDigit(user.digit || '');
                setRole(user.role || '');

                setCep(user.cep || '');
                setAddress(user.address || '');
                setNumber(user.number || '');
                setComplement(user.complement || '');
                setDistrict(user.district || '');
                setCity(user.city || '');
                setState(user.state || '');
                setCountry(user.country || '');

                setLoading(false);
            } catch (error) {
                console.error('Me error:', error);
                setLoading(false);
            }

        }
        fetchData();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            name: fullName,
            email: email,
            phone: phone,
            phoneCountryCode: countryCode,
            cpfCnpj: cpf,
            bank: bank,
            ag: agency,
            cc: account,
            digit: digit,
            pix: pix,
            role: role,
            cep: cep,
            address: address,
            number: number,
            complement: complement,
            district: district,
            city: city,
            state: state,
            country: country,
        };
        if (newPassword !== '')
            data.password = newPassword;


        // Check if all fields are filled
        if (fullName === '' || email === '' || countryCode === '' || phone === '' || cpf === '' || role === '') {
            alert('Por favor, preencha todos os campos marcados com *');
            return;
        }

        try {
            const response = await axios.put(`/users/${id}`, data);
            alert('Usuário atualizado com sucesso!');
            // navigate('/usuarios');
        }
        catch (err) {
            console.log(err);
            alert('Erro ao atualizar usuário. Por favor, tente novamente.');
        }
    }

    return (
        <Grid container spacing={0}>
            <Grid item xs={12}>
                <h1>Minha Conta</h1>
            </Grid>
            <Grid item xs={12}>
                <Paper elevation={3} style={{ padding: '20px 20px 40px 20px', margin: '0px 20px 0px 20px', }}>
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            <h3>Dados Pessoais</h3>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider />
                            <br />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={4}>
                                    <label>Nome Completo</label>
                                    <TextField
                                        placeholder='Nome Completo'
                                        fullWidth
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <label>Email</label>
                                    <TextField
                                        fullWidth
                                        placeholder='Email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Grid>
                                <Grid xs={1}>   </Grid>
                                <Grid item xs={12} sm={4}>
                                    <label>Telefone</label>
                                    <TextField
                                        placeholder='Telefone'
                                        fullWidth
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <label>CPF</label>
                                    <TextField
                                        placeholder='CPF'
                                        fullWidth
                                        value={cpf}
                                        onChange={(e) => setCpf(e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            <h3>Dados Bancários</h3>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider />
                            <br />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={4}>
                                    <label>Banco</label>
                                    <TextField
                                        placeholder='Banco'
                                        fullWidth
                                        value={bank}
                                        onChange={(e) => setBank(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <label>Pix</label>
                                    <TextField
                                        fullWidth
                                        placeholder='Pix'
                                        value={pix}
                                        onChange={(e) => setPix(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                </Grid>
                                <Grid item xs={4} sm={4}>
                                    <label>Agência</label>
                                    <TextField
                                        placeholder='Agência'
                                        fullWidth
                                        value={agency}
                                        onChange={(e) => setAgency(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={5} sm={4}>
                                    <label>Conta</label>
                                    <TextField
                                        placeholder='Conta'
                                        fullWidth
                                        value={account}
                                        onChange={(e) => setAccount(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={3} sm={4}>
                                    <label>Dígito</label>
                                    <TextField
                                        placeholder='Dígito'
                                        fullWidth
                                        value={digit}
                                        onChange={(e) => setDigit(e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid container spacing={0} style={{ marginTop: ' 10px' }}>
                        <Grid item xs={12}>
                            <h3>Dados Profissionais</h3>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider />
                            <br />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={4}>
                                    <label>Função</label>
                                    <Select
                                        fullWidth
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                    >
                                        <MenuItem value={"CLIENTE"}>Cliente</MenuItem>
                                        <MenuItem value={"OPERADOR"}>Operador</MenuItem>
                                        <MenuItem value={"RECOLHEDOR"}>Recolhedor</MenuItem>
                                        <MenuItem value={"PROVEDOR"}>Provedor</MenuItem>
                                        <MenuItem value={"ADMIN"}>Administrador</MenuItem>
                                    </Select>
                                </Grid>
                                <Grid item xs={8} sm={4}>
                                    <label>Nova Senha</label>
                                    <TextField
                                        placeholder='Nova Senha *'
                                        fullWidth
                                        type='password'
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </Grid>
                            </Grid>

                        </Grid>
                        <Grid container spacing={0}>
                            <Grid item xs={12}>
                                <h3>Endereço</h3>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider />
                                <br />
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={2}>
                                        <label>CEP</label>
                                        <TextField
                                            placeholder='CEP'
                                            fullWidth
                                            value={cep}
                                            onChange={(e) => setCep(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <label>Endereço</label>
                                        <TextField
                                            fullWidth
                                            placeholder='Endereço'
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <label>Número</label>
                                        <TextField
                                            placeholder='Número'
                                            fullWidth
                                            value={number}
                                            onChange={(e) => setNumber(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <label>Complemento</label>
                                        <TextField
                                            placeholder='Complemento'
                                            fullWidth
                                            value={complement}
                                            onChange={(e) => setComplement(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                    </Grid>
                                    <Grid item xs={4} sm={4}>
                                        <label>Bairro</label>
                                        <TextField
                                            placeholder='Bairro'
                                            fullWidth
                                            value={district}
                                            onChange={(e) => setDistrict(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={5} sm={4}>
                                        <label>Cidade</label>
                                        <TextField
                                            placeholder='Cidade'
                                            fullWidth
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={3} sm={2}>
                                        <label>Estado</label>
                                        <TextField
                                            placeholder='Estado'
                                            fullWidth
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={3} sm={2}>
                                        <label>País</label>
                                        <TextField
                                            placeholder='País'
                                            fullWidth
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <br />
                            </Grid>
                            <Grid item xs={12} style={{ textAlign: 'right' }}>
                                <button className='button' onClick={handleSubmit}>Salvar Alterações</button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    );
}

