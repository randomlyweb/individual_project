import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';


const LoginForm = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}auth/`, {
                username: login,
                password
            });

            localStorage.setItem('token', response.data.data);
            navigate('/', { state: { loginSuccess: true } });
        } catch (error) {
            toast.error('Ошибка при входе в систему. Пожалуйста, проверьте свои учетные данные и попробуйте снова.');
        }
    };

    return (
        <div className="signin-form">
            <ToastContainer />
            <form onSubmit={handleLogin} className='container' style={{ maxWidth: '400px' }}>
                <h1 className="h3 mb-3 fw-normal">Пожалуйста, войдите</h1>

                <div className="form-floating">
                    <input
                        type="text"
                        className="form-control"
                        id="floatingInput"
                        placeholder="name@example.com"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                    />
                    <label htmlFor="floatingInput">Login</label>
                </div>
                <div className="form-floating">
                    <input
                        type="password"
                        className="form-control"
                        id="floatingPassword"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label htmlFor="floatingPassword">Password</label>
                </div>

                <button className="btn w-100 py-2" type="submit" style={{backgroundColor: 'black', color: 'white'}}>
                    Войти
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
