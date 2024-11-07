import React from 'react'
import { useAuth } from '../features/authentication/authHook';
import { User } from '../api/authenticationAPI';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [user, setUser] = React.useState<User>({
        username: "",
        password: "",
    });

    const navigate = useNavigate();
    const { authUser } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await authUser(user); // Await the promise result

            if (result){
                // Redirect to the home page
                navigate("/");
                // store the tokens in the local storage
                localStorage.setItem("access", result.access);
                localStorage.setItem("refresh", result.refresh);
            }
        } catch (error) {
            console.error("Authentication failed:", error);
        }
    };
    

  return (
    <div>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
            <input
                type="text"
                placeholder="Username"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                autoComplete='on'
            />
            <input
                type="password"
                placeholder="Password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                autoComplete='off'
            />
            <button type="submit" className='vn-bg-green-400'>Login</button>
        </form>      
    </div>
  )
}

export default Login
