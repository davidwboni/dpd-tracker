import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Settings } from 'lucide-react';

const PaymentConfig = ({ currentConfig, onSave }) => {
  const [config, setConfig] = useState(currentConfig);

  const presets = [
    { name: "110 Stops", cutoff: 110, before: 1.98, after: 1.48 },
    { name: "125 Stops", cutoff: 125, before: 2.10, after: 1.60 },
  ];

  return (
    <Card className="bg-white">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="w-5 h-5" />
          Payment Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {presets.map(preset => (
            <Button
              key={preset.name}
              variant="outline"
              onClick={() => setConfig({
                cutoffPoint: preset.cutoff,
                rateBeforeCutoff: preset.before,
                rateAfterCutoff: preset.after
              })}
              className="text-sm"
            >
              {preset.name}
            </Button>
          ))}
        </div>

        <div className="space-y-2">
          <Input
            type="number"
            value={config.cutoffPoint}
            onChange={(e) => setConfig({
              ...config,
              cutoffPoint: parseInt(e.target.value)
            })}
            placeholder="Cutoff point"
            className="w-full"
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              step="0.01"
              value={config.rateBeforeCutoff}
              onChange={(e) => setConfig({
                ...config,
                rateBeforeCutoff: parseFloat(e.target.value)
              })}
              placeholder="Rate before cutoff"
            />
            <Input
              type="number"
              step="0.01"
              value={config.rateAfterCutoff}
              onChange={(e) => setConfig({
                ...config,
                rateAfterCutoff: parseFloat(e.target.value)
              })}
              placeholder="Rate after cutoff"
            />
          </div>
        </div>

        <Button 
          onClick={() => onSave(config)}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentConfig;