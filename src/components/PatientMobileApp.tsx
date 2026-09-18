import React, { useState, useEffect } from 'react';
import { addMinutes, format, isAfter, isBefore, subMinutes } from 'date-fns';
import { Activity, Apple, CheckCircle2, Clock, Droplets, DropletOff, Pill, Plus, Scale, Utensils } from 'lucide-react';
import { MealPlan, WaterStatus } from '../types';
import { cn } from '../lib/utils';
import * as Dialog from '@radix-ui/react-dialog';

const INITIAL_MEALS: MealPlan[] = [
  { id: '1', mealIndex: 1, mealName: '早点', scheduledTime: '07:30', items: [{ name: '温米汤', weight: 50 }], status: 'PENDING' },
  { id: '2', mealIndex: 2, mealName: '早餐', scheduledTime: '09:30', items: [{ name: '烂面条', weight: 50 }, { name: '蒸蛋', weight: 30 }], status: 'PENDING' },
  { id: '3', mealIndex: 3, mealName: '加餐1', scheduledTime: '11:30', items: [{ name: '肠内营养液', weight: 100 }], status: 'PENDING' },
  { id: '4', mealIndex: 4, mealName: '午餐', scheduledTime: '13:30', items: [{ name: '肉末粥', weight: 80 }], status: 'PENDING' },
  { id: '5', mealIndex: 5, mealName: '加餐2', scheduledTime: '16:00', items: [{ name: '蛋白粉冲剂', weight: 100 }], status: 'PENDING' },
  { id: '6', mealIndex: 6, mealName: '晚餐', scheduledTime: '18:30', items: [{ name: '鱼汤面', weight: 80 }], status: 'PENDING' },
  { id: '7', mealIndex: 7, mealName: '夜宵', scheduledTime: '20:30', items: [{ name: '温牛奶', weight: 100 }], status: 'PENDING' },
];

export default function PatientMobileApp() {
  // Simulate current time starting at 07:15
  const [currentTime, setCurrentTime] = useState(new Date(new Date().setHours(7, 15, 0, 0)));
  const [meals, setMeals] = useState<MealPlan[]>(INITIAL_MEALS);
  const [waterStatus, setWaterStatus] = useState<WaterStatus>('CAN_DRINK');
  const [countdownMinutes, setCountdownMinutes] = useState(0);
  const [showDumpingModal, setShowDumpingModal] = useState(false);

  // Fast forward time for prototyping
  const advanceTime = (mins: number) => {
    setCurrentTime(prev => addMinutes(prev, mins));
  };

  const getNextMeal = () => meals.find(m => m.status === 'PENDING');

  // Core Logic: Water & Meal State Machine
  useEffect(() => {
    let currentStatus: WaterStatus = 'CAN_DRINK';
    let minCountdown = 0;

    const lastCompletedMeal = [...meals].reverse().find(m => m.status === 'COMPLETED');
    const nextMeal = getNextMeal();

    // Check if in 45-min POST-meal window
    if (lastCompletedMeal && lastCompletedMeal.completedAt) {
      const mealEndTime = lastCompletedMeal.completedAt;
      const fortyFiveMinsLater = addMinutes(mealEndTime, 45);
      
      if (isBefore(currentTime, fortyFiveMinsLater)) {
        currentStatus = 'NO_WATER_POST_MEAL';
        minCountdown = Math.ceil((fortyFiveMinsLater.getTime() - currentTime.getTime()) / 60000);
        
        // Trigger Dumping Syndrome Check at exactly 30 mins post meal
        const thirtyMinsLater = addMinutes(mealEndTime, 30);
        if (
          isAfter(currentTime, thirtyMinsLater) && 
          isBefore(currentTime, addMinutes(thirtyMinsLater, 2)) // Small window to trigger in proto
        ) {
          setShowDumpingModal(true);
        }
      }
    }

    // Check if in 30-min PRE-meal window
    if (currentStatus === 'CAN_DRINK' && nextMeal) {
      const [hours, minutes] = nextMeal.scheduledTime.split(':').map(Number);
      const scheduledTime = new Date(currentTime);
      scheduledTime.setHours(hours, minutes, 0, 0);
      
      const thirtyMinsBefore = subMinutes(scheduledTime, 30);
      
      if (isAfter(currentTime, thirtyMinsBefore) && isBefore(currentTime, scheduledTime)) {
        currentStatus = 'NO_WATER_PRE_MEAL';
        minCountdown = Math.ceil((scheduledTime.getTime() - currentTime.getTime()) / 60000);
      }
    }

    setWaterStatus(currentStatus);
    setCountdownMinutes(minCountdown > 0 ? minCountdown : 0);
  }, [currentTime, meals]);

  const handleCompleteMeal = (id: string) => {
    const mealIdx = meals.findIndex(m => m.id === id);
    if (mealIdx === -1) return;

    const completedMeal = meals[mealIdx];
    const newMeals = [...meals];
    
    // Mark completed
    newMeals[mealIdx] = {
      ...completedMeal,
      status: 'COMPLETED',
      completedAt: currentTime
    };

    // Delay subsequent meals if this meal was delayed
    const [schedH, schedM] = completedMeal.scheduledTime.split(':').map(Number);
    const scheduledTime = new Date(currentTime);
    scheduledTime.setHours(schedH, schedM, 0, 0);

    if (isAfter(currentTime, scheduledTime)) {
      const delayMs = currentTime.getTime() - scheduledTime.getTime();
      const delayMins = Math.floor(delayMs / 60000);
      
      for (let i = mealIdx + 1; i < newMeals.length; i++) {
        const [h, m] = newMeals[i].scheduledTime.split(':').map(Number);
        const oldTime = new Date(currentTime);
        oldTime.setHours(h, m, 0, 0);
        const newTime = addMinutes(oldTime, delayMins);
        newMeals[i].scheduledTime = format(newTime, 'HH:mm');
      }
    }

    setMeals(newMeals);
  };

  return (
    <div className="w-full max-w-md mx-auto h-[850px] max-h-screen bg-gray-50 flex flex-col relative overflow-hidden shadow-2xl sm:rounded-[2rem] sm:border-8 border-gray-900">
      {/* Status Bar Mock */}
      <div className="bg-white pt-4 pb-2 px-6 flex justify-between items-center text-sm font-medium border-b border-gray-100 z-10">
        <span className="text-gray-900">{format(currentTime, 'HH:mm')}</span>
        <div className="flex space-x-2">
          <Activity className="w-4 h-4 text-emerald-500" />
        </div>
      </div>

      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm z-10">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-xl font-bold text-gray-900">张建国</h1>
            <p className="text-sm text-gray-500">术后第 14 天 · 半流质阶段</p>
          </div>
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" className="w-12 h-12 rounded-full bg-blue-50" />
        </div>
      </div>

      {/* Core Dynamic Water Banner */}
      <div className={cn(
        "px-6 py-4 transition-colors duration-500 flex items-center justify-between z-10",
        waterStatus === 'CAN_DRINK' ? "bg-blue-50 text-blue-800" : "bg-rose-50 text-rose-800"
      )}>
        <div className="flex items-center space-x-3">
          {waterStatus === 'CAN_DRINK' ? (
             <Droplets className="w-6 h-6 text-blue-500" />
          ) : (
            <DropletOff className="w-6 h-6 text-rose-500" />
          )}
          <div>
            <h2 className="font-semibold text-lg">
              {waterStatus === 'CAN_DRINK' ? '适量饮水期' : '严禁饮水期'}
            </h2>
            <p className="text-sm opacity-90">
              {waterStatus === 'NO_WATER_PRE_MEAL' && `餐前30分钟禁止饮水`}
              {waterStatus === 'NO_WATER_POST_MEAL' && `餐后45分钟禁止饮水`}
              {waterStatus === 'CAN_DRINK' && '请小口慢饮，每次不超过50ml'}
            </p>
          </div>
        </div>
        {waterStatus !== 'CAN_DRINK' && countdownMinutes > 0 && (
          <div className="flex flex-col items-center justify-center bg-white/50 px-3 py-1 rounded-lg">
            <span className="text-2xl font-bold font-mono tabular-nums leading-none">{countdownMinutes}</span>
            <span className="text-xs font-medium">分钟</span>
          </div>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-32">
        <h3 className="text-sm font-bold text-gray-400 tracking-wider mb-4">今日日程流 (6-8餐)</h3>
        
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
          {meals.map((meal, index) => {
            const isCompleted = meal.status === 'COMPLETED';
            const isNext = meals.findIndex(m => m.status === 'PENDING') === index;

            return (
              <div key={meal.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                {/* Timeline dot */}
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-4 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10",
                  isCompleted ? "bg-emerald-500 border-emerald-100 text-white" : 
                  isNext ? "bg-blue-500 border-blue-100 text-white" : "bg-white border-gray-200 text-gray-400"
                )}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Utensils className="w-4 h-4" />}
                </div>
                
                {/* Card */}
                <div className={cn(
                  "w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all",
                  isCompleted ? "bg-white/60 opacity-60" : "bg-white",
                  isNext && "ring-2 ring-blue-500 shadow-md scale-[1.02]"
                )}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={cn("text-xs font-bold px-2 py-1 rounded-full", 
                      isCompleted ? "bg-gray-100 text-gray-500" : "bg-blue-50 text-blue-700"
                    )}>
                      {meal.mealName}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm font-mono">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      {meal.scheduledTime}
                    </div>
                  </div>
                  
                  <div className="space-y-1 mb-3">
                    {meal.items.map((item, i) => (
                      <div key={i} className="text-sm text-gray-600 flex justify-between">
                        <span>{item.name}</span>
                        <span className="text-gray-400">{item.weight}g</span>
                      </div>
                    ))}
                  </div>

                  {isNext && (
                    <button 
                      onClick={() => handleCompleteMeal(meal.id)}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors active:scale-95"
                    >
                      完成进餐打卡
                    </button>
                  )}
                  {isCompleted && meal.completedAt && (
                    <p className="text-xs text-emerald-600 text-right">
                      打卡于 {format(meal.completedAt, 'HH:mm')}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-20">
        <button className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 border border-gray-100">
          <Scale className="w-5 h-5" />
        </button>
        <button className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-indigo-600 hover:bg-gray-50 border border-gray-100">
          <Pill className="w-5 h-5" />
        </button>
        <button className="w-14 h-14 bg-emerald-500 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-emerald-600 transition-transform active:scale-95">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Developer Tools for Prototyping */}
      <div className="absolute top-16 right-4 flex flex-col gap-2 z-50">
        <button onClick={() => advanceTime(15)} className="bg-gray-900/80 text-white text-xs px-3 py-1.5 rounded-md shadow flex items-center backdrop-blur-sm">
          时间快进+15m
        </button>
      </div>

      {/* Dumping Syndrome Modal */}
      <Dialog.Root open={showDumpingModal} onOpenChange={setShowDumpingModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-sm translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-3xl">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-2">
                <Activity className="w-6 h-6" />
              </div>
              <Dialog.Title className="text-xl font-bold text-gray-900">倾倒综合征排查</Dialog.Title>
              <Dialog.Description className="text-gray-500 text-sm">
                距离您餐后已过30分钟，为了您的健康，请问您目前是否有以下不适感？
              </Dialog.Description>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-4">
              {['心慌', '出汗', '腹胀', '头晕'].map(s => (
                <button key={s} className="px-4 py-3 border-2 border-gray-100 rounded-xl text-gray-600 font-medium hover:border-amber-400 hover:bg-amber-50 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all">
                  {s}
                </button>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button 
                onClick={() => setShowDumpingModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                没有任何不适
              </button>
              <button 
                onClick={() => setShowDumpingModal(false)}
                className="flex-1 px-4 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors shadow-md shadow-amber-500/20"
              >
                提交记录
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </div>
  );
}
