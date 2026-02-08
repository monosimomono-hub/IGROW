import React, { useState } from 'react';
import { ActivityType, Product, Activity, ProductUsage } from '../types';
import { X, Droplets, Scissors, ArrowUp, Zap, Beaker, AlertTriangle } from 'lucide-react';

interface ActivityFormProps {
  plantId: string;
  products: Product[];
  onSubmit: (activity: Activity) => void;
  onClose: () => void;
  initialType?: ActivityType;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ plantId, products, onSubmit, onClose, initialType }) => {
  const [type, setType] = useState<ActivityType>(initialType || ActivityType.WATERING);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [waterLiters, setWaterLiters] = useState<string>('');
  const [drainLiters, setDrainLiters] = useState<string>('');
  const [ecIn, setEcIn] = useState<string>('');
  const [ecOut, setEcOut] = useState<string>('');
  const [phIn, setPhIn] = useState<string>('');
  const [phOut, setPhOut] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [usedProducts, setUsedProducts] = useState<ProductUsage[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const activity: Activity = {
      id: Math.random().toString(36).substr(2, 9),
      plantId,
      type,
      date: new Date(date).toISOString(),
      waterLiters: waterLiters ? parseFloat(waterLiters) : undefined,
      drainLiters: drainLiters ? parseFloat(drainLiters) : undefined,
      ecIn: ecIn ? parseFloat(ecIn) : undefined,
      ecOut: ecOut ? parseFloat(ecOut) : undefined,
      phIn: phIn ? parseFloat(phIn) : undefined,
      phOut: phOut ? parseFloat(phOut) : undefined,
      notes,
      products: usedProducts
    };
    onSubmit(activity);
  };

  const handleProductToggle = (productId: string) => {
    setUsedProducts(prev => {
      const exists = prev.find(p => p.productId === productId);
      if (exists) return prev.filter(p => p.productId !== productId);
      return [...prev, { productId, mlPerLiter: 1 }];
    });
  };

  const updateProductMl = (productId: string, ml: number) => {
    setUsedProducts(prev => prev.map(p => p.productId === productId ? { ...p, mlPerLiter: ml } : p));
  };

  const ecDifference = (ecIn && ecOut) ? parseFloat(ecOut) - parseFloat(ecIn) : 0;
  const showEcAlert = ecDifference > 1.0;

  return (
    <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center">
      <div className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-stone-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-stone-800">Nuova Attività</h2>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-3 gap-2">
            {[ActivityType.WATERING, ActivityType.FERTILIZATION, ActivityType.DEFOLIATION, ActivityType.TOPPING, ActivityType.LST, ActivityType.OTHER].map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex flex-col items-center gap-1 p-3 rounded-2xl border transition-all ${
                  type === t 
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700' 
                  : 'border-stone-100 text-stone-500'
                }`}
              >
                {t === ActivityType.WATERING && <Droplets size={20} />}
                {t === ActivityType.DEFOLIATION && <Scissors size={20} />}
                {t === ActivityType.TOPPING && <ArrowUp size={20} />}
                {t === ActivityType.LST && <Zap size={20} />}
                {t === ActivityType.FERTILIZATION && <Beaker size={20} />}
                <span className="text-[10px] font-bold uppercase">{t}</span>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-stone-500 uppercase px-1">Data e Ora</label>
              <input 
                type="datetime-local" 
                value={date} 
                onChange={e => setDate(e.target.value)}
                className="w-full p-4 bg-stone-100 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            {(type === ActivityType.WATERING || type === ActivityType.FERTILIZATION) && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-stone-500 uppercase px-1">Litri In</label>
                    <input 
                      type="number" step="0.1" value={waterLiters} 
                      onChange={e => setWaterLiters(e.target.value)}
                      placeholder="es. 2.5"
                      className="w-full p-4 bg-stone-100 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-stone-500 uppercase px-1">Litri Out</label>
                    <input 
                      type="number" step="0.1" value={drainLiters} 
                      onChange={e => setDrainLiters(e.target.value)}
                      placeholder="es. 0.5"
                      className="w-full p-4 bg-stone-100 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-stone-500 uppercase px-1">EC Ingresso (mS/cm)</label>
                    <input 
                      type="number" step="0.01" value={ecIn} 
                      onChange={e => setEcIn(e.target.value)}
                      placeholder="es. 1.2"
                      className="w-full p-4 bg-stone-100 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-stone-500 uppercase px-1">EC Uscita (mS/cm)</label>
                    <input 
                      type="number" step="0.01" value={ecOut} 
                      onChange={e => setEcOut(e.target.value)}
                      placeholder="es. 1.8"
                      className="w-full p-4 bg-stone-100 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {showEcAlert && (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-3 text-amber-800">
                    <AlertTriangle className="shrink-0" size={20} />
                    <p className="text-sm font-medium">
                      ⚠️ Attenzione: possibile accumulo di sali. Differenza EC superiore a 1.0 ({ecDifference.toFixed(2)})
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-stone-500 uppercase px-1">pH Ingresso</label>
                    <input 
                      type="number" step="0.1" value={phIn} 
                      onChange={e => setPhIn(e.target.value)}
                      placeholder="es. 6.2"
                      className="w-full p-4 bg-stone-100 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-stone-500 uppercase px-1">pH Uscita</label>
                    <input 
                      type="number" step="0.1" value={phOut} 
                      onChange={e => setPhOut(e.target.value)}
                      placeholder="es. 6.5"
                      className="w-full p-4 bg-stone-100 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </>
            )}

            {type === ActivityType.FERTILIZATION && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-stone-500 uppercase px-1">Seleziona Prodotti</label>
                <div className="flex flex-wrap gap-2">
                  {products.map(p => {
                    const usage = usedProducts.find(u => u.productId === p.id);
                    return (
                      <div key={p.id} className="w-full flex items-center gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-100">
                        <input 
                          type="checkbox" 
                          checked={!!usage} 
                          onChange={() => handleProductToggle(p.id)}
                          className="w-5 h-5 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-stone-800">{p.name}</p>
                          <p className="text-[10px] text-stone-500 uppercase">{p.brand} | {p.npk}</p>
                        </div>
                        {usage && (
                          <div className="flex items-center gap-2">
                            <input 
                              type="number" 
                              value={usage.mlPerLiter} 
                              onChange={e => updateProductMl(p.id, parseFloat(e.target.value))}
                              className="w-16 p-2 bg-white border border-stone-200 rounded-lg text-sm text-center"
                            />
                            <span className="text-xs font-bold text-stone-400">ml/L</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-stone-500 uppercase px-1">Note (opzionale)</label>
              <textarea 
                value={notes} 
                onChange={e => setNotes(e.target.value)}
                placeholder="Aggiungi osservazioni..."
                className="w-full p-4 bg-stone-100 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 h-24 resize-none"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-bold shadow-lg shadow-emerald-100 active:scale-[0.98] transition-all"
          >
            Salva Attività
          </button>
        </form>
      </div>
    </div>
  );
};
export default ActivityForm;