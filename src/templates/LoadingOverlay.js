import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const LoadingOverlay = () => {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: (theme) => theme.palette.grey[200],
                opacity: 0.7,
                zIndex: 9999,
            }}
        >
            <CircularProgress />
        </Box>
    );
};

export default LoadingOverlay;
