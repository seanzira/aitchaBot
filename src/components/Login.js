import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../css/login.css';

// Login component
const Login = () => {
    // State variables 
    const [form, setForm] = useState({ username: '', password: ''});
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Handle form input changes
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle form submission (login process)
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Send POST request to login endpoint with form data
            const res = await axios.post('http://localhost:3001/api/auth/login', form);

            // Saving username to local storage (for session tracking)
            localStorage.setItem('username', form.username);

            // Check for redirect parameter (for protected routes)
            const params = new URLSearchParams(window.location.search);
            const redirectPath = params.get('redirect') || '/';

            // Navigate to redirect path
            navigate(redirectPath);
            setMessage(res.data.message);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error occured');
        }
    };

    // Render component
    return (
        <>
            <div className="signup-link">
                <Link to="/sign-up">
                    <button type="button">SIGN UP</button>
                </Link>
            </div>
    
            <div className="login-wrapper">
                <h2>LOGIN</h2>
    
                <div className='form-container'>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={form.username}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                        <button type="submit">LOGIN</button>
                    </form>

                    <Link to="/">
                        <button type="button" className="return-button">RETURN</button>
                    </Link>
                </div>
    
                {message && <p>{message}</p>}
            </div>
        </>
    );
    
    
};

// Export login component
export default Login;