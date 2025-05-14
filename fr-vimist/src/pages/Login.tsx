import AuthComponent from "../components/AuthComponent";

function Login() {
  return(
    <div className="vn-flex vn-flex-col md:vn-flex-row vn-h-full vn-justify-evenly">
        <h1 className="vn-text-nowrap vn-text-xl vn-font-semibold">Login</h1>
        <AuthComponent mode="login" regAs={null} />
    </div>
  );
}

export default Login;
