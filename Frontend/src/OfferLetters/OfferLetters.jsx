import React, { useState } from "react";
import { FaFileAlt } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./OfferLetters.css";
import OfferLetterSection from "./OfferLetterSection";
import RelievingLetterSection from "./RelievingLetterSection";
import ExperienceLetterSection from "./ExperienceLetterSection";

function OfferLetters() {
  const [letterType, setLetterType] = useState("offer");

  const heading =
    letterType === "relieving"
      ? "Relieving Letter Generation"
      : letterType === "experience"
        ? "Experience Letter Generation"
        : "Offer Letter Generation";

  const description =
    letterType === "relieving"
      ? "Generate relieving letters for employees"
      : letterType === "experience"
        ? "Generate experience letters for employees"
        : "Generate offer letters for new hires";

  return (
    <div className="offer-container">
      <ToastContainer position="top-right" autoClose={2500} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          marginBottom: "0px",
          paddingBottom: "0px",
          marginTop: "-15px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "26px",
            fontWeight: "650",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <FaFileAlt />
          {heading}
        </h2>

        <p
          style={{
            marginTop: "0px",
            marginLeft: "42px",
            fontSize: "15px",
            color: "var(--text-muted)",
            fontWeight: "500",
          }}
        >
          {description}
        </p>

        <div className="premium-input-group letter-type-field">
          <label>Letter Type</label>

          <select
            className="premium-input"
            value={letterType}
            onChange={(e) => setLetterType(e.target.value)}
          >
            <option value="offer">Offer Letter</option>
            <option value="relieving">Relieving Letter</option>
            <option value="experience">Experience Letter</option>
          </select>
        </div>
      </div>

      {letterType === "offer" && <OfferLetterSection />}
      {letterType === "relieving" && <RelievingLetterSection />}
      {letterType === "experience" && <ExperienceLetterSection />}
    </div>
  );
}

export default OfferLetters;
