import Particles from "react-tsparticles";
import React from "react";
import particlesConfig from './config/particles-config';

const ParticleBackground = () => {
    return (
      <div className="absolute inset-0 z-0">
        <Particles
          id="tsparticles"
          options={particlesConfig}
          className="absolute inset-0 z-0"
        />
      </div>
    );
  };
export default ParticleBackground