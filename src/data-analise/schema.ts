// Definição de tipos para as estruturas de dados básicas
export interface Field {
    name: string;
    type: string;
    isPrimary?: boolean;
    isForeign?: boolean;
    references?: {
      table: string;
      field: string;
    };
    nullable?: boolean;
    defaultValue?: any;
  }
  
  export interface Table {
    name: string;
    displayName?: string;
    description?: string;
    fields: Record<string, string> | Field[];
    primaryKey?: string;
  }
  
  export interface Relation {
    source: string;
    target: string;
    type: 'one-to-one' | 'one-to-many' | 'many-to-many' | 'belongs_to';
    sourceField: string;
    targetField: string;
    displayName?: string;
  }
  
  export interface Database {
    name: string;
    description?: string;
    tables: Table[];
  }
  
  // Tipo para o nó visual no diagrama
  export interface DataNode {
    id: string;
    type: string;
    data: {
      label: string;
      fields?: Record<string, string>;
      type: string;
      description?: string;
    };
    position: {
      x: number;
      y: number;
    };
  }
  
  // Tipo para as arestas visuais no diagrama
  export interface DataEdge {
    id: string;
    source: string;
    target: string;
    label?: string;
    type?: string;
    data?: {
      relationType?: 'one-to-one' | 'one-to-many' | 'many-to-many' | 'belongs_to';
      sourceField?: string;
      targetField?: string;
    };
  }
  
  // Interface para o formato de estrutura do banco de dados
  export interface DatabaseSchema {
    metadata: {
      name: string;
      description?: string;
      version?: string;
      created?: string;
      updated?: string;
    };
    tables: Table[];
    relations: Relation[];
  }
  
  // Função auxiliar para converter um schema para nós e arestas
  export function schemaToGraph(schema: DatabaseSchema): { nodes: DataNode[], edges: DataEdge[] } {
    // Converter tabelas em nós
    const nodes: DataNode[] = schema.tables.map((table, index) => ({
      id: table.name,
      type: 'table',
      data: {
        label: table.displayName || table.name,
        fields: typeof table.fields === 'object' && !Array.isArray(table.fields) 
          ? table.fields 
          : (table.fields as Field[]).reduce((acc, field) => {
              acc[field.name] = field.type;
              return acc;
            }, {} as Record<string, string>),
        type: 'table',
        description: table.description
      },
      position: { x: 250 * (index % 3), y: 200 * Math.floor(index / 3) }
    }));
  
    // Converter relações em arestas
    const edges: DataEdge[] = schema.relations.map((relation, index) => ({
      id: `e${index}`,
      source: relation.source,
      target: relation.target,
      label: relation.displayName || relation.type,
      type: 'relation',
      data: {
        relationType: relation.type,
        sourceField: relation.sourceField,
        targetField: relation.targetField
      }
    }));
  
    return { nodes, edges };
  }
  
  // Função para validar um esquema de banco de dados
  export function validateSchema(schema: DatabaseSchema): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Verificar se há nome do banco de dados
    if (!schema.metadata.name) {
      errors.push('Schema não possui nome');
    }
    
    // Verificar se há tabelas
    if (!schema.tables || schema.tables.length === 0) {
      errors.push('Schema não possui tabelas');
    }
    
    // Verificar se todas as tabelas têm nomes e campos
    schema.tables.forEach((table, index) => {
      if (!table.name) {
        errors.push(`Tabela #${index + 1} não possui nome`);
      }
      
      if (!table.fields || (Array.isArray(table.fields) && table.fields.length === 0) || 
          (!Array.isArray(table.fields) && Object.keys(table.fields).length === 0)) {
        errors.push(`Tabela ${table.name || index + 1} não possui campos`);
      }
    });
    
    // Verificar se as relações referenciam tabelas válidas
    const tableNames = new Set(schema.tables.map(t => t.name));
    
    schema.relations.forEach((relation, index) => {
      if (!tableNames.has(relation.source)) {
        errors.push(`Relação #${index + 1}: tabela fonte '${relation.source}' não existe`);
      }
      
      if (!tableNames.has(relation.target)) {
        errors.push(`Relação #${index + 1}: tabela alvo '${relation.target}' não existe`);
      }
    });
    
    return {
      valid: errors.length === 0,
      errors
    };
  }