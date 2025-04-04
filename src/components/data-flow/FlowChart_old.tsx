'use client';
// Importando bibliotecas e componentes necessários

import React, { useState, useEffect } from 'react';
import ReactFlow, { 
  Controls, 
  Background, 
  MiniMap,
  useNodesState,
  useEdgesState,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sampleData, sampleRelations } from '../../data-analise/sample-data';

// Definição de tipos para nossos dados
type DataNode = {
  id: string;
  data: { 
    label: string;
    fields?: Record<string, string>;
    type: string;
  };
  position: { x: number; y: number };
};

type DataEdge = {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: string;
};

export const DataFlowDiagram = () => {
  // Estados para armazenar nós e arestas
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedDataSource, setSelectedDataSource] = useState('sample');
  
  // Efeito para carregar dados iniciais
  useEffect(() => {
    // Aqui carregaríamos dados do banco selecionado
    // Por enquanto, usamos dados de amostra
    
    const initialNodes: DataNode[] = sampleData.tables.map((table, index) => ({
      id: table.name,
      data: { 
        label: table.name,
        fields: table.fields,
        type: 'table'
      },
      position: { x: 250 * index, y: 100 * (index % 3) }
    }));
    
    const initialEdges: DataEdge[] = sampleRelations.map((relation, index) => ({
      id: `e${index}`,
      source: relation.source,
      target: relation.target,
      label: relation.type,
      type: 'smoothstep'
    }));
    
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [selectedDataSource]);
  
  // Nó personalizado para tabelas de banco de dados
  const DataNodeComponent = ({ data }) => {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 min-w-64">
        <div className="font-bold text-lg mb-2 text-blue-700">{data.label}</div>
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
    );
  };
  
  // Registrando o componente personalizado
  const nodeTypes = {
    table: DataNodeComponent
  };
  
  // Lista de fontes de dados disponíveis (simulação)
  const dataSources = [
    { id: 'sample', name: 'Dados de Exemplo' },
    { id: 'users', name: 'Banco de Usuários' },
    { id: 'products', name: 'Banco de Produtos' }
  ];
  
  return (
    <Card className="w-full h-full">
      <CardContent className="p-0 h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background />
          <Panel position="top-left" className="bg-white p-2 rounded shadow m-4">
            <div className="flex gap-2 items-center">
              <Select
                value={selectedDataSource}
                onValueChange={setSelectedDataSource}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Selecione a fonte" />
                </SelectTrigger>
                <SelectContent>
                  {dataSources.map(source => (
                    <SelectItem key={source.id} value={source.id}>
                      {source.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm">Atualizar</Button>
            </div>
          </Panel>
        </ReactFlow>
      </CardContent>
    </Card>
  );
};

export default DataFlowDiagram;