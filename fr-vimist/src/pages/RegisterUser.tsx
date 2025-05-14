import AuthComponent from "../components/AuthComponent";

function RegisterUser (){
    return (
        <div className="vn-flex vn-flex-col md:vn-flex-row vn-h-full vn-gap-3">
            <h1 className="vn-text-nowrap vn-text-xl vn-font-semibold">Register User</h1>
            <AuthComponent mode="register" regAs="user" />
        </div>
    )
}
export default RegisterUser;