import React from "react";
import "../Styles/Card.css";

function Card({ collegename, course, handler, uuid, reorderHandler }) {
  return (
    <>
      <div className="card">
        <div className="card_header">
          <h2>{collegename}</h2>
        </div>
        <div className="card_list">
          <p style={{ fontWeight: "bold", marginRight: "20px" }}>Course</p>
          <p>{course}</p>
        </div>
        {/* <div className="card_list">
          <p style={{ fontWeight: "bold", marginRight: "20px" }}>Avg Pgk</p>
          <p>hi</p>
        </div> */}
        <hr></hr>

        <button
          onClick={() => {
            reorderHandler(uuid, "UP");
          }}
        >
          ⬆
        </button>
        <button
          onClick={() => {
            reorderHandler(uuid, "DOWN");
          }}
        >
          ⬇
        </button>
        <button
          onClick={() => {
            handler(uuid);
          }}
        >
          Remove
        </button>
      </div>
    </>
  );
}

export default Card;
