import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import SavingsCalculator from './pages/SavingsCalculator'
import Transactions from './pages/Transactions'
import MerchantHealth from './pages/MerchantHealth'
import Reports from './pages/Reports'
import Analytics from './pages/Analytics'
import DataPipeline from './pages/DataPipeline'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calculator" element={<SavingsCalculator />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/health" element={<MerchantHealth />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/pipeline" element={<DataPipeline />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
