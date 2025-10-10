import { useState } from "react";
import type { LoginDto, UserDto } from "../../models/models";
import type { IAuthService } from "../../services/IAuth";

interface AuthComponentProps {
  authService: IAuthService;
  onAuthSuccess?: (token: string) => void;
}

const AuthComponent: React.FC<AuthComponentProps> = ({
  authService,
  onAuthSuccess,
}) => {
  // Login form state
  const [loginData, setLoginData] = useState<LoginDto>({
    username: "",
    password: "",
  });

  // Register form state
  const [registerData, setRegisterData] = useState<UserDto>({
    id: 0,
    username: "",
    email: "",
    password: "",
    profileImage: "",
    isAdmin: false,
  });

  // Error and loading states
  const [loginError, setLoginError] = useState<string>("");
  const [registerError, setRegisterError] = useState<string>("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  // Handle login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const token = await authService.login(loginData);

      if (token) {
        console.log("Login successful");
        if (onAuthSuccess) {
          onAuthSuccess(token);
        }
        // Reset form
        setLoginData({ username: "", password: "" });
      } else {
        setLoginError("Invalid username or password");
      }
    } catch {
      setLoginError("An error occurred during login");
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle register form submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterLoading(true);

    try {
      const token = await authService.register(registerData);

      if (token) {
        console.log("Registration successful");
        if (onAuthSuccess) {
          onAuthSuccess(token);
        }
        // Reset form
        setRegisterData({
          id: 0,
          username: "",
          email: "",
          password: "",
          profileImage: "",
          isAdmin: false,
        });
      } else {
        setRegisterError("Registration failed. Username or email in use.");
      }
    } catch {
      setRegisterError("An error occurred during registration");
    } finally {
      setRegisterLoading(false);
    }
  };

  const fileToBase64 = (file: File, quality: number = 0.2): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject("Canvas not supported");
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          // compress to JPEG base64 with given quality
          const base64 = canvas.toDataURL("image/jpeg", quality);
          resolve(base64);
        };

        img.onerror = (err) => reject(err);
      };

      reader.onerror = (err) => reject(err);
    });
  };

  return (
    <div className="container-fluid">
      <div className="row g-4">
        {/* Login Form */}
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body p-4">
              <h3 className="card-title mb-4 text-center">Login</h3>

              {loginError && (
                <div
                  className="alert alert-danger alert-dismissible fade show"
                  role="alert"
                >
                  {loginError}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setLoginError("")}
                    aria-label="Close"
                  ></button>
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="login-username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="login-username"
                    value={loginData.username}
                    onChange={(e) =>
                      setLoginData({ ...loginData, username: e.target.value })
                    }
                    required
                    disabled={loginLoading}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="login-password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="login-password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    required
                    disabled={loginLoading}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loginLoading}
                >
                  {loginLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Register Form */}
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body p-4">
              <h3 className="card-title mb-4 text-center">Register</h3>

              {registerError && (
                <div
                  className="alert alert-danger alert-dismissible fade show"
                  role="alert"
                >
                  {registerError}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setRegisterError("")}
                    aria-label="Close"
                  ></button>
                </div>
              )}

              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label htmlFor="register-username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="register-username"
                    value={registerData.username}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        username: e.target.value,
                      })
                    }
                    required
                    disabled={registerLoading}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="register-email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="register-email"
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        email: e.target.value,
                      })
                    }
                    required
                    disabled={registerLoading}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="register-password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="register-password"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      })
                    }
                    required
                    disabled={registerLoading}
                  />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="register-profile-image"
                    className="form-label"
                  >
                    Profile Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    id="register-profile-image"
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        try {
                          const base64 = await fileToBase64(
                            e.target.files[0],
                            0.2
                          );
                          setRegisterData({
                            ...registerData,
                            profileImage: base64,
                          });
                        } catch {
                          setRegisterError("Failed to process image");
                        }
                      }
                    }}
                    required
                    disabled={registerLoading}
                  />
                </div>

                <div className="mb-4">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="register-admin"
                      checked={registerData.isAdmin}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          isAdmin: e.target.checked,
                        })
                      }
                      disabled={registerLoading}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="register-admin"
                    >
                      Register as Admin
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100"
                  disabled={registerLoading}
                >
                  {registerLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Registering...
                    </>
                  ) : (
                    "Register"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;
