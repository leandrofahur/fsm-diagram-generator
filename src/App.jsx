import { useState, useCallback } from "react";
import DiagramCanvas from "./components/DiagramCanvas";
import ControlPanel from "./components/ControlPanel";
import "./App.css";

function App() {
  const [states, setStates] = useState({
    1: { id: 1, name: "S1", x: 100, y: 100 },
    2: { id: 2, name: "S2", x: 250, y: 100 },
  });
  const [transitions, setTransitions] = useState([{ from: 1, to: 2 }]);

  const updateStatePosition = useCallback((id, x, y) => {
    setStates((prevStates) => ({
      ...prevStates,
      [id]: { ...prevStates[id], x, y },
    }));
  }, []);

  const addState = useCallback((name) => {
    setStates((prevStates) => {
      const newId = Math.max(...Object.keys(prevStates).map(Number), 0) + 1;
      return {
        ...prevStates,
        [newId]: { id: newId, name, x: 150, y: 150 },
      };
    });
  }, []);

  const addTransition = useCallback(
    (from, to) => {
      const fromState = Object.values(states).find((s) => s.name === from);
      const toState = Object.values(states).find((s) => s.name === to);
      if (fromState && toState) {
        setTransitions((prevTransitions) => [
          ...prevTransitions,
          { from: fromState.id, to: toState.id },
        ]);
      } else {
        console.error("Could not find states for transition:", from, to);
      }
    },
    [states]
  );

  const removeState = useCallback(
    (name) => {
      setStates((prevStates) => {
        const newStates = { ...prevStates };
        const stateToRemove = Object.values(newStates).find(
          (s) => s.name === name
        );
        if (stateToRemove) {
          delete newStates[stateToRemove.id];
        }
        return newStates;
      });
      setTransitions((prevTransitions) =>
        prevTransitions.filter((t) => {
          const stateToRemove = Object.values(states).find(
            (s) => s.name === name
          );
          return stateToRemove
            ? t.from !== stateToRemove.id && t.to !== stateToRemove.id
            : true;
        })
      );
    },
    [states]
  );

  const removeTransition = useCallback(
    (from, to) => {
      const fromState = Object.values(states).find((s) => s.name === from);
      const toState = Object.values(states).find((s) => s.name === to);
      if (fromState && toState) {
        setTransitions((prevTransitions) =>
          prevTransitions.filter(
            (t) => !(t.from === fromState.id && t.to === toState.id)
          )
        );
      }
    },
    [states]
  );

  return (
    <div className="App">
      <h1>Finite-State Machine Diagram Generator</h1>
      <div className="main-container">
        <DiagramCanvas
          states={Object.values(states)}
          transitions={transitions}
          updateStatePosition={updateStatePosition}
        />
        <ControlPanel
          addState={addState}
          addTransition={addTransition}
          removeState={removeState}
          removeTransition={removeTransition}
        />
      </div>
    </div>
  );
}

export default App;
