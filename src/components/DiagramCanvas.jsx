import { useState, useCallback } from "react";
import PropTypes from "prop-types";

import "./DiagramCanvas.css";

const State = ({ state, x, y, onMouseDown }) => (
  <g className="state-node" onMouseDown={(e) => onMouseDown(e, state.id)}>
    <circle className="state-circle" cx={x} cy={y} r="30" />
    <text className="state-text" x={x} y={y}>
      {state.name}
    </text>
  </g>
);

const Transition = ({ from, to }) => {
  if (from.id === to.id) {
    // Self-transition
    const radius = 35;
    const startAngle = -Math.PI / 1.5;
    const endAngle = startAngle - Math.PI * 1.5;

    const start = {
      x: from.x,
      y: from.y,
    };
    const end = {
      x: from.x + radius * Math.cos(endAngle),
      y: from.y + radius * Math.sin(endAngle),
    };

    const path = `M ${start.x} ${start.y} A ${radius} ${radius} 0 1 1 ${end.x} ${end.y}`;

    return (
      <g className="transition">
        <path
          className="transition-line"
          d={path}
          fill="none"
          markerEnd="url(#arrowhead)"
        />
        <text
          className="transition-text"
          x={from.x}
          y={from.x}
          textAnchor="middle"
        >
          {to.name}
        </text>
      </g>
    );
  }

  const dx = to.x - from.x;
  const dy = to.y - from.y;

  // Calculate control points for the curve
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  const curvature = 0.25; // Adjust this value to change the curve's height

  const controlX = midX - dy * curvature;
  const controlY = midY + dx * curvature;

  // Create the path
  const path = `M ${from.x} ${from.y} Q ${controlX} ${controlY}, ${to.x} ${to.y}`;

  // Calculate position for the label
  const labelX = controlX;
  const labelY = controlY + 10; // Offset the label slightly above the curve

  return (
    <g className="transition">
      <path
        className="transition-line"
        d={path}
        fill="none"
        markerEnd="url(#arrowhead)"
      />
      <text
        className="transition-text"
        x={labelX}
        y={labelY}
        textAnchor="middle"
      >
        {`${from.name} -> ${to.name}`}
      </text>
    </g>
  );
};

const DiagramCanvas = ({ states, transitions, updateStatePosition }) => {
  const [draggingStateId, setDraggingStateId] = useState(null);

  const handleMouseDown = useCallback((e, stateId) => {
    setDraggingStateId(stateId);
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (draggingStateId !== null) {
        const svg = e.currentTarget;
        const point = svg.createSVGPoint();
        point.x = e.clientX;
        point.y = e.clientY;
        const { x, y } = point.matrixTransform(svg.getScreenCTM().inverse());
        updateStatePosition(draggingStateId, x, y);
      }
    },
    [draggingStateId, updateStatePosition]
  );

  const handleMouseUp = useCallback(() => {
    setDraggingStateId(null);
  }, []);

  return (
    <svg
      className="diagram-canvas"
      width="100%"
      height="500"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="7"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#ffffff" />
        </marker>
      </defs>
      {transitions.map((transition) => (
        <Transition
          key={`${transition.from}-${transition.to}`}
          from={states.find((s) => s.id === transition.from)}
          to={states.find((s) => s.id === transition.to)}
        />
      ))}
      {states.map((state) => (
        <State
          key={state.id}
          state={state}
          x={state.x}
          y={state.y}
          onMouseDown={handleMouseDown}
        />
      ))}
    </svg>
  );
};

State.propTypes = {
  state: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  onMouseDown: PropTypes.func.isRequired,
};

Transition.propTypes = {
  from: PropTypes.shape({
    id: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  to: PropTypes.shape({
    id: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

DiagramCanvas.propTypes = {
  states: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    })
  ).isRequired,
  transitions: PropTypes.arrayOf(
    PropTypes.shape({
      from: PropTypes.number.isRequired,
      to: PropTypes.number.isRequired,
    })
  ).isRequired,
  updateStatePosition: PropTypes.func.isRequired,
};

export default DiagramCanvas;
