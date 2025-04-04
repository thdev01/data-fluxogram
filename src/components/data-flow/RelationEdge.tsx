"use client";

import React, { memo } from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';

export type RelationEdgeData = {
  label?: string;
  relationType?: 'one-to-one' | 'one-to-many' | 'many-to-many' | 'belongs_to';
};

const RelationEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style = {},
  markerEnd,
}: EdgeProps<RelationEdgeData>) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Define cor baseada no tipo de relação
  let color = '#888';
  let labelBg = '#ffffff';
  
  if (data?.relationType === 'one-to-many') {
    color = '#3b82f6';
  } else if (data?.relationType === 'many-to-many') {
    color = '#ef4444';
  } else if (data?.relationType === 'one-to-one') {
    color = '#22c55e';
  } else if (data?.relationType === 'belongs_to') {
    color = '#8b5cf6';
  }

  return (
    <>
      <path
        id={id}
        style={{ ...style, stroke: color, strokeWidth: 2 }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      {data?.label && (
        <g transform={`translate(${labelX - 20}, ${labelY - 10})`}>
          <rect
            x="0"
            y="0"
            width={data.label.length * 6 + 10}
            height="20"
            rx="4"
            ry="4"
            fill={labelBg}
            stroke={color}
            strokeWidth="1"
          />
          <text
            x="5"
            y="14"
            fontSize="12"
            fontWeight="500"
            textAnchor="start"
            fill={color}
          >
            {data.label}
          </text>
        </g>
      )}
    </>
  );
};

export default memo(RelationEdge);