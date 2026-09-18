import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Activity, Bell, Calendar, ChevronDown, ClipboardList, LayoutDashboard, Search, Settings, UserCircle, Users, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

const PATIENTS = [
  { id: '1', name: '张建国', age: 65, surgeryDays: 14, phase: '半流质', status: 'normal' },
  { id: '2', name: '李阿姨', age: 58, surgeryDays: 28, phase: '软食', status: 'alert' },
  { id: '3', name: '王大爷', age: 72, surgeryDays: 7, phase: '流质', status: 'normal' },
];

const WEIGHT_DATA = [
  { day: 'Day 7', weight: 65.0 },
  { day: 'Day 8', weight: 64.8 },
  { day: 'Day 9', weight: 64.5 },
  { day: 'Day 10', weight: 64.0 },
  { day: 'Day 11', weight: 63.8 },
  { day: 'Day 12', weight: 63.2 },
  { day: 'Day 13', weight: 62.9 },
  { day: 'Day 14', weight: 62.5 }, // >3% drop alert
];

const DIET_PLAN_MOCK = [
  { time: '07:30', name: '早点', items: '温米汤 50g' },
  { time: '09:30', name: '早餐', items: '烂面条 50g, 蒸蛋 30g' },
  { time: '11:30', name: '加餐1', items: '肠内营养液 100g' },
  { time: '13:30', name: '午餐', items: '肉末粥 80g' },
  { time: '16:00', name: '加餐2', items: '蛋白粉冲剂 100g' },
  { time: '18:30', name: '晚餐', items: '鱼汤面 80g' },
];

export default function DoctorAdminPortal() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Activity className="w-6 h-6 text-emerald-400 mr-2" />
          <span className="text-white font-bold text-lg">康复管理中枢</span>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-1">
          <a href="#" className="flex items-center px-3 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <Users className="w-5 h-5 mr-3" />
            患者看板
          </a>
          <a href="#" className="flex items-center px-3 py-2 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <ClipboardList className="w-5 h-5 mr-3" />
            食谱库
          </a>
          <a href="#" className="flex items-center px-3 py-2 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <LayoutDashboard className="w-5 h-5 mr-3" />
            异常预警
          </a>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center">
            <UserCircle className="w-8 h-8 text-slate-400 mr-2" />
            <div>
              <p className="text-white text-sm font-medium">王医生</p>
              <p className="text-xs text-slate-500">主治医师</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center text-gray-800 text-lg font-semibold">
            患者详情 / 张建国
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="搜索患者..." 
                className="pl-9 pr-4 py-2 bg-gray-100 border-transparent rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none w-64 transition-all"
              />
            </div>
            <button className="relative p-2 text-gray-400 hover:text-gray-600">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Content Scrollable */}
        <div className="flex-1 overflow-auto p-8">
          
          {/* Patient Overview */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xl font-bold">
                张
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">张建国 <span className="text-sm font-normal text-gray-500 ml-2">男 · 65岁</span></h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> 术后第 14 天</span>
                  <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 rounded-full font-medium">半流质阶段</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">历史日志</button>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">下发新方案</button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Col: Vitals & Alerts */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Weight Trend */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-900 text-lg">体重监测趋势 (近7天)</h3>
                  <div className="bg-rose-50 text-rose-700 px-3 py-1 rounded-md text-sm font-medium animate-pulse">
                    ⚠️ 降幅 {'>'} 3% 预警
                  </div>
                </div>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={WEIGHT_DATA} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                      <YAxis domain={['dataMin - 1', 'dataMax + 1']} axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <ReferenceLine y={63.05} label={{ position: 'insideTopLeft', value: '3% 降幅警戒线', fill: '#ef4444', fontSize: 12 }} stroke="#ef4444" strokeDasharray="3 3" />
                      <Line 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="#059669" 
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                        activeDot={{ r: 6, fill: '#059669' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Symptom Log */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 text-lg mb-4">异常症状溯源</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-sm text-gray-500">
                        <th className="py-3 font-medium">时间</th>
                        <th className="py-3 font-medium">症状</th>
                        <th className="py-3 font-medium">严重程度</th>
                        <th className="py-3 font-medium">关联餐次溯源</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-gray-800">
                      <tr className="border-b border-gray-50 group hover:bg-gray-50 transition-colors">
                        <td className="py-3">今天 14:15</td>
                        <td className="py-3"><span className="text-rose-600 font-medium">腹胀, 心慌</span></td>
                        <td className="py-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="text-blue-600 cursor-pointer hover:underline">午餐 (肉末粥 80g) @ 13:30</span>
                        </td>
                      </tr>
                      <tr className="group hover:bg-gray-50 transition-colors">
                        <td className="py-3">昨天 19:10</td>
                        <td className="py-3"><span className="text-amber-600 font-medium">腹胀</span></td>
                        <td className="py-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="text-blue-600 cursor-pointer hover:underline">晚餐 (鱼汤面 80g) @ 18:30</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Right Col: Diet Configurator */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-900 text-lg">动态食谱配置器</h3>
                  <button className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-lg transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex-1 space-y-3 overflow-y-auto pr-2">
                  {DIET_PLAN_MOCK.map((meal, idx) => (
                    <div key={idx} className="p-3 border border-gray-100 rounded-xl hover:border-emerald-200 hover:shadow-sm transition-all group">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center text-sm font-bold text-gray-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>
                          {meal.name}
                        </div>
                        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{meal.time}</span>
                      </div>
                      <input 
                        type="text" 
                        defaultValue={meal.items}
                        className="w-full text-sm text-gray-600 bg-transparent border-b border-transparent focus:border-emerald-300 focus:outline-none focus:bg-emerald-50/30 px-1 py-1 rounded transition-colors"
                      />
                    </div>
                  ))}
                  
                  <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-emerald-300 hover:text-emerald-600 transition-colors text-sm font-medium flex items-center justify-center">
                    <Plus className="w-4 h-4 mr-1" />
                    添加餐次
                  </button>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm text-gray-500 mb-3">
                    <span>目标热量: 1200 kcal</span>
                    <span>蛋白质: 45g</span>
                  </div>
                  <button className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-colors">
                    保存并推送至患者端
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
