import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';

export default function Settings() {
  const { user, setName } = useUser();
  const [nameInput, setNameInput] = useState(user.name);

  useEffect(() => {
    setNameInput(user.name);
  }, [user.name]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setName(nameInput.trim() || 'Your Name');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Settings</h1>
        <p className="text-text-secondary mt-1">Configure your discipline tracker.</p>
      </div>

      <div className="bg-card rounded-2xl shadow-card p-6 max-w-md">
        <h2 className="text-lg font-medium text-text-primary mb-4">Your Name</h2>
        <p className="text-text-secondary text-sm mb-4">
          This name appears in the sidebar and top bar.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="display-name" className="block text-sm font-medium text-text-primary mb-1">
              Display name
            </label>
            <input
              id="display-name"
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Your Name"
              className="w-full border border-border rounded-lg px-3 py-2 text-text-primary bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
