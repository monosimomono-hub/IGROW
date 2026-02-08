import React, { useState } from 'react';
import { Plant, Activity, ActivityType, Product, GrowthPhase } from '../types';
import { 
  ChevronLeft, 
  Droplets, 
  Scissors, 
  ArrowUp, 
  Zap, 
  Calendar, 
  Trash2,
  TrendingUp,
  Image as ImageIcon,
  MoreVertical,
  Plus
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import ActivityForm from '../components/ActivityForm';

interface PlantDetailProps {
  plant: Plant;
  activities: Activity[];
  products: Product[];
  onBack: () => void;
  onDelete: (id: string) => void;
  onAddActivity: (activity: Activity) => void;
  onDeleteActivity: (id: string) => void;
  onUpdatePhase: (plant: Plant, phase: GrowthPhase) => void;
}

const PlantDetail: React.FC<PlantDetailProps> = ({ 
  plant, 
  activities, 
  products, 
  onBack, 
  onDelete, 
  onAddActivity, 
  onDeleteActivity,
  onUpdatePhase
}) => {
  const [showForm, setShowForm] = useState(false);
  const [activeFormType, setActiveFormType] = useState<ActivityType>(ActivityType.WATERING);
  const [view, setView] = useState<'timeline' | 'stats' | 'gallery'>('timeline');

  const plantActivities = activities.filter(a => a.plantId === plant.id);
  
  const daysSinceStart = Math.floor(
    (Date.now() - new Date(plant.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  const chartData = [...plantActivities]
    .filter(a => a.ecIn !== undefined || a.phIn !== undefined)
    .reverse()
    .map(a => ({
      date: new Date(a.date).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' }),
      ecIn: a.ecIn,
      ecOut: a.ecOut,
      phIn: a.phIn,
      phOut: a.phOut,
    }));

  const openForm = (type: ActivityType) => {
    setActiveFormType(type);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <div className="sticky top-0 bg-stone-50/80 backdrop-blur-lg z-30 px-4 py-4 flex items-center justify-between">
        <button onClick={onBack} className="p-2 bg-white rounded-2xl shadow-sm border border-stone-100">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-bold text-stone-800">Dettaglio Pianta</h2>
        <button 
          onClick={() => { if(confirm('Eliminare questa pianta?')) onDelete(plant.id); }} 
          className="p-2 bg-red-50 text-red-600 rounded-2xl border border-red-100"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="px-6 space-y-8">
        <div className="flex items-center gap-6 mt-4">
          <img src={plant.photoUrl} className="w-24 h-24 rounded-[32px] object-cover shadow-md" alt={plant.name} />
          <div className="flex-1 space-y-1">
            <h1 className="text-2xl font-black text-stone-900 leading-none">{plant.name}</h1>
            <p className="text-sm text-stone-500">{plant.strain}</p>
            <div className="flex gap-2 mt-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-full">
                {plant.currentPhase}
              </span>
              <span className="px-3 py-1 bg-stone-200 text-stone-600 text-[10px] font-black uppercase rounded-full">
                Giorno {daysSinceStart}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-[32px] shadow-sm border border-stone-100">
          <label className="text-[10px] font-bold text-stone-400 uppercase mb-3 block px-1">Aggiorna Fase di Crescita</label>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {Object.values(GrowthPhase).map(phase => (
              <button
                key={phase}
                onClick={() => onUpdatePhase(plant, phase)}
                className={`shrink-0 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                  plant.currentPhase === phase 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100' 
                  : 'bg-stone-50 text-stone-500'
                }`}
              >
                {phase}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <ActionButton icon={<Droplets size={22}/>} label="Acqua" onClick={() => openForm(ActivityType.WATERING)} color="blue" />
          <ActionButton icon={<Scissors size={22}/>} label="Defog" onClick={() => openForm(ActivityType.DEFOLIATION)} color="green" />
          <ActionButton icon={<ArrowUp size={22}/>} label="Topp" onClick={() => openForm(ActivityType.TOPPING)} color="orange" />
          <ActionButton icon={<Zap size={22}/>} label="LST" onClick={() => openForm(ActivityType.LST)} color="purple" />
        </div>

        <div className="flex bg-stone-100 p-1 rounded-2xl">
          <TabButton active={view === 'timeline'} onClick={() => setView('timeline')} icon={<Calendar size={18}/>} label="Timeline" />
          <TabButton active={view === 'stats'} onClick={() => setView('stats')} icon={<TrendingUp size={18}/>} label="Stats" />
          <TabButton active={view === 'gallery'} onClick={() => setView('gallery')} icon={<ImageIcon size={18}/>} label="Gallery" />
        </div>

        {view === 'timeline' && (
          <div className="space-y-4">
            {plantActivities.length === 0 ? (
              <div className="text-center py-12 text-stone-400">
                <p>Nessuna attività registrata.</p>
              </div>
            ) : (
              plantActivities.map(activity => (
                <div key={activity.id} className="relative pl-8 border-l-2 border-emerald-100 py-1">
                  <div className="absolute left-[-9px] top-4 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-white shadow-sm"></div>
                  <div className="bg-white p-5 rounded-[28px] shadow-sm border border-stone-50 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-stone-800">{activity.type}</h4>
                        <p className="text-[10px] text-stone-400 font-bold uppercase">
                          {new Date(activity.date).toLocaleString('it-IT', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <button 
                        onClick={() => onDeleteActivity(activity.id)}
                        className="p-1.5 text-stone-300 hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {(activity.waterLiters || activity.ecIn) && (
                      <div className="grid grid-cols-3 gap-2 py-2 border-y border-stone-50">
                        {activity.waterLiters && <StatMini label="H2O" value={`${activity.waterLiters}L`} />}
                        {activity.ecIn && <StatMini label="EC In" value={activity.ecIn} color="text-amber-600" />}
                        {activity.ecOut && <StatMini label="EC Out" value={activity.ecOut} color="text-amber-800" />}
                        {activity.phIn && <StatMini label="pH In" value={activity.phIn} color="text-emerald-600" />}
                        {activity.phOut && <StatMini label="pH Out" value={activity.phOut} color="text-emerald-800" />}
                      </div>
                    )}

                    {activity.products.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {activity.products.map(usage => {
                          const p = products.find(prod => prod.id === usage.productId);
                          return (
                            <span key={usage.productId} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-100">
                              {p?.name} ({usage.mlPerLiter}ml/L)
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {activity.notes && (
                      <p className="text-sm text-stone-600 italic">"{activity.notes}"</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {view === 'stats' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-stone-100">
              <h3 className="text-sm font-bold text-stone-800 mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-600" /> Monitoraggio EC (mS/cm)
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                    <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                    <Line type="monotone" dataKey="ecIn" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="EC Ingresso" />
                    <Line type="monotone" dataKey="ecOut" stroke="#065f46" strokeWidth={3} dot={{ r: 4 }} name="EC Uscita" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

             <div className="bg-white p-6 rounded-[32px] shadow-sm border border-stone-100">
              <h3 className="text-sm font-bold text-stone-800 mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-600" /> Monitoraggio pH
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                    <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis fontSize={10} axisLine={false} tickLine={false} domain={[5, 8]} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                    <Line type="monotone" dataKey="phIn" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} name="pH Ingresso" />
                    <Line type="monotone" dataKey="phOut" stroke="#1e3a8a" strokeWidth={3} dot={{ r: 4 }} name="pH Uscita" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {view === 'gallery' && (
          <div className="grid grid-cols-2 gap-3">
             <div className="aspect-square rounded-3xl overflow-hidden shadow-sm">
                <img src={plant.photoUrl} className="w-full h-full object-cover" alt="Main" />
             </div>
             {plantActivities.filter(a => a.type === ActivityType.DEFOLIATION || a.type === ActivityType.TOPPING).map(a => (
                <div key={a.id} className="aspect-square rounded-3xl overflow-hidden bg-stone-200 flex items-center justify-center relative">
                   <ImageIcon className="text-stone-400" size={32} />
                   <span className="absolute bottom-2 left-2 right-2 text-[8px] font-black uppercase text-stone-500 text-center">
                     Attività {a.type}
                   </span>
                </div>
             ))}
             <button className="aspect-square rounded-3xl border-2 border-dashed border-stone-200 flex flex-col items-center justify-center text-stone-400 gap-2 active:bg-stone-50">
                <Plus size={24} />
                <span className="text-[10px] font-bold">AGGIUNGI FOTO</span>
             </button>
          </div>
        )}
      </div>

      {showForm && (
        <ActivityForm 
          plantId={plant.id} 
          products={products} 
          initialType={activeFormType}
          onSubmit={(a) => { onAddActivity(a); setShowForm(false); }} 
          onClose={() => setShowForm(false)} 
        />
      )}
    </div>
  );
};

const ActionButton = ({ icon, label, onClick, color }: any) => {
  const colors: any = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
  };
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-3xl border transition-all active:scale-90 ${colors[color]}`}
    >
      {icon}
      <span className="text-[9px] font-black uppercase tracking-wider">{label}</span>
    </button>
  );
}

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl transition-all ${
      active ? 'bg-white text-emerald-600 shadow-sm font-bold' : 'text-stone-400 font-medium'
    }`}
  >
    {icon}
    <span className="text-xs">{label}</span>
  </button>
);

const StatMini = ({ label, value, color = "text-stone-700" }: any) => (
  <div className="flex flex-col">
    <span className="text-[8px] font-black text-stone-400 uppercase leading-none">{label}</span>
    <span className={`text-xs font-bold ${color}`}>{value}</span>
  </div>
);

export default PlantDetail;