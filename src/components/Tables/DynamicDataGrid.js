import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    IconButton,
    Button,
    TablePagination,
    Skeleton,
    Grid,
    TextField,
    Divider,
    Select,
    MenuItem,
    Menu,
    Autocomplete
} from '@mui/material';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import { styled } from '@mui/system';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const StyledTableRow = styled(TableRow)({
    '&:hover': {
        backgroundColor: 'rgba(211, 211, 211, 0.5)',
        '& .main-cell': {
            backgroundColor: 'rgba(211, 211, 211, 0.0) !important',
        },
    },
});

const sortRows = (rows, config) => {
    if (!config || !config.key) return rows;

    return [...rows].sort((a, b) => {
        if (a[config.key] < b[config.key]) {
            return config.direction === 'asc' ? -1 : 1;
        }
        if (a[config.key] > b[config.key]) {
            return config.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });
};

const ResponsiveTable = ({ columns, rows: initialRows, allowMultipleSelection, actions, onSort, bulkActions, baseUrl, pageTitle, queryUrl, reload, title }) => {
    const navigate = useNavigate();
    const [selectedRows, setSelectedRows] = useState([]);
    const [rows, setRows] = useState(initialRows);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalRows, setTotalRows] = useState(0); // Set it based on server response

    const [filterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useState({});
    const [appliedFilters, setAppliedFilters] = useState({});

    const [anchorBulk, setAnchorBulk] = useState(null);

    const [loading, setLoading] = useState(false);

    const stickyStyle = {
        position: 'sticky',
        left: 0,
        backgroundColor: 'white',
        zIndex: 1,
    };

    useEffect(() => {
        const url = buildUrl();

        // Update URL
        window.history.replaceState(null, pageTitle, url)

        // Fetch Data
        fetchData();

        // Reset Loading State
        setLoading(false);
    }, [appliedFilters, sortConfig, page, rowsPerPage, reload]);

    useEffect(() => {
        setRows(sortRows(initialRows, sortConfig));
    }, [initialRows, sortConfig]);

    const fetchData = async () => {
        const url = buildUrl();
        try {
            // Get query params from URL
            const params = new URLSearchParams(window.location.search);
            // Get page number from URL
            const page = params.get('page') || 0;
            // Get rows per page from URL
            const rowsPerPage = params.get('rowsPerPage') || 5;
            // Get sort key from URL
            const sort = params.get('sort') || '';
            // Get sort direction from URL
            const direction = params.get('direction') || 'asc';
            // Get filters from URL
            const filters = {};
            for (const [key, value] of params.entries()) {
                if (key.startsWith('filter[')) {
                    filters[key.replace('filter[', '').replace(']', '')] = value;
                }
            }

            const response = await axios.get(queryUrl, {
                params: {
                    page,
                    rowsPerPage,
                    sort,
                    direction,
                    ...filters
                }
            });
            // console.log(response.data);
            setRows(response.data.data);
            setTotalRows(response.data.total);

        }
        catch (e) {
            console.error(e);
        }
    };

    const buildUrl = () => {
        let url = `${baseUrl}?page=${parseInt(page) + 1}&rowsPerPage=${rowsPerPage}&sort=${sortConfig.key || ''}&direction=${sortConfig.direction || 'asc'}`;
        // Use appliedFilters to build URL
        for (const [key, value] of Object.entries(appliedFilters)) {
            if (value) url += `&filter[${key}]=${encodeURIComponent(value)}`;
        }
        return url;
    };

    const handleSelectAllClick = () => {
        if (selectedRows.length === rows.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(rows.map((_, index) => index));
        }
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        setSortConfig({ key, direction }); // Update local state
    };

    const handleCheckboxChange = (rowIndex) => {
        if (selectedRows.includes(rowIndex)) {
            setSelectedRows(selectedRows.filter(index => index !== rowIndex));
        } else {
            setSelectedRows([...selectedRows, rowIndex]);
        }
    };

    const handleRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
    }
    const handlePageChange = (event, newPage) => {
        event.preventDefault();
        setPage(newPage);
    };

    const handleFilterToggle = () => {
        setFilterOpen(!filterOpen);
    };
    const handleFilterReset = () => {
        setFilters({});
        setAppliedFilters({});
        setRows(initialRows);
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };
    const handleFilterApply = () => {
        setAppliedFilters(filters);
        setPage(0); // Reset page number to 0 when filters are applied
    };

    // Open the menu
    const handleClickBulk = (event) => {
        setAnchorBulk(event.currentTarget);
    };

    // Close the menu
    const handleCloseBulk = () => {
        setAnchorBulk(null);
    };

    return (
        <TableContainer component={Paper} style={{ overflowX: 'auto' }}>
            <br />
            {title &&
                <div style={{ margin: '20px' }}>
                    <h3>{title}</h3>
                    <Divider />
                </div>
            }
            <button className={filterOpen ? 'button-outlined mini' : 'button'} onClick={handleFilterToggle} style={{ margin: '10px' }}>{filterOpen ? 'Fechar Filtros' : 'Filtros'}</button>
            <Collapse in={filterOpen}>
                <Box p={2}>
                    <Grid container spacing={2} alignItems="center" justifyContent="left">
                        {columns.map((column) => (
                            !column.disableFilter &&
                            <Grid item key={`${column.key}_${column.label}`}>
                                {column.dateFilter ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div>
                                            <label>{`Filtrar ${column.label} de`}</label><br />
                                            <TextField
                                                type="date"

                                                value={filters[`${column.key}_startDate`] || ''}
                                                onChange={(e) => handleFilterChange(`${column.key}_startDate`, e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label>{`Filtrar ${column.label} até`}</label><br />
                                            <TextField
                                                type="date"
                                                value={filters[`${column.key}_endDate`] || ''}
                                                onChange={(e) => handleFilterChange(`${column.key}_endDate`, e.target.value)}

                                            />
                                        </div>
                                    </div>
                                ) : column.numberFilter ?
                                    <>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div>
                                                <label>{`Filtrar ${column.label} de`}</label><br />
                                                <TextField
                                                    type="number"
                                                    value={filters[`${column.key}_greaterThan`] || ''}
                                                    onChange={(e) => handleFilterChange(`${column.key}_greaterThan`, e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label>{`Filtrar ${column.label} até`}</label><br />
                                                <TextField
                                                    type="number"
                                                    value={filters[`${column.key}_lesserThan`] || ''}
                                                    onChange={(e) => handleFilterChange(`${column.key}_lesserThan`, e.target.value)}

                                                />
                                            </div>
                                        </div>
                                    </>
                                    : column.customFilterOptions ? (
                                        <>
                                            <label>{`Filtrar ${column.label}`}</label><br />
                                            {/* Format: {label: 'teste', value: 0} */}
                                            <Autocomplete
                                                disablePortal
                                                options={column.customFilterOptions}
                                                getOptionLabel={(option) => option.label} // Display the label
                                                sx={{ width: 235 }}
                                                renderInput={(params) => <TextField {...params} />}
                                                onChange={(e, value) => handleFilterChange(column.nFilter ? `${column.key}_n` : column.key, value?.value)} // Store the value
                                                value={filters[column.nFilter ? `${column.key}_n` : column.key] ? column.customFilterOptions.find(opt => opt.value === filters[column.nFilter ? `${column.key}_n` : column.key]) : ''}
                                                inputValue={filters[column.nFilter ? `${column.key}_n` : column.key] ? column.customFilterOptions.find(opt => opt.value === filters[column.nFilter ? `${column.key}_n` : column.key]).label : ''}
                                            />

                                        </>
                                    )
                                        : (
                                            <>
                                                <label>{`Filtrar ${column.label}`}</label><br />
                                                <TextField
                                                    style={{ width: column.width }}
                                                    value={filters[column.nFilter ? `${column.key}_n` : column.key] || ''}
                                                    onChange={(e) => handleFilterChange(column.nFilter ? `${column.key}_n` : column.key, e.target.value)}
                                                />
                                            </>
                                        )}
                            </Grid>
                        ))}
                        <Grid item>
                            <button className='button-outlined mini' onClick={handleFilterReset}>Resetar</button>
                            <button className='button' onClick={handleFilterApply}>Aplicar</button>
                        </Grid>
                    </Grid>
                </Box>
            </Collapse>

            <Divider />



            <Table style={{ minWidth: '650px' }}>
                <TableHead>
                    <TableRow>
                        {allowMultipleSelection && bulkActions?.length && (
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={selectedRows.length > 0 && selectedRows.length < rows.length}
                                    checked={rows.length > 0 && selectedRows.length === rows.length}
                                    onChange={handleSelectAllClick}
                                />
                            </TableCell>
                        )}
                        {columns?.map((column) => (
                            <TableCell
                                key={`${column.key}_${column.label}`}
                                className={column.isMain ? 'main-cell' : ''}
                                style={{
                                    width: column.width,
                                    ...(column.isMain ? stickyStyle : {}),
                                    fontWeight: 'bold'
                                }}
                            >
                                {column.label}
                                {!column.disableSorting && (
                                    <IconButton size="small" onClick={() => handleSort(column.key)}>
                                        {sortConfig.key === column.key ? (
                                            sortConfig.direction === 'asc' ? <ArrowUpward /> : <ArrowDownward />
                                        ) : <ArrowDownward style={{ opacity: 0.5 }} />}
                                    </IconButton>
                                )}
                            </TableCell>
                        ))}
                        {actions.length > 0 && <TableCell style={{ fontWeight: 'bold' }}> Ações</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading ? (
                        [...Array(rowsPerPage)].map((_, index) => (
                            <StyledTableRow key={index}>
                                {allowMultipleSelection && bulkActions?.length && <TableCell><Skeleton /></TableCell>}
                                {columns?.map((_, colIndex) => (
                                    <TableCell key={colIndex}><Skeleton /></TableCell>
                                ))}
                                {actions.length > 0 && <TableCell><Skeleton /></TableCell>}
                            </StyledTableRow>
                        ))
                    ) : (rows.map((row, rowIndex) => (
                        <StyledTableRow key={rowIndex}>
                            {allowMultipleSelection && bulkActions?.length && (
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedRows.includes(rowIndex)}
                                        onChange={() => handleCheckboxChange(rowIndex)}
                                    />
                                </TableCell>
                            )}
                            {columns?.map((column, columnIndex) => (
                                <TableCell
                                    key={columnIndex}
                                    className={column.isMain ? 'main-cell' : ''}
                                    style={{
                                        width: column.width,
                                        ...(column.isMain ? stickyStyle : {}),
                                    }}
                                >
                                    {column.render ? column.render(row) : row[column.key]}
                                </TableCell>
                            ))}
                            {actions.length > 0 && (
                                <TableCell>
                                    {actions.map((action, actionIndex) => (!action.hideIf || !action.hideIf(row)) && <span onClick={() => action.onClick(row)}>{action.element}</span>)}
                                </TableCell>
                            )}
                        </StyledTableRow>
                    ))
                    )}
                </TableBody>
            </Table>
            {
                rows.length === 0 &&

                <div style={{ textAlign: 'center', padding: '10px' }}>
                    <label>Nenhum item encontrado</label>
                </div>
            }
            <TablePagination
                component="div"
                count={totalRows}
                page={page}
                onPageChange={(event, newPage) => handlePageChange(event, newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage="Itens por página:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            />
            {
                selectedRows?.length > 0 && bulkActions?.length > 0 ?
                    <div style={{ padding: '10px' }}>
                        <p>{selectedRows.length} {selectedRows.length == 1 ? 'item selecionado' : 'itens selecionados'}</p>
                        <button className='button-outlined mini' onClick={handleClickBulk}>Selecionar ação em massa</button>
                        <Menu
                            anchorEl={anchorBulk}
                            keepMounted
                            open={Boolean(anchorBulk)}
                            onClose={handleCloseBulk}
                        >
                            {bulkActions?.map(action => {
                                return (
                                    <MenuItem style={{ padding: '15px' }} onClick={() => {
                                        try {
                                            action?.onClick(selectedRows);
                                        }
                                        catch (e) {
                                            console.error('No bulk action event.')
                                        }
                                        handleCloseBulk();
                                    }}>
                                        {action.label}
                                    </MenuItem>
                                )
                            })}
                        </Menu>
                    </div>
                    : <></>
            }
        </TableContainer >
    );
};

ResponsiveTable.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            width: PropTypes.string,
            isMain: PropTypes.bool,
            disableSorting: PropTypes.bool,
        })
    ).isRequired,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    allowMultipleSelection: PropTypes.bool,
    actions: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.element.isRequired,
            onClick: PropTypes.func.isRequired,
        })
    ),
    onSort: PropTypes.func,
};

ResponsiveTable.defaultProps = {
    allowMultipleSelection: false,
    actions: [],
    onSort: null,
    columns: [],
    rows: [],
};

export default ResponsiveTable;
