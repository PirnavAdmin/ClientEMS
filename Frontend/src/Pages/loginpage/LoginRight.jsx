import React from "react";
import honeyLogo from "../../assets/honeywell.png";
import { useBrandingLogo } from "../../utils/brandingLogo";

function LoginRight() {
  const resolvedLogo = useBrandingLogo("loginLogo");
  const logoSrc = resolvedLogo || honeyLogo;

  return (
    <>
      <div className="auth-hero-orb auth-hero-orb-one" aria-hidden="true" />
      <div className="auth-hero-orb auth-hero-orb-two" aria-hidden="true" />
      <div className="auth-hero-grid" aria-hidden="true" />

      <div className="auth-hero-logo-right">
        <img
          src={logoSrc}
          alt="Honeywell IT Solutions logo"
          className="auth-right-logo"
          loading="eager"
          decoding="async"
           onError={(event) => {
            if (event.currentTarget.src !== honeyLogo) {
              event.currentTarget.src = honeyLogo;
            }
          }}
        />
      </div>
    </>
  );
}

export default LoginRight;
