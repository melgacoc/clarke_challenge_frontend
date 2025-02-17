import { BrowserRouter as Router, Routes as ReactRoutes, Route } from 'react-router-dom';
import Auth from '@/pages/auth';
import UserDashboard from '@/pages/dashboardUser';
import SupplierDashboard from '@/pages/dashboardSupplier';

const Routes = () => {
    return (
        <Router>
            <ReactRoutes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard/user" element={<UserDashboard />} />
                <Route path="/dashboard/supplier" element={<SupplierDashboard />} />
            </ReactRoutes>
        </Router>
    );
};

export default Routes;