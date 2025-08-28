import React from "react";
import { Outlet } from "react-router";
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';



const MainLayout: React.FC = () => {


    return (
        <Box sx={{ padding: "0px" }}>

            <AppBar position="sticky" sx={{ backgroundColor: "#131a35" }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>

                </Toolbar>
            </AppBar>

            <Container disableGutters maxWidth={false}
                sx={{
                    maxWidth: '100%',
                }} >
                <Box my={0} mx={0}  >
                    <Outlet />
                </Box>
            </Container>


            <footer  >
                <Box py={2} sx={{ backgroundColor: "#131a35" }} color="white" textAlign="center">
                    <Typography variant="body2">© 2025 DEMO APP</Typography>
                </Box>
            </footer>
        </Box>
    );
};

export default MainLayout;
