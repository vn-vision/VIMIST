import landing from '../../assets/images/logo.jpg';

function LandingPage() {
  return (
    // Main container
    <div className="vn-flex vn-flex-col vn-min-h-screen">

      {/* Hero Section */}
      <div className="vn-flex vn-flex-1 vn-flex-col lg:vn-flex-row vn-justify-between vn-items-center vn-bg-gray-200 vn-p-6">
        {/* Text Content */}
        <div className="vn-text-center lg:vn-text-left vn-p-6">
          <h1 className="vn-text-3xl sm:vn-text-4xl md:vn-text-5xl vn-font-bold vn-mb-4">
            Welcome to Vimist
          </h1>
          <p className="vn-text-lg sm:vn-text-xl vn-mb-6">
            Discover the latest trends in fashion
          </p>
          <button className="vn-bg-blue-500 vn-text-white vn-px-6 vn-py-3 vn-rounded-lg vn-transition-all vn-transform hover:vn-scale-105">
            Get Started
          </button>
        </div>

        {/* Image */}
        <div className="vn-w-full lg:vn-w-1/2 vn-p-6">
          <img
            src={landing}
            alt="landing"
            className="vn-w-full vn-h-auto vn-max-h-[50vh] lg:vn-max-h-[55vh] vn-object-cover vn-rounded-lg lg:vn-rounded-xl"
          />
        </div>
      </div>

      {/* Footer Section */}
      <div className="vn-flex vn-justify-center vn-items-center vn-bg-gray-200 vn-p-2 vn-space-x-4">
        <span className="vn-text-blue-600 hover:vn-underline">Instagram</span>
        <span className="vn-text-blue-600 hover:vn-underline">Twitter</span>
        <span className="vn-text-blue-600 hover:vn-underline">Facebook</span>
      </div>
    </div>
  );
}

export default LandingPage;
