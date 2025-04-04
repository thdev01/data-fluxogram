"use client";

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export type DataNodeData = {
  label: string;
  fields?: Record<string, string>;
  type: string;
};

const DataNode = ({ data, isConnectable }: NodeProps<DataNodeData>) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 w-64">
      {/* Handles para conectar arestas */}
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-blue-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-blue-500"
      />
      
      {/* Conteúdo do nó */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="font-bold text-lg text-blue-700">{data.label}</div>
          <div className="text-xs bg-gray-100 px-2 py-1 rounded">{data.type}</div>
        </div>
        
        {data.fields && (
          <div className="text-sm">
            <div className="border-t border-gray-200 pt-2">
              {Object.entries(data.fields).map(([key, type]) => (
                <div key={key} className="flex justify-between py-1">
                  <span className="font-medium">{key}</span>
                  <span className="text-gray-500">{type}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(DataNode);