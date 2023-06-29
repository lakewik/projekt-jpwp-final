import { useState } from 'react';
import api from './api';
import { useHistory, Redirect, Route } from 'react-router-dom';


function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const response = await api.post('/login', { email, password });
          const { userId } = response.data;
    
          localStorage.setItem('userId', userId);
          
          
          document.cookie = `token=${response.data.token}`;
    
    
          console.log(response.data.message);
          history.push('/tasks');
          window.location.reload(false);
        
        } catch (error) {
          alert("Login failed");
          console.error('Error during login:', error);
       
        }
      };   

    return (
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
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
          <button type="submit">Login</button>
        </form>
        
      );
}

export default LoginForm;