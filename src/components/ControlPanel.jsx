import { useState } from "react";
import PropTypes from "prop-types";

import "./ControlPanel.css";

const ControlPanel = ({
  addState,
  addTransition,
  removeState,
  removeTransition,
}) => {
  const [newStateName, setNewStateName] = useState("");
  const [fromState, setFromState] = useState("");
  const [toState, setToState] = useState("");
  const [stateToRemove, setStateToRemove] = useState("");
  const [transitionToRemove, setTransitionToRemove] = useState("");

  const handleAddState = (e) => {
    e.preventDefault();
    if (newStateName) {
      addState(newStateName);
      setNewStateName("");
    }
  };

  const handleAddTransition = (e) => {
    e.preventDefault();
    if (fromState && toState) {
      addTransition(fromState, toState);
      setFromState("");
      setToState("");
    }
  };

  const handleRemoveState = (e) => {
    e.preventDefault();
    if (stateToRemove) {
      removeState(stateToRemove);
      setStateToRemove("");
    }
  };

  const handleRemoveTransition = (e) => {
    e.preventDefault();
    if (transitionToRemove) {
      const [from, to] = transitionToRemove.split("-");
      removeTransition(from, to);
      setTransitionToRemove("");
    }
  };

  return (
    <div className="control-panel">
      <h2>Control Panel</h2>

      <form onSubmit={handleAddState}>
        <div className="form-group">
          <label htmlFor="newStateName">Add State</label>
          <input
            id="newStateName"
            type="text"
            value={newStateName}
            onChange={(e) => setNewStateName(e.target.value)}
            placeholder="New state name"
          />
        </div>
        <button type="submit">Add State</button>
      </form>

      <form onSubmit={handleAddTransition}>
        <div className="form-group">
          <label htmlFor="fromState">Add Transition</label>
          <input
            id="fromState"
            type="text"
            value={fromState}
            onChange={(e) => setFromState(e.target.value)}
            placeholder="From state"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            value={toState}
            onChange={(e) => setToState(e.target.value)}
            placeholder="To state"
          />
        </div>
        <button type="submit">Add Transition</button>
      </form>

      <form onSubmit={handleRemoveState}>
        <div className="form-group">
          <label htmlFor="stateToRemove">Remove State</label>
          <input
            id="stateToRemove"
            type="text"
            value={stateToRemove}
            onChange={(e) => setStateToRemove(e.target.value)}
            placeholder="State to remove"
          />
        </div>
        <button type="submit">Remove State</button>
      </form>

      <form onSubmit={handleRemoveTransition}>
        <div className="form-group">
          <label htmlFor="transitionToRemove">Remove Transition</label>
          <input
            id="transitionToRemove"
            type="text"
            value={transitionToRemove}
            onChange={(e) => setTransitionToRemove(e.target.value)}
            placeholder="Transition to remove (from-to)"
          />
        </div>
        <button type="submit">Remove Transition</button>
      </form>
    </div>
  );
};

ControlPanel.propTypes = {
  addState: PropTypes.func.isRequired,
  addTransition: PropTypes.func.isRequired,
  removeState: PropTypes.func.isRequired,
  removeTransition: PropTypes.func.isRequired,
};

export default ControlPanel;
