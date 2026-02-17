  import {BrowserRouter, Route, Routes} from "react-router-dom";
  import { LoginPage } from "./LoginPage";
  import { RegisterPage } from "./RegisterPage";
  import { ForgotPwdPage } from "./ForgotPwdPage";
  import { HomePage } from "./HomePage";
  import {AuthProvider} from "./context/useAuth";
  import { ProtectedRoute } from "./ProtectedRoute";
  import { PublicRoute } from "./PublicRoute";
  import { ChatContainer } from "./Chatbot";
  import { ConfirmResetPassword } from "./ConfirmResetPassword";
  import { ChangePassword } from "./ChangePassword";
  import { DeleteAccount } from "./DeletePage";
  import {NotFound} from "./PageNotFound";

  export default function App() {
    return(
      <BrowserRouter>
          <AuthProvider>
          <Routes>
            <Route path="/login" element={<PublicRoute><LoginPage/></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage/></PublicRoute>}/>
            <Route path="/forgot-password" element={<PublicRoute><ForgotPwdPage/></PublicRoute>}/>
            <Route path="/confirm-reset-password/:uid/:token" element={<PublicRoute><ConfirmResetPassword/></PublicRoute>}/>
            <Route path="/" element = {<ProtectedRoute><HomePage/></ProtectedRoute>}/>
            <Route path="/chatbot" element = {<ProtectedRoute><ChatContainer/></ProtectedRoute>}/>
            <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
            <Route path="/delete-account" element={<ProtectedRoute><DeleteAccount /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    );
  }