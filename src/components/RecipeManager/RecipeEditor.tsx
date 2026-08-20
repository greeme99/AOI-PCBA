import React, { useState } from 'react';
import {
  Sliders,
  Sun,
  ShieldCheck,
  Save,
  Check,
  RefreshCcw,
  SlidersHorizontal,
} from 'lucide-react';
import { InspectionRecipe, IPCClass, ThemeMode } from '../../types/aoi';

interface RecipeEditorProps {
  recipe: InspectionRecipe;
  onSaveRecipe: (updated: InspectionRecipe) => void;
  ipcClass: IPCClass;
  onChangeIPCClass: (newClass: IPCClass) => void;
  themeMode?: ThemeMode;
}

export const RecipeEditor: React.FC<RecipeEditorProps> = ({
  recipe,
  onSaveRecipe,
  ipcClass,
  onChangeIPCClass,
  themeMode = 'dark',
}) => {
  const [currentRecipe, setCurrentRecipe] = useState<InspectionRecipe>(recipe);
  const [isSaved, setIsSaved] = useState(false);
  const isDark = themeMode === 'dark';

  const handleLightingChange = (channel: keyof InspectionRecipe['lightingPreset'], val: number) => {
    setCurrentRecipe((prev) => ({
      ...prev,
      lightingPreset: {
        ...prev.lightingPreset,
        [channel]: val,
      },
    }));
    setIsSaved(false);
  };

  const handleAlgorithmChange = (key: keyof InspectionRecipe['algorithms'], val: number) => {
    setCurrentRecipe((prev) => ({
      ...prev,
      algorithms: {
        ...prev.algorithms,
        [key]: val,
      },
    }));
    setIsSaved(false);
  };

  const handleSave = () => {
    onSaveRecipe(currentRecipe);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleResetDefaults = () => {
    setCurrentRecipe(recipe);
    setIsSaved(false);
  };

  return (
    <div
      id="recipe-editor"
      className={`h-full overflow-y-auto p-6 space-y-6 transition-colors duration-200 ${
        isDark ? 'bg-[#0f172a] text-slate-200' : 'bg-slate-50 text-slate-800'
      }`}
    >
      {/* Header */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border transition-colors ${
          isDark
            ? 'bg-[#1e293b] border-slate-700'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div>
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-blue-500" />
            <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              3D AOI Inspection Recipe & Algorithm Tuning Studio
            </h2>
          </div>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Model: <strong className="text-blue-500">{currentRecipe.modelName}</strong> ({currentRecipe.version}) - Calibrate optical lighting channels, sensitivity thresholds, and IPC tolerances.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="reset-recipe-btn"
            onClick={handleResetDefaults}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs border transition-colors ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            id="save-recipe-btn"
            onClick={handleSave}
            className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold shadow-lg transition-all ${
              isSaved
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Applied & Deployed' : 'Save & Deploy Recipe'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Multi-Tier Lighting Control */}
        <div
          className={`p-5 rounded-xl border space-y-4 ${
            isDark
              ? 'bg-[#1e293b] border-slate-700'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <h3 className={`font-bold text-sm flex items-center ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Sun className="w-4 h-4 mr-1.5 text-amber-500" />
              Multi-Angle RGB & Coaxial Lighting
            </h3>
            <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>3D Structured Phase</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Top Coaxial White */}
            <div>
              <div className="flex justify-between mb-1">
                <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Top Coaxial White Light</span>
                <span className="font-mono text-blue-500 font-bold">{currentRecipe.lightingPreset.topCoaxial}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={currentRecipe.lightingPreset.topCoaxial}
                onChange={(e) => handleLightingChange('topCoaxial', Number(e.target.value))}
                className={`w-full accent-blue-600 h-1.5 rounded-lg appearance-none cursor-pointer ${
                  isDark ? 'bg-slate-900' : 'bg-slate-200'
                }`}
              />
              <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Direct specular reflection for IC leads & solder mirror finish
              </p>
            </div>

            {/* High-Angle Red */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-rose-500">High-Angle Red Illumination</span>
                <span className="font-mono text-rose-500 font-bold">{currentRecipe.lightingPreset.highRed}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={currentRecipe.lightingPreset.highRed}
                onChange={(e) => handleLightingChange('highRed', Number(e.target.value))}
                className={`w-full accent-rose-500 h-1.5 rounded-lg appearance-none cursor-pointer ${
                  isDark ? 'bg-slate-900' : 'bg-slate-200'
                }`}
              />
              <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Component body edges, IC laser markings & polarity dot
              </p>
            </div>

            {/* Mid-Angle Green */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-emerald-500">Mid-Angle Green Illumination</span>
                <span className="font-mono text-emerald-500 font-bold">{currentRecipe.lightingPreset.midGreen}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={currentRecipe.lightingPreset.midGreen}
                onChange={(e) => handleLightingChange('midGreen', Number(e.target.value))}
                className={`w-full accent-emerald-500 h-1.5 rounded-lg appearance-none cursor-pointer ${
                  isDark ? 'bg-slate-900' : 'bg-slate-200'
                }`}
              />
              <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Solder fillet wetting slope angle and meniscus curvature
              </p>
            </div>

            {/* Low-Angle Blue */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-blue-500">Low-Angle Blue Illumination</span>
                <span className="font-mono text-blue-500 font-bold">{currentRecipe.lightingPreset.lowBlue}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={currentRecipe.lightingPreset.lowBlue}
                onChange={(e) => handleLightingChange('lowBlue', Number(e.target.value))}
                className={`w-full accent-blue-500 h-1.5 rounded-lg appearance-none cursor-pointer ${
                  isDark ? 'bg-slate-900' : 'bg-slate-200'
                }`}
              />
              <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Flat PCB pads, copper traces & inter-pin solder bridge detection
              </p>
            </div>
          </div>
        </div>

        {/* Center Column: Algorithm Sensitivity Tuning */}
        <div
          className={`p-5 rounded-xl border space-y-4 ${
            isDark
              ? 'bg-[#1e293b] border-slate-700'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <h3 className={`font-bold text-sm flex items-center ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <SlidersHorizontal className="w-4 h-4 mr-1.5 text-blue-500" />
              Inspection Algorithm Thresholds
            </h3>
            <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Optics AI Engine</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Solder Bridge Threshold</span>
                <span className="font-mono text-blue-500 font-bold">{currentRecipe.algorithms.solderBridgeThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={currentRecipe.algorithms.solderBridgeThreshold}
                onChange={(e) => handleAlgorithmChange('solderBridgeThreshold', Number(e.target.value))}
                className={`w-full accent-blue-600 h-1.5 rounded-lg appearance-none cursor-pointer ${
                  isDark ? 'bg-slate-900' : 'bg-slate-200'
                }`}
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Missing Part Contrast Sensitivity</span>
                <span className="font-mono text-blue-500 font-bold">{currentRecipe.algorithms.missingPartContrast}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={currentRecipe.algorithms.missingPartContrast}
                onChange={(e) => handleAlgorithmChange('missingPartContrast', Number(e.target.value))}
                className={`w-full accent-blue-600 h-1.5 rounded-lg appearance-none cursor-pointer ${
                  isDark ? 'bg-slate-900' : 'bg-slate-200'
                }`}
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Tombstone Max Lift Angle</span>
                <span className="font-mono text-amber-500 font-bold">{currentRecipe.algorithms.tombstoneMaxAngleDeg}°</span>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                value={currentRecipe.algorithms.tombstoneMaxAngleDeg}
                onChange={(e) => handleAlgorithmChange('tombstoneMaxAngleDeg', Number(e.target.value))}
                className={`w-full accent-amber-500 h-1.5 rounded-lg appearance-none cursor-pointer ${
                  isDark ? 'bg-slate-900' : 'bg-slate-200'
                }`}
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Polarity OCV Stripe Confidence</span>
                <span className="font-mono text-blue-500 font-bold">{currentRecipe.algorithms.polarityMatchConfidence}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="99"
                value={currentRecipe.algorithms.polarityMatchConfidence}
                onChange={(e) => handleAlgorithmChange('polarityMatchConfidence', Number(e.target.value))}
                className={`w-full accent-blue-600 h-1.5 rounded-lg appearance-none cursor-pointer ${
                  isDark ? 'bg-slate-900' : 'bg-slate-200'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Dimensional Tolerance & IPC Standard */}
        <div
          className={`p-5 rounded-xl border space-y-4 ${
            isDark
              ? 'bg-[#1e293b] border-slate-700'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <h3 className={`font-bold text-sm flex items-center ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-500" />
              IPC-A-610 Class & 3D Tolerances
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className={`font-semibold block mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Target IPC Standard:
              </label>
              <select
                value={ipcClass}
                onChange={(e) => onChangeIPCClass(e.target.value as IPCClass)}
                className={`w-full rounded-lg p-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors ${
                  isDark
                    ? 'bg-slate-900 border border-slate-700 text-blue-400'
                    : 'bg-slate-100 border border-slate-200 text-blue-600'
                }`}
              >
                <option value="Class 3 (High Reliability / Automotive)">Class 3 (High Reliability / Automotive)</option>
                <option value="Class 2 (Dedicated Service)">Class 2 (Dedicated Service / Industrial)</option>
                <option value="Class 1 (General Electronic)">Class 1 (General Electronic / Consumer)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Max Component Shift (X/Y)</span>
                <span className="font-mono text-blue-500 font-bold">±{currentRecipe.algorithms.placementToleranceMm} mm</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.20"
                step="0.01"
                value={currentRecipe.algorithms.placementToleranceMm}
                onChange={(e) => handleAlgorithmChange('placementToleranceMm', Number(e.target.value))}
                className={`w-full accent-blue-600 h-1.5 rounded-lg appearance-none cursor-pointer ${
                  isDark ? 'bg-slate-900' : 'bg-slate-200'
                }`}
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>3D Solder Fillet Height Window</span>
                <span className="font-mono text-emerald-500 font-bold">
                  {currentRecipe.algorithms.solderHeightMinUm}um - {currentRecipe.algorithms.solderHeightMaxUm}um
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={currentRecipe.algorithms.solderHeightMinUm}
                  onChange={(e) => handleAlgorithmChange('solderHeightMinUm', Number(e.target.value))}
                  className={`border p-1.5 rounded text-xs font-mono ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-slate-200'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                  placeholder="Min um"
                />
                <input
                  type="number"
                  value={currentRecipe.algorithms.solderHeightMaxUm}
                  onChange={(e) => handleAlgorithmChange('solderHeightMaxUm', Number(e.target.value))}
                  className={`border p-1.5 rounded text-xs font-mono ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-slate-200'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                  placeholder="Max um"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Max IC Lead Coplanarity</span>
                <span className="font-mono text-rose-500 font-bold">{currentRecipe.algorithms.coplanarityMaxUm} um</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                value={currentRecipe.algorithms.coplanarityMaxUm}
                onChange={(e) => handleAlgorithmChange('coplanarityMaxUm', Number(e.target.value))}
                className={`w-full accent-rose-500 h-1.5 rounded-lg appearance-none cursor-pointer ${
                  isDark ? 'bg-slate-900' : 'bg-slate-200'
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
