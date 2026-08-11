import React from "react";
import honeyLogo from "../../assets/honeywell.png";

function LoginRight() {
  return (
    <>
      <div className="auth-hero-orb auth-hero-orb-one" aria-hidden="true" />
      <div className="auth-hero-orb auth-hero-orb-two" aria-hidden="true" />
      <div className="auth-hero-grid" aria-hidden="true" />

      <div className="auth-hero-logo-right">
        <img
          src={honeyLogo}
          alt="Honeywell IT Solutions logo"
          className="auth-right-logo"
          loading="eager"
          decoding="async"
        />
      </div>
    </>
  );
}

export default LoginRight;
