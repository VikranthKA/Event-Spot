import React, { useEffect } from 'react';

const Darkmode = () => {
  const toggleDarkMode = () => {
    // Function to toggle between dark mode and light mode
    const body = document.body;
    body.classList.toggle('dark-mode');

    // Save the user's preference in localStorage
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('dark-mode', isDarkMode);
  };

  useEffect(() => {
    // Check if the user has a preference for dark mode in localStorage on component mount
    const savedDarkMode = localStorage.getItem('dark-mode');
    if (savedDarkMode) {
      document.body.classList.toggle('dark-mode', savedDarkMode === 'true');
    }
  }, []);

  return (
    <div>
      <button onClick={toggleDarkMode}>Dark</button>
    </div>
  );
};

export default Darkmode;
