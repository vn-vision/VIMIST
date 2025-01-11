import AuthComponent from "../components/AuthComponent";

function Login() {
  return(
    <div className="vn-flex vn-h-full vn-gap-5">
        <h1>login</h1>
        <AuthComponent mode="login" regAs={null} />
    </div>
  );
}

export default Login;
