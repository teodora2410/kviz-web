import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthComponent from '../components/auth/AuthComponent';
import type { IAuthService } from '../services/IAuth';

interface AuthPageProps {
  authService: IAuthService;
}

const AuthPage: React.FC<AuthPageProps> = ({ authService }) => {
  const navigate = useNavigate();

  const handleAuthSuccess = (token: string) => {
    localStorage.setItem('jwt', token);
    navigate('/home');
  };

  useEffect(() => {
    if(localStorage.getItem("jwt"))
        navigate("/home");
  }, [navigate])

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="text-center mb-5">
              <h1 className="display-4 fw-bold text-primary mb-3">Welcome to Quiz</h1>
              <p className="lead text-muted">Please login or register to continue</p>
            </div>
            
            <AuthComponent 
              authService={authService} 
              onAuthSuccess={handleAuthSuccess}
            />
            
            <div className="text-center mt-4">
              <p className="text-muted small">
                By signing up, you agree to create a new account into system
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;