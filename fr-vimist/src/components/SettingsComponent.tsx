import logo from '../../src/assets/images/logo.jpg';

function SettingsComponent() {
  return (
    <div className="vn-bg-white vn-border vn-border-gray-200 vn-shadow-md vn-flex vn-flex-col vn-m-auto vn-p-6 vn-w-full md:vn-w-1/2 vn-rounded-xl vn-gap-5">
      {/* Profile Image */}
      <div className="vn-flex vn-justify-center vn-items-center vn-rounded-full vn-shadow-md vn-mx-auto">
        <img
          src={logo}
          alt="Profile"
          className="vn-shadow-md vn-w-24 vn-h-24 vn-rounded-full vn-object-cover vn-ring-2 vn-ring-indigo-500"
        />
      </div>
      
      {/* Name Field */}
      <div className="vn-flex vn-flex-col md:vn-flex-row vn-gap-3">
        <label
          htmlFor="Name"
          className="vn-text-gray-700 vn-font-medium vn-w-full md:vn-w-1/2 vn-flex vn-items-center"
        >
          Name:
        </label>
        <input
          id="Name"
          type="text"
          placeholder="John Doe"
          className="vn-border vn-border-gray-300 vn-rounded-lg vn-w-full md:vn-w-1/2 vn-h-10 vn-px-3 focus:vn-outline-none focus:vn-ring-2 focus:vn-ring-indigo-500"
        />
      </div>
      
      {/* Email Field */}
      <div className="vn-flex vn-flex-col md:vn-flex-row vn-gap-3">
        <label
          htmlFor="email"
          className="vn-text-gray-700 vn-font-medium vn-w-full md:vn-w-1/2 vn-flex vn-items-center"
        >
          Email:
        </label>
        <input
          id="email"
          type="email"
          placeholder="johndoe@gmail.com"
          className="vn-border vn-border-gray-300 vn-rounded-lg vn-w-full md:vn-w-1/2 vn-h-10 vn-px-3 focus:vn-outline-none focus:vn-ring-2 focus:vn-ring-indigo-500"
        />
      </div>
      
      {/* Password Field */}
      <div className="vn-flex vn-flex-col md:vn-flex-row vn-gap-3">
        <label
          htmlFor="pass"
          className="vn-text-gray-700 vn-font-medium vn-w-full md:vn-w-1/2 vn-flex vn-items-center"
        >
          Password:
        </label>
        <input
          id="pass"
          type="password"
          placeholder="***change password***"
          className="vn-border vn-border-gray-300 vn-rounded-lg vn-w-full md:vn-w-1/2 vn-h-10 vn-px-3 focus:vn-outline-none focus:vn-ring-2 focus:vn-ring-indigo-500"
        />
      </div>
      
      {/* Buttons */}
      <div className="vn-flex vn-justify-evenly">
        <button className="vn-shadow-sm vn-flex vn-justify-center vn-items-center vn-bg-indigo-600 vn-text-white vn-rounded-lg vn-px-4 vn-py-2 hover:vn-bg-indigo-700 transition-colors">
          Update
        </button>
        <button className="vn-shadow-sm vn-flex vn-justify-center vn-items-center vn-bg-red-600 vn-text-white vn-rounded-lg vn-px-4 vn-py-2 hover:vn-bg-red-700 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default SettingsComponent;
