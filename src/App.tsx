import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './router.tsx';
import { MetaMaskProvider } from "@metamask/sdk-react";

import './App.css'

function App() {
  return (
    <Router>
      <MetaMaskProvider
        debug={false}
        sdkOptions={{
          dappMetadata: {
            name: "Demo App",
          },
        }}
      >
        <AppRoutes />
      </MetaMaskProvider>

    </Router>
  )
}

export default App
