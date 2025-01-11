import AuthComponent from "../components/AuthComponent";

function RegisterUser (){
    return (
        <div>
            <h1>Register User</h1>
            <AuthComponent mode="register" regAs="user" />
        </div>
    )
}
export default RegisterUser;