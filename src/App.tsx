/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import PatientMobileApp from './components/PatientMobileApp';
import DoctorAdminPortal from './components/DoctorAdminPortal';
import { Smartphone, Monitor } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'PATIENT' | 'DOCTOR'>('PATIENT');

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* View Switcher Header (For Prototype Navigation Only) */}
      <div className="bg-white p-4 shadow-sm flex items-center justify-center space-x-4 shrink-0 z-50 sticky top-0 border-b border-gray-200">
        <span className="text-gray-500 font-medium mr-4">选择预览视角:</span>
        <button
          onClick={() => setView('PATIENT')}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
            view === 'PATIENT' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Smartphone className="w-4 h-4 mr-2" />
          患者移动端 (App原型)
        </button>
        <button
          onClick={() => setView('DOCTOR')}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
            view === 'DOCTOR' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Monitor className="w-4 h-4 mr-2" />
          医生管理后台 (Web原型)
        </button>
      </div>

      {/* Render the selected view */}
      <div className="flex-1 overflow-auto relative">
        {view === 'PATIENT' ? (
          <div className="h-full flex items-center justify-center p-4 py-8">
            <PatientMobileApp />
          </div>
        ) : (
          <DoctorAdminPortal />
        )}
      </div>
    </div>
  );
}
