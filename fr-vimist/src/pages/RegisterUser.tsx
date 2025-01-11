import AuthComponent from "../components/AuthComponent";

function RegisterUser (){
    return (
        <div className="vn-flex vn-h-full vn-gap-5">
            <h1>Register User</h1>
            <AuthComponent mode="register" regAs="user" />
        </div>
    )
}
export default RegisterUser;