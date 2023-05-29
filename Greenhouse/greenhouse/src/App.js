import { Routes, Route } from "react-router-dom";
import HomePage from "./authentication/HomePage";
import Register from "./authentication/Register";
import ForgotPassword from "./authentication/ForgotPassword";
import Footer from "./authentication/Footer";
import ResetPassword from "./authentication/ResetPassword";
import UserHome from "./user/UserHome";
import 'react-toastify/dist/ReactToastify.css';
import AllUser from "./admin/AllUser";
import AddGreenhouse from "./admin/AddGreenhouse";
import { GreenhouseDataProvider } from "./store/greenhouseStore";
import { AuthenticationProvider } from "./store/authenticationContext";
import UpdateUser from "./admin/UpdateUser";
import UpdateDataForUsers from "./user/UpdateDataForUsers";
import UpdateGreenhouse from "./admin/UpdateGreenhouse";
import AssignMeasurementAndStatus from "./admin/AssignMeasurementAndStatus";
import AssignConfigurationAndManagementCommand from "./admin/AssignConfigurationAndManagementCommand";
import AssignThingspeak from "./admin/AssignThingspeak";
import DisplayMesasurementAndStatus from "./user/DisplayMesasurementAndStatus";
import ManageGreenhouseConfiguration from "./user/ManageGreenhouseConfiguration";
import ManageGreenhouseManagement from "./user/ManageGreenhouseManagement";

function App() {
  return (
    <div className="App">
      <AuthenticationProvider>
        <GreenhouseDataProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/footer" element={<Footer />} />
            <Route path="/resetPassword/:token" element={<ResetPassword />} />
            <Route path="/home" element={<UserHome />}></Route>
            <Route path="/home/admin/getAllUser" element={<AllUser />}></Route>
            <Route path="/home" element={<UserHome />} />
            <Route path="/home/admin/updateUser/:id" element={<UpdateUser />}></Route>
            <Route path="/home/updateUserData/:id" element={<UpdateDataForUsers />}></Route>
            <Route path="/home/admin/addGreenhouse/:id" element={<AddGreenhouse />}></Route>
            <Route path="/home/admin/updateGreenhouse/:id" element={<UpdateGreenhouse />}></Route>
            <Route path="/home/admin/assignMeasurementAndStatuses/:id" element={<AssignMeasurementAndStatus />}></Route>
            <Route path="/home/admin/assignConfigurationAndManagementCommand/:id" element={<AssignConfigurationAndManagementCommand />}></Route>
            <Route path="/home/admin/assignThingspeakData/:id" element={<AssignThingspeak />}></Route>
            <Route path="/home/getDisplayedMeasurementStatuses/:id" element={<DisplayMesasurementAndStatus />}></Route>
            <Route path="/home/manageGreenhouseConfiguration/:id" element={<ManageGreenhouseConfiguration />}></Route>
            <Route path="/home/manageGreenhouseManagement/:id" element={<ManageGreenhouseManagement />}></Route>
          </Routes>
        </GreenhouseDataProvider>
      </AuthenticationProvider>
    </div>
  );
}

export default App;