import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import '../css/sign-up.css';

// Signup component
const SignUp = () => {
    // State variables
    const [form, setForm] = useState({ username: '', password: '', confirmPassword:''});
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Handle input changes in the form
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value})
    };

    // Toggle password visibility (show/hide)
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    // Handle form submission (Signup process)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, password, confirmPassword } = form;

        // Check if passwords match before submitting
        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        try {
            // Send POST request to signup endpoint with form data
            const res = await axios.post('http://localhost:3001/api/auth/signup', form);

            // Save username to local storage
            localStorage.setItem('username', username);

            // Navigate to home page after successful signup
            navigate('/');
            setMessage(res.data.message || "Sign up successfully!");
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error occurred');
        }
    };

    // Render component
    return (
        <div className="signup-wrapper">
            <div className="form-container">  
                <h2 className="form-heading">SIGN UP</h2>
                <form onSubmit={handleSubmit}>
                <input type='text' name='username' placeholder="Username" onChange={handleChange} required />
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                />
                <button type="button" onClick={toggleShowPassword}>
                    {showPassword ? 'Hide' : 'Show'}
                </button>
                <button type="submit">SIGN UP</button>
                {message && <div className="message">{message}</div>}
            </form>

            <Link to="/">
                    <button type="button" className="return-button">RETURN</button>
            </Link>
            </div>
            
        </div>
    );
    
};

// Export signup component
export default SignUp;