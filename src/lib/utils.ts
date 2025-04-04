// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Função para gerar layout automático de nós
export function generateLayout(nodes, edges, direction = 'LR') {
  // Implementação simples de layout automático
  // Em um projeto real, você pode usar bibliotecas como dagre ou elkjs
  
  const levels = {};
  const processed = new Set();
  
  // Encontrar raízes (nós sem entrada)
  const hasIncoming = new Set();
  edges.forEach(edge => {
    hasIncoming.add(edge.target);
  });
  
  const roots = nodes.filter(node => !hasIncoming.has(node.id)).map(node => node.id);
  
  // Se não houver raízes, use o primeiro nó
  if (roots.length === 0 && nodes.length > 0) {
    roots.push(nodes[0].id);
  }
  
  // Função para atribuir níveis
  function assignLevels(nodeId, level = 0) {
    if (processed.has(nodeId)) return;
    processed.add(nodeId);
    
    if (!levels[level]) levels[level] = [];
    levels[level].push(nodeId);
    
    // Encontrar nós conectados
    const connected = edges
      .filter(edge => edge.source === nodeId)
      .map(edge => edge.target);
    
    connected.forEach(targetId => {
      assignLevels(targetId, level + 1);
    });
  }
  
  // Atribuir níveis a partir das raízes
  roots.forEach(root => assignLevels(root));
  
  // Posicionar nós com base nos níveis
  const spacing = { x: 300, y: 150 };
  const positions = {};
  
  Object.keys(levels).forEach((level, levelIndex) => {
    const nodesInLevel = levels[level];
    
    nodesInLevel.forEach((nodeId, nodeIndex) => {
      positions[nodeId] = {
        x: direction === 'LR' ? levelIndex * spacing.x : nodeIndex * spacing.x,
        y: direction === 'LR' ? nodeIndex * spacing.y : levelIndex * spacing.y
      };
    });
  });
  
  // Aplicar posições aos nós
  return nodes.map(node => ({
    ...node,
    position: positions[node.id] || { x: 0, y: 0 }
  }));
}