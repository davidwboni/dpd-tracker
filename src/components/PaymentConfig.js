import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Settings, Save } from 'lucide-react';

const PaymentConfig = ({ currentConfig, onSave }) => {
  const [config, setConfig] = useState(currentConfig);
  const [showSuccess, setShowSuccess] = useState(false);

  const presets = [
    { name: "110 Stops", cutoff: 110, before: 1.98, after: 1.48 },
    { name: "125 Stops", cutoff: 125, before: 1.98, after: 1.48 },
  ];

  const handleSave = () => {
    onSave(config);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <Card className="dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 dark:text-white">
          <Settings className="w-5 h-5" />
          Payment Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {presets.map(preset => (
            <Button
              key={preset.name}
              variant={config.cutoffPoint === preset.cutoff ? "default" : "outline"}
              onClick={() => setConfig({
                cutoffPoint: preset.cutoff,
                rateBeforeCutoff: preset.before,
                rateAfterCutoff: preset.after
              })}
              className="w-full"
            >
              {preset.name}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Cutoff Point
            </label>
            <Input
              type="number"
              value={config.cutoffPoint}
              onChange={(e) => setConfig({
                ...config,
                cutoffPoint: parseInt(e.target.value)
              })}
              className="dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Rate Before Cutoff (£)
            </label>
            <Input
              type="number"
              step="0.01"
              value={config.rateBeforeCutoff}
              onChange={(e) => setConfig({
                ...config,
                rateBeforeCutoff: parseFloat(e.target.value)
              })}
              className="dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Rate After Cutoff (£)
            </label>
            <Input
              type="number"
              step="0.01"
              value={config.rateAfterCutoff}
              onChange={(e) => setConfig({
                ...config,
                rateAfterCutoff: parseFloat(e.target.value)
              })}
              className="dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <Button 
          onClick={handleSave}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>

        {showSuccess && (
          <div className="bg-green-500 text-white p-2 rounded-md text-center">
            Settings saved successfully!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentConfig;