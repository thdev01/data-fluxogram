"use client";

import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, { 
  Controls, 
  Background, 
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  useReactFlow,
  ConnectionLineType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card, CardContent } from '@/components/ui/card';
import { DataNode as DataNodeType, DataEdge, DatabaseSchema, schemaToGraph } from '@/data-analise/schema';
import { sampleData, sampleRelations } from '@/data-analise/sample-data';
import DataNode from './DataNode';
import RelationEdge from './RelationEdge';
import ControlPanel from './ControlPanel';
import { generateLayout } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

// Convertendo os dados de exemplo para o formato de schema
const sampleSchema: DatabaseSchema = {
  metadata: {
    name: 'Sample Database',
    description: 'Example database schema for demonstration',
    version: '1.0',
    created: new Date().toISOString(),
  },
  tables: sampleData.tables.map(table => ({
    name: table.name,
    displayName: table.name.charAt(0).toUpperCase() + table.name.slice(1),
    fields: table.fields,
    description: `Table for ${table.name} data`,
  })),
  relations: sampleRelations.map(relation => ({
    source: relation.source,
    target: relation.target,
    type: relation.type as any,
    sourceField: relation.sourceField,
    targetField: relation.targetField,
    displayName: `${relation.source} → ${relation.target}`,
  })),
};

// Tipos de nós personalizados
const nodeTypes = {
  table: DataNode,
};

// Tipos de arestas personalizadas
const edgeTypes = {
  relation: RelationEdge,
};

export const DataFlowDiagram = () => {
  // Estado para nós e arestas
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  // Estado para fonte de dados selecionada
  const [selectedDataSource, setSelectedDataSource] = useState('sample');
  
  // Estado para direção do layout
  const [layoutDirection, setLayoutDirection] = useState('LR');
  
  // Referência ao React Flow
  const reactFlowInstance = useReactFlow();
  
  // Toast para notificações
  const { toast } = useToast();
  
  // Lista de fontes de dados disponíveis (simulação)
  const dataSources = [
    { id: 'sample', name: 'Dados de Exemplo' },
    { id: 'users', name: 'Banco de Usuários' },
    { id: 'products', name: 'Banco de Produtos' }
  ];
  
  // Função para carregar dados
  const loadData = useCallback(async (sourceId: string) => {
    try {
      // Aqui você pode carregar dados de diferentes fontes
      // Por enquanto, só temos os dados de exemplo
      let schema: DatabaseSchema;
      
      if (sourceId === 'sample') {
        schema = sampleSchema;
      } else {
        // Simulação de carregamento de outros bancos de dados
        // Em um cenário real, isso seria uma chamada API
        schema = sampleSchema; // Usando o mesmo schema como fallback
        
        toast({
          title: 'Fonte de dados não implementada',
          description: `A fonte '${sourceId}' será implementada em breve.`,
        });
      }
      
      // Converter schema para nós e arestas
      const { nodes: schemaNodes, edges: schemaEdges } = schemaToGraph(schema);
      
      // Aplicar layout automático
      const layoutedNodes = generateLayout(schemaNodes, schemaEdges, layoutDirection);
      
      // Atualizar estado
      setNodes(layoutedNodes);
      setEdges(schemaEdges);
      
      // Centralizar visualização
      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.2 });
      }, 50);
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: 'Erro ao carregar dados',
        description: 'Não foi possível carregar os dados selecionados.',
        variant: 'destructive',
      });
    }
  }, [reactFlowInstance, layoutDirection, toast]);
  
  // Carregar dados quando a fonte ou direção de layout mudar
  useEffect(() => {
    loadData(selectedDataSource);
  }, [selectedDataSource, layoutDirection, loadData]);
  
  // Manipulador para conexões
  const onConnect = useCallback((params: Connection) => {
    const newEdge: Edge = {
      ...params,
      type: 'relation',
      data: {
        relationType: 'belongs_to',
      },
      animated: true,
    };
    
    setEdges((eds) => addEdge(newEdge, eds));
  }, [setEdges]);
  
  // Função para busca de nós
  const handleSearch = useCallback((query: string) => {
    if (!query.trim()) {
      // Se a busca estiver vazia, mostrar todos os nós normalmente
      loadData(selectedDataSource);
      return;
    }
    
    // Filtrar nós que correspondem à consulta (case insensitive)
    const lowerQuery = query.toLowerCase();
    
    setNodes((nds) => 
      nds.map((node) => {
        // Verificar se o nome da tabela contém a consulta
        const matchesLabel = node.data.label.toLowerCase().includes(lowerQuery);
        
        // Verificar se algum campo contém a consulta
        const matchesField = node.data.fields 
          ? Object.keys(node.data.fields).some(
              field => field.toLowerCase().includes(lowerQuery) || 
                     node.data.fields[field].toLowerCase().includes(lowerQuery)
            )
          : false;
          
        // Destacar nós que correspondem à consulta
        if (matchesLabel || matchesField) {
          return {
            ...node,
            style: { 
              ...node.style,
              boxShadow: '0 0 10px #3b82f6',
              border: '2px solid #3b82f6'
            },
          };
        }
        
        // Diminuir a opacidade de nós que não correspondem
        return {
          ...node,
          style: { 
            ...node.style,
            opacity: 0.4
          },
        };
      })
    );
  }, [selectedDataSource, loadData]);
  
  // Função para exportar o diagrama
  const handleExport = useCallback(() => {
    const currentNodes = reactFlowInstance.getNodes();
    const currentEdges = reactFlowInstance.getEdges();
    
    // Criar um objeto para exportação
    const exportObject = {
      schema: sampleSchema, // Usando o schema carregado atualmente
      layout: {
        nodes: currentNodes.map(node => ({
          id: node.id,
          position: node.position
        })),
      }
    };
    
    // Converter para JSON
    const dataStr = JSON.stringify(exportObject, null, 2);
    
    // Criar um blob e um link para download
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `data-fluxogram-${selectedDataSource}-${new Date().toISOString().slice(0, 10)}.json`;
    link.href = url;
    link.click();
    
    toast({
      title: 'Diagrama exportado com sucesso',
      description: 'O arquivo JSON foi baixado para o seu computador.',
    });
  }, [reactFlowInstance, selectedDataSource, toast]);
  
  return (
    <ReactFlowProvider>
      <Card className="w-full h-full">
        <CardContent className="p-0 h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            connectionLineType={ConnectionLineType.SmoothStep}
            fitView
            attributionPosition="bottom-right"
          >
            <Controls />
            <MiniMap 
              nodeStrokeWidth={3}
              zoomable
              pannable
            />
            <Background gap={12} size={1} />
            
            <ControlPanel
              dataSources={dataSources}
              selectedDataSource={selectedDataSource}
              onDataSourceChange={setSelectedDataSource}
              onLayoutChange={setLayoutDirection}
              onSearch={handleSearch}
              onExport={handleExport}
              onRefresh={() => loadData(selectedDataSource)}
            />
          </ReactFlow>
        </CardContent>
      </Card>
    </ReactFlowProvider>
  );
};

// Componente wrapper para garantir que o ReactFlow seja inicializado corretamente
const FlowChartWrapper = () => {
  return (
    <ReactFlowProvider>
      <div style={{ width: '100%', height: '100%' }}>
        <DataFlowDiagram />
      </div>
    </ReactFlowProvider>
  );
};

export default FlowChartWrapper;