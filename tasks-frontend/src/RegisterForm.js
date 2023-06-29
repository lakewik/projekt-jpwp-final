 
import { useState } from 'react';
import api from './api';
import { useHistory, Redirect, Route } from 'react-router-dom';

function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const response = await api.post('/register', { email, password });
          console.log(response.data.message);
    
          history.push('/login');
          window.location.reload(false);
        } catch (error) {
          alert("Registration failed");
          console.error('Error during registration:', error);
    
        }
      };

    return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterForm;