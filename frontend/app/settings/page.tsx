"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { Settings, Sliders, Shield, Save, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [headless, setHeadless] = useState(true);
  const [confidence, setConfidence] = useState("0.85");
  const [autoHeal, setAutoHeal] = useState(true);
  const [notifySlack, setNotifySlack] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <AppShell>
      {() => (
        <div className="space-y-6 max-w-4xl">
          {/* Header */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600">
              <Settings className="w-4 h-4" />
              <span>Platform Configuration</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              OmniSight Agent Settings
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tune vision AI parameters, Playwright runner execution policies, and notification hooks.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-6">
            {/* Vision AI Engine Settings */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Sliders className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Vision AI & Self-Healing Engine</h3>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">Enable Autonomous Self-Healing</p>
                    <p className="text-slate-500">Automatically attempt vector & SSIM DOM repairing when selectors fail.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoHeal}
                    onChange={(e) => setAutoHeal(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-900 mb-1">
                    Vision Confidence Threshold ({confidence})
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="0.99"
                    step="0.01"
                    value={confidence}
                    onChange={(e) => setConfidence(e.target.value)}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>0.50 (Permissive)</span>
                    <span>0.85 (Recommended)</span>
                    <span>0.99 (Strict)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Playwright Runner Settings */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Shield className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Playwright Automation Runner</h3>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">Headless Browser Mode</p>
                    <p className="text-slate-500">Run Playwright chromium instance in headless mode for maximum speed.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={headless}
                    onChange={(e) => setHeadless(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-slate-300"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">Slack & Email Notifications</p>
                    <p className="text-slate-500">Send instant alerts on visual regression failures.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifySlack}
                    onChange={(e) => setNotifySlack(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-slate-300"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              {savedSuccess ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  Settings saved successfully!
                </span>
              ) : (
                <span className="text-xs text-slate-400">Week 1 Day 1 Mock Settings State</span>
              )}

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </AppShell>
  );
}
