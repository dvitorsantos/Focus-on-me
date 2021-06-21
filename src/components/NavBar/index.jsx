import React from "react";

import "./index.css";

import Logo from "../../assets/brain-solid.svg";
import GlobeIcon from "../../assets/globe-solid.svg";

function NavBar() {
  return (
    <>
      <div className="navbar-container">
        <section>
          <img src={Logo} alt="Logo" />
          <h1>Focus on me</h1>
        </section>
        <section>
          <h1>What is Pomodoro?</h1>
          <img src={GlobeIcon} alt="Globe" />
          <h1>En</h1>
        </section>
      </div>
    </>
  );
}

export default NavBar;
