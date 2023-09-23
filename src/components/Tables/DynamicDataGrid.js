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
    Skeleton
} from '@mui/material';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import { styled } from '@mui/system';

const StyledTableRow = styled(TableRow)({
    '&:hover': {
        backgroundColor: 'rgba(211, 211, 211, 0.5)',
        '& .main-cell': {
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
        },
    },
});

const ResponsiveTable = ({ columns, rows: initialRows, allowMultipleSelection, actions, onSort }) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [rows, setRows] = useState(initialRows);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(true);

    const stickyStyle = {
        position: 'sticky',
        left: 0,
        backgroundColor: 'white',
        zIndex: 1,
    };

    useEffect(() => {
        setLoading(true);
        const mainColumn = columns.find(column => column.isMain) || columns[0];
        const key = mainColumn.key;
        const direction = 'asc';

        setSortConfig({ key, direction });
        onSort ? onSort(key, direction) : simulateServerSideSorting(key, direction);
        setLoading(false);
    }, []);

    const simulateServerSideSorting = (key, direction) => {
        setLoading(true);
        const sortedRows = [...rows].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        setRows(sortedRows);
        setSortConfig({ key, direction });
        setLoading(false);
    };

    const handleSelectAllClick = () => {
        if (selectedRows.length === rows.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(rows.map((_, index) => index));
        }
    };

    const handleSort = (key) => {
        setLoading(true);
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        onSort ? onSort(key, direction) : simulateServerSideSorting(key, direction);
        setLoading(false);
    };

    const handleCheckboxChange = (rowIndex) => {
        if (selectedRows.includes(rowIndex)) {
            setSelectedRows(selectedRows.filter(index => index !== rowIndex));
        } else {
            setSelectedRows([...selectedRows, rowIndex]);
        }
    };

    return (
        <TableContainer component={Paper} style={{ overflowX: 'auto' }}>
            <Table style={{ minWidth: '650px' }}>
                <TableHead>
                    <TableRow>
                        {allowMultipleSelection && (
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
                                key={column.key}
                                className={column.isMain ? 'main-cell' : ''}
                                style={{
                                    width: column.width,
                                    ...(column.isMain ? stickyStyle : {}),
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
                        {actions.length > 0 && <TableCell>Ações</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading ? (
                        [...Array(rowsPerPage)].map((_, index) => (
                            <StyledTableRow key={index}>
                                {allowMultipleSelection && <TableCell><Skeleton /></TableCell>}
                                {columns?.map((_, colIndex) => (
                                    <TableCell key={colIndex}><Skeleton /></TableCell>
                                ))}
                                {actions.length > 0 && <TableCell><Skeleton /></TableCell>}
                            </StyledTableRow>
                        ))
                    ) : (
                        rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => (
                            <StyledTableRow key={rowIndex}>
                                {allowMultipleSelection && (
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
                                        {row[column.key]}
                                    </TableCell>
                                ))}
                                {actions.length > 0 && (
                                    <TableCell>
                                        {actions.map((action, actionIndex) => (
                                            <Button key={actionIndex} onClick={() => action.onClick(row)}>
                                                {action.label}
                                            </Button>
                                        ))}
                                    </TableCell>
                                )}
                            </StyledTableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            <TablePagination
                component="div"
                count={rows.length}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage="Linhas por página:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            />
        </TableContainer>
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
            label: PropTypes.string.isRequired,
            onClick: PropTypes.func.isRequired,
        })
    ),
    onSort: PropTypes.func,
};

ResponsiveTable.defaultProps = {
    allowMultipleSelection: false,
    actions: [],
    onSort: null,
};

export default ResponsiveTable;
