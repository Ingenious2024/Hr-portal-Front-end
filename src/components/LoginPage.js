import React, { useState } from 'react';
import axios from 'axios';
import { Typography, Button, Checkbox, TextField, FormControlLabel } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'; 
import Logo from "../imgs/rsz_1untitled_design.png";

export default function Component() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://hrportal-backend.onrender.com/api/login', { email, password });
      const { token, userId, userEmail } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('Userid', userId);
      localStorage.setItem('Useremail', userEmail);
      history('/');
    } catch (error) {
      console.error('Login failed:', error.response.data.message);
    }
  };

  return (
    <div className="meme" style={{ display: 'flex', alignItems: 'center', minHeight: '100vh', padding: '0 16px'}}>
      <div className="login-panel" style={{maxWidth: 400, margin: 'auto'}}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <img src={Logo} alt="Logo" style={{ width: '100px', height: 'auto' }} />
          <Typography variant="h5" fontWeight="bold" gutterBottom>Ingenious solution</Typography>
        </div>
        
        <TextField
          margin="normal"
          required
          fullWidth
          label="Email Address"
          id="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoFocus
        />
        
        <TextField
          margin="normal"
          required
          fullWidth
          label="Password"
          id="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
        />
        
        <FormControlLabel control={<Checkbox value="remember" />} label="Remember me" />
        
        <Button type="submit" fullWidth variant="contained" onClick={handleLogin} sx={{ mt: 3, mb: 2 }}>Sign In</Button>
        
        <Typography align="center">
          <Link to="#" style={{ textDecoration: 'none' }}>Forgot your password?</Link>
        </Typography>
      </div>
    </div>
  );
}
