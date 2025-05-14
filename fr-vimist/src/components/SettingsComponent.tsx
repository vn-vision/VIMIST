import React, { useState } from "react";
import vmLogo from "../../src/assets/images/logo.jpg";
import {
  useAddSettings,
  useUpdateSettings,
  useClearMessages,
} from "../features/settings/settingsHook";
import { useFetchSettings } from "../features/settings/settingsHook";
import AlertMessage from "./AlertMessage";
import { useNavigate } from "react-router-dom";

function SettingsComponent() {
  // send form data to the server
  const { addSettings, message: addMsg, error: addError } = useAddSettings();
  const { updateSettings, message: updMsg, error: updError } = useUpdateSettings();
  const { data: confData,} = useFetchSettings();
  const { clsMessages } = useClearMessages();
  const navigate = useNavigate();

  const defaultLogo = confData ? confData[0]?.logo : vmLogo;
  // State for form fields
  const [companyName, setCompanyName] = useState(
    confData[0]?.system_name || ""
  );
  const [primaryColor, setPrimaryColor] = useState(
    confData[0]?.primary_color || ""
  ); // default color
  const [secondaryColor, setSecondaryColor] = useState(
    confData[0]?.secondary_color || ""
  ); // default color
  const [threshold, setThreshold] = useState(0);

  // logo state is either a File or a string (default logo)
  const [logo, setLogo] = useState<File | string>(defaultLogo);
  // For previewing the logo
  const [logoPreview, setLogoPreview] = useState<string>(defaultLogo);

  // Handle logo upload and preview update
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  // Handle form submission (update settings)
  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Create a FormData object to send file uploads to the server
    const formData = new FormData();
    try {
      formData.append("system_name", companyName);
      if (logo instanceof File) {
        formData.append("logo", logo);
      }
      formData.append("primary_color", primaryColor);
      formData.append("secondary_color", secondaryColor);
      formData.append("threshold", threshold.toString());
      console.log(formData);

      if (confData.length > 0) {
        formData.append("id", confData[0].id.toString());
        updateSettings(formData);
      } else {
        addSettings(formData);
      }
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };
  // Reset form fields if needed
  const handleCancel = () => {
    setCompanyName(confData ? confData[0].system_name : "");
    setPrimaryColor(confData ? confData[0].primary_color : "");
    setSecondaryColor(confData ? confData[0].secondary_color : "");
    setThreshold(confData ? confData[0].threshold : 0);
    setLogo(defaultLogo);
    setLogoPreview(defaultLogo);
  };

  return (
    <form
      className="vn-bg-white vn-border vn-border-gray-200 vn-shadow-md vn-flex vn-flex-col vn-m-auto vn-p-6 vn-w-full md:vn-w-1/2 vn-rounded-xl vn-gap-5"
      onSubmit={handleUpdate}
    >
      {updMsg && <AlertMessage message={updMsg} type="success" onClose={clsMessages} />}
      {updError && <AlertMessage message={updError} type="error" onClose={clsMessages} />}
      {addError && <AlertMessage message={addError} type="error" onClose={clsMessages} />}
      {addMsg && <AlertMessage message={addMsg} type="success" onClose={clsMessages} />}
      {/* System Name Field */}
      {/* Logo Preview and File Upload */}
      <div className="vn-flex vn-justify-center vn-items-center vn-rounded-full vn-shadow-md vn-mx-auto">
        <img
          src={logoPreview}
          alt="Company Logo"
          className="vn-rounded-full vn-w-24 vn-h-24 vn-object-cover vn-ring-2"
        />
      </div>
      <div className="vn-flex vn-justify-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
          className="vn-text-center"
        />
      </div>

      {/* Company Name Field */}
      <div className="vn-flex vn-flex-col md:vn-flex-row vn-gap-3">
        <label
          htmlFor="companyName"
          className="vn-text-gray-700 vn-font-medium vn-w-full md:vn-w-1/2 vn-flex vn-items-center"
        >
          Company Name:
        </label>
        <input
          id="companyName"
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Enter your company name"
          className="vn-border vn-border-gray-300 vn-rounded-lg vn-w-full md:vn-w-1/2 vn-h-10 vn-px-3 focus:vn-outline-none focus:vn-ring-2 focus:vn-ring-indigo-500"
          required
        />
      </div>

      {/* Primary Color Field */}
      <div className="vn-flex vn-flex-col md:vn-flex-row vn-gap-3">
        <label
          htmlFor="primaryColor"
          className="vn-text-gray-700 vn-font-medium vn-w-full md:vn-w-1/2 vn-flex vn-items-center"
        >
          Primary Color:
        </label>
        <input
          id="primaryColor"
          type="color"
          value={primaryColor}
          onChange={(e) => setPrimaryColor(e.target.value)}
          className="vn-border vn-border-gray-300 vn-rounded-lg vn-w-full md:vn-w-1/2 vn-h-10 vn-px-3 focus:vn-outline-none focus:vn-ring-2 focus:vn-ring-indigo-500"
        />
      </div>

      {/* Secondary Color Field */}
      <div className="vn-flex vn-flex-col md:vn-flex-row vn-gap-3">
        <label
          htmlFor="secondaryColor"
          className="vn-text-gray-700 vn-font-medium vn-w-full md:vn-w-1/2 vn-flex vn-items-center"
        >
          Secondary Color:
        </label>
        <input
          id="secondaryColor"
          type="color"
          value={secondaryColor}
          onChange={(e) => setSecondaryColor(e.target.value)}
          className="vn-border vn-border-gray-300 vn-rounded-lg vn-w-full md:vn-w-1/2 vn-h-10 vn-px-3 focus:vn-outline-none focus:vn-ring-2 focus:vn-ring-indigo-500"
        />
      </div>

      {/* Buttons */}
      <div className="vn-flex vn-justify-evenly">
        <button
          type="submit"
          className="vn-shadow-sm vn-flex vn-justify-center vn-items-center vn-bg-indigo-600 vn-text-white vn-rounded-lg vn-px-4 vn-py-2 hover:vn-bg-indigo-700 transition-colors"
        >
          Update
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="vn-shadow-sm vn-flex vn-justify-center vn-items-center vn-bg-red-600 vn-text-white vn-rounded-lg vn-px-4 vn-py-2 hover:vn-bg-red-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default SettingsComponent;
