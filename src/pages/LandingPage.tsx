import React from 'react';
import { Box } from '@mui/material';

import WalletTxnComponent from '../components/wallet/WalletTxnComponent';


const LandingPage: React.FC = () => {
    return (
        <Box sx={{ backgroundColor: "#0d0a29", margin: "0px", py: 4, minHeight: 'calc(100vh - 115px)' }}>

            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }} >
                <WalletTxnComponent></WalletTxnComponent>
            </Box>
        </Box>
    )
}


export default LandingPage;
