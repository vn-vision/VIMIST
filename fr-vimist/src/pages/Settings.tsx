import SettingsComponent from '../components/SettingsComponent'

function Settings() {
  return (
    <div className="vn-flex vn-flex-col vn-h-3/4 vn-justify-between vn-p-5">
      <h1 className="vn-text-2xl vn-font-bold vn-mb-5">Settings</h1>
      <div>
      <SettingsComponent />
      </div>
    </div>
  )
}

export default Settings
