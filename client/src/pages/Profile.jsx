import React, { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';

function Profile() {
  const [data, setData] = useState(null); // Initialize with null or an appropriate initial value

  useEffect(() => {
    // Access local storage here and update state
    const storedData = localStorage.getItem('user');
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []); // Empty dependency array to run the effect only once on component mount

  // Rest of your component code

  return (
    <div>
      <h1>User Profile</h1>
      <ul>
        {/* Check if data is not null before accessing its properties */}
        {data && <li>{data.email}</li>}
       
      </ul>
    </div>
  );
}

export default Profile;
