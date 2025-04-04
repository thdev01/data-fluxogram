"use client";

import React from 'react';
import { Panel } from 'reactflow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, LayoutGrid, Search, ZoomIn, ZoomOut, Save, Download } from 'lucide-react';

interface ControlPanelProps {
  onLayoutChange: (direction: string) => void;
  onSearch: (query: string) => void;
  onExport: () => void;
  dataSources: Array<{ id: string; name: string }>;
  selectedDataSource: string;
  onDataSourceChange: (value: string) => void;
  onRefresh: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onLayoutChange,
  onSearch,
  onExport,
  dataSources,
  selectedDataSource,
  onDataSourceChange,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <Panel position="top-left" className="bg-white p-4 rounded-lg shadow-md m-4 w-72">
      <div className="space-y-4">
        {/* Fonte de dados */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Fonte de Dados</label>
          <div className="flex gap-2">
            <Select
              value={selectedDataSource}
              onValueChange={onDataSourceChange}
            >
              <SelectTrigger className="w-full">
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
            <Button size="sm" variant="outline" onClick={onRefresh}>
              <Check className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Pesquisa */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Pesquisar</label>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Buscar tabela ou campo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-sm"
            />
            <Button type="submit" size="sm" variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Layout */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Layout</label>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => onLayoutChange('LR')}>
              <LayoutGrid className="h-4 w-4 mr-1" /> Horizontal
            </Button>
            <Button size="sm" variant="outline" onClick={() => onLayoutChange('TB')}>
              <LayoutGrid className="h-4 w-4 mr-1 rotate-90" /> Vertical
            </Button>
            <Button size="sm" variant="outline" onClick={onExport}>
              <Download className="h-4 w-4 mr-1" /> Exportar
            </Button>
          </div>
        </div>
      </div>
    </Panel>
  );
};

export default ControlPanel;