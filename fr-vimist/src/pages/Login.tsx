import AuthComponent from "../components/AuthComponent";

function Login() {
  return(
    <div>
        <h1>login</h1>
        <AuthComponent mode="login" regAs={null} />
    </div>
  );
}

export default Login;
