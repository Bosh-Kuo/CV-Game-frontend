import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// alert = {open: boolean, message: String, severity: string("error", "warning", "info", "success")}
export default function AlertMessage({ alert, setAlert }) {
    const handleClose = () => {
        setAlert({ ...alert, open: false });
    };
    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
            }}
            open={alert.open || false}
            autoHideDuration={2000}
            onClose={handleClose}
        >
            <Alert onClose={handleClose} severity={alert.severity} sx={{ width: '100%' }}>
                {alert.message}
            </Alert>
        </Snackbar>
    )
}
