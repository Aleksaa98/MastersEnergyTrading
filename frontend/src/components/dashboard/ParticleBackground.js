import React from 'react';

const ParticleBackground = () => {
  const particles = Array.from({ length: 50 });

  return (
    <div className="particle-background">
      {particles.map((_, index) => (
        <div key={index} className="particle"></div>
      ))}
    </div>
  );
};

export default ParticleBackground;
