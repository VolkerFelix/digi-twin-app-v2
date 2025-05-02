import React from 'react';

import dancingAvatarGif from '../assets/avatar-images/joyful-dancing.gif';

const DancingAvatar = () => {
  return (  
    <div className="w-full h-full">
      <img src={dancingAvatarGif} alt="Dancing Avatar" className="w-full h-full object-cover" />
    </div>
  );
};

export default DancingAvatar;