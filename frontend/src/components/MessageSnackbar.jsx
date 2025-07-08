import React from 'react';
import { Snackbar, Alert } from '@mui/material';

function MessageSnackbar({ message, type, open, onClose }) {
    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
            <Alert onClose={onClose} severity={type} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
}

export default MessageSnackbar;
