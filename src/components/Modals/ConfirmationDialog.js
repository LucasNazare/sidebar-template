import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';

export default function ConfirmationDialog({ open, title, message, confirmBtnText, cancelBtnText, onConfirm, onCancel }) {

    return (
        <div>
            <Dialog
                open={open}
                onClose={onCancel}
            >
                <DialogTitle>
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <button onClick={onCancel} className='button-outlined'>{cancelBtnText}</button>
                    <button onClick={onConfirm} className='button'>{confirmBtnText}</button>
                </DialogActions>
            </Dialog>
        </div>
    );
}