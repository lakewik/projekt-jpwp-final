import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';


function App() { 
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);


    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
          setIsLoggedIn(true);
          setUserId(storedUserId);
        }
    }, []);

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserId(null);
        localStorage.removeItem('userId');
      };

    return (
        <Router>
          
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <Link className="navbar-brand" to="/">Task Manager</Link>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
    
              {isLoggedIn ? (
                <>
                    <li className="nav-item">
                    <span className="nav-link">{`User ID: ${userId}`}</span>
                    </li>
                  
                    <li className="nav-item">
                    <a className="nav-link" onClick={handleLogout} >Logout</a>
                    </li>
                </>  ) : (
                  <>  
                    
                    <li className="nav-item">
                    <a className="nav-link"  href="/login">Login</a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link"  href="/register">Register</a>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </nav>
    
            <Switch>
              <Route path="/login" component={LoginForm} />
              <Route path="/register" component={RegisterForm} />
              <Route path="/tasks" component={TaskList} />
            </Switch>
       
        </Router>
      );
}