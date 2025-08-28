import React, { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Card, CardContent, Button, Box, TextField, Grid } from '@mui/material';

import { useSDK } from "@metamask/sdk-react";
import Web3 from "web3";


interface IBalanceForm {
    address: string;
}

interface ITransfer {
    address: string;
    amount: number | null;
}


const WalletTxnComponent: React.FC = () => {


    const { sdk, connecting, connected, provider, chainId } = useSDK();
    const [account, setAccount] = useState<string | null>(null);
    const [web3, setWeb3] = useState<Web3 | null>(null);

    const [balanceForm, setBalanceForm] = useState<IBalanceForm>({
        address: ''
    });

    const [transferForm, setTransferForm] = useState<ITransfer>({
        address: '',
        amount: null
    });

    const [submitting, setSubmitting] = useState(false);
    const [submitting2, setSubmitting2] = useState(false);

    const [balance, setBalance] = useState<string>("0");

    const [txnHash, setTxnHash] = useState<string>("");



    const connectWallet = async () => {
        try {

            if (!sdk) return;
            const accounts = await sdk?.connect();
            if (accounts && accounts.length > 0) {
                const userAccount = accounts[0];
                setAccount(userAccount);
                setWeb3(new Web3(provider as any));

                if (provider && chainId != "0x61") {
                    try {
                        await provider.request({
                            method: "wallet_switchEthereumChain",
                            params: [{ chainId: "0x61" }],
                        });
                    } catch (switchError: any) {
                        if (switchError.code === 4902) {
                            // If chain not available, add it
                            await provider.request({
                                method: "wallet_addEthereumChain",
                                params: [
                                    {
                                        chainId: "0x61",
                                        chainName: "Binance Smart Chain Testnet",
                                        nativeCurrency: {
                                            name: "Binance Coin",
                                            symbol: "tBNB",
                                            decimals: 18,
                                        },
                                        rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
                                        blockExplorerUrls: ["https://testnet.bscscan.com"],
                                    },
                                ],
                            });
                        } else {
                            alert("Network switch error");
                        }
                    }
                }

            }
        } catch (err) {
            alert("MetaMask connection failed:");
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
        sdk?.terminate();
        window.location.reload()
    }


    const transferAmount = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        if (!web3 || !account || transferForm.amount === null || transferForm.amount <= 0 || !isValidAddress(transferForm.address)) {
            return;
        }

        setSubmitting(true);

        try {

            const tx = {
                from: account,
                to: transferForm.address,
                value: web3.utils.toWei(transferForm.amount, "ether"),
                gas: 21000,
            };

            const receipt = await web3.eth.sendTransaction(tx);

            alert(`Transaction confirmed!`);

            setTxnHash(`${receipt.transactionHash}`);

        } catch (error) {
            console.log(error)
            alert("Transaction failed:");
        } finally {
            setSubmitting(false);
        }

    }


    const checkBalance = async (e: FormEvent<HTMLFormElement>) => {
        if (!web3 || !isValidAddress(balanceForm.address)) {
            return;
        }

        e.preventDefault();

        setSubmitting2(true);

        try {
            const bal = await web3.eth.getBalance(balanceForm.address);
            setBalance(`${web3.utils.fromWei(bal, "ether")} BNB`);

        } catch (error) {
            alert("Failed to check balance");
        } finally {
            setSubmitting2(false);
        }

    }

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setTransferForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleChange2 = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setBalanceForm((prev) => ({ ...prev, [name]: value }));
    };


    const isValidAddress = (address: string) => {
        return web3?.utils.isAddress(address);
    }

    useEffect(() => {
        if (connected) {
            connectWallet();
        }
    }, [connected])


    return (

        <Box sx={{ width: "100%", justifyItems: 'center', padding: "20px" }}>
            <Card sx={{ maxWidth: "900px", width: "100%", backgroundColor: "#141e43" }}>
                <CardContent>

                    {!account ?
                        <Box component="div" sx={{ color: 'white', mt: 2, textAlign: "center", display: "flex", flexDirection: "column" }}>

                            <Box component={"p"}>
                                Please connect wallet to proceed.
                            </Box>
                            <Box mt={4}>
                                <Button
                                    variant="contained"
                                    sx={{ textTransform: 'none', backgroundColor: "#2a3144" }}
                                    onClick={connectWallet}
                                    disabled={connecting}
                                >
                                    <Box
                                        component="img"
                                        src="/metamask.svg"
                                        alt="MetaMask Icon"
                                        sx={{ width: 25, height: 25, mr: 1 }}
                                    />
                                    Connect
                                </Button>
                            </Box>


                        </Box> :
                        <Box component="div" sx={{ color: 'white', mt: 2, textAlign: "center", display: "flex", flexDirection: "column" }} >
                            <Box component={"p"} mt={2}
                                sx={{
                                    wordBreak: "break-all",
                                    whiteSpace: "normal",
                                    overflowWrap: "anywhere",
                                }}>
                                Account: {account}
                            </Box>
                            <Box component={"p"} mt={2}>
                                Chain ID: {chainId}
                            </Box>
                            <Box mt={4}>
                                <Button
                                    variant="contained"
                                    sx={{ textTransform: 'none', backgroundColor: "#2a3144" }}
                                    onClick={disconnectWallet}
                                >
                                    <Box
                                        component="img"
                                        src="/metamask.svg"
                                        alt="MetaMask Icon"
                                        sx={{ width: 25, height: 25, mr: 1 }}
                                    />
                                    Disconnect
                                </Button>
                            </Box>


                        </Box>
                    }



                </CardContent>
            </Card >
            {connected &&
                <Card sx={{ maxWidth: "900px", width: "100%", backgroundColor: "#141e43", mt: 4 }} >
                    <CardContent>

                        <Box component={"p"} sx={{ color: 'white', textAlign: "center", fontWeight: 500, fontSize: "16px", mb: 4 }}>
                            Transfer Amount
                        </Box>

                        <Box component="form"
                            onSubmit={transferAmount}
                            sx={{ maxWidth: "360px" }}
                            margin={"0 auto"}
                        >
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth
                                        label="Address"
                                        type="text"
                                        name="address"
                                        value={transferForm.address}
                                        onChange={handleChange}
                                        required
                                        autoComplete="off"
                                        size="small"
                                        error={transferForm.address !== "" && !isValidAddress(transferForm.address)}
                                        helperText={
                                            transferForm.address !== "" && !isValidAddress(transferForm.address)
                                                ? "Invalid wallet address"
                                                : " "
                                        }
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: 'white',
                                                    height: '50px'
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: 'white',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: 'white',
                                                },
                                                '& .MuiInputBase-input': {
                                                    color: 'white',
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: 'white',
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: 'white',
                                            },
                                        }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth
                                        label="Amount (Ether)"
                                        type="number"
                                        name="amount"
                                        value={transferForm.amount}
                                        onChange={handleChange}
                                        required
                                        autoComplete="off"
                                        size="small"
                                        error={transferForm.amount !== null && transferForm.amount <= 0}
                                        helperText={
                                            transferForm.amount !== null && transferForm.amount <= 0
                                                ? "Amount must be greater than 0"
                                                : " "
                                        }
                                        slotProps={{
                                            htmlInput: {
                                                min: 0,
                                                step: "any",
                                            },
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: 'white',
                                                    height: '50px'
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: 'white',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: 'white',
                                                },
                                                '& .MuiInputBase-input': {
                                                    color: 'white',
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: 'white',
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: 'white',
                                            },
                                            '& .MuiFormHelperText-root': {
                                                color: 'white',
                                                fontSize: '0.8rem',
                                                marginLeft: 0,
                                                marginTop: 1
                                            },

                                        }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 12 }}>
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        fullWidth
                                        size="small"

                                        sx={{
                                            backgroundColor: '#38b07b',
                                            color: '#fff',
                                            textTransform: 'none',
                                            fontSize: '14px',
                                            borderRadius: 1,
                                            py: 1,
                                            '&:hover': {
                                                backgroundColor: '#2c8f65',
                                            },
                                            '&.Mui-disabled': {
                                                backgroundColor: '#ccc',
                                                color: '#666',
                                            },
                                        }}
                                        disabled={submitting}
                                    >
                                        Submit
                                    </Button>
                                </Grid>

                            </Grid>



                        </Box>

                        {
                            txnHash != "" && <Box component={"p"} sx={{
                                color: 'white',
                                textAlign: "center",
                                fontWeight: 500,
                                fontSize: "16px",
                                mb: 4,
                                mt: 4,
                                wordBreak: "break-all",
                                whiteSpace: "normal",
                                overflowWrap: "anywhere",
                            }}
                            >

                                Txn Hash: {txnHash}
                            </Box>

                        }

                    </CardContent>
                </Card >
            }
            {connected &&
                <Card sx={{ maxWidth: "900px", width: "100%", backgroundColor: "#141e43", mt: 4 }} >
                    <CardContent>

                        <Box component={"p"} sx={{ color: 'white', textAlign: "center", fontWeight: 500, fontSize: "16px", mb: 4 }}>
                            Check  Balance
                        </Box>

                        <Box component="form"
                            onSubmit={checkBalance}
                            sx={{ maxWidth: "360px" }}
                            margin={"0 auto"}
                        >
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth
                                        label="Address"
                                        type="text"
                                        name="address"
                                        value={balanceForm.address}
                                        onChange={handleChange2}
                                        required
                                        autoComplete="off"
                                        size="small"
                                        error={balanceForm.address !== "" && !isValidAddress(balanceForm.address)}
                                        helperText={
                                            balanceForm.address !== "" && !isValidAddress(balanceForm.address)
                                                ? "Invalid wallet address"
                                                : " "
                                        }
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: 'white',
                                                    height: '50px'
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: 'white',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: 'white',
                                                },
                                                '& .MuiInputBase-input': {
                                                    color: 'white',
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: 'white',
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: 'white',
                                            },
                                            '& .MuiFormHelperText-root': {
                                                color: 'white',
                                                fontSize: '0.8rem',
                                                marginLeft: 0,
                                                marginTop: 1
                                            },
                                        }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 12 }}>
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        fullWidth
                                        size="small"

                                        sx={{
                                            backgroundColor: '#38b07b',
                                            color: '#fff',
                                            textTransform: 'none',
                                            fontSize: '14px',
                                            borderRadius: 1,
                                            py: 1,
                                            '&:hover': {
                                                backgroundColor: '#2c8f65',
                                            },
                                            '&.Mui-disabled': {
                                                backgroundColor: '#ccc',
                                                color: '#666',
                                            },
                                        }}
                                        disabled={submitting2}
                                    >
                                        Submit
                                    </Button>
                                </Grid>

                            </Grid>



                        </Box>
                        {
                            balance != "0" && <Box component={"p"} sx={{ color: 'white', textAlign: "center", fontWeight: 500, fontSize: "16px", mb: 4, mt: 4 }}>
                                Balance: {balance}
                            </Box>

                        }
                    </CardContent>
                </Card >
            }
        </Box>
    )
}

export default WalletTxnComponent;