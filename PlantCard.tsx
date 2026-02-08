import React from 'react';
import { Plant } from '../types';
import { Sprout, Clock } from 'lucide-react';

interface PlantCardProps {
  plant: Plant;
  onClick: (plant: Plant) => void;
}

const PlantCard: React.FC<PlantCardProps> = ({ plant, onClick }) => {
  const daysSinceStart = Math.floor(
    (Date.now() - new Date(plant.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div 
      onClick={() => onClick(plant)}
      className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100 flex flex-col active:scale-[0.98] transition-all cursor-pointer"
    >
      <div className="h-48 w-full relative">
        <img 
          src={plant.photoUrl} 
          alt={plant.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
          <Sprout size={14} className="text-emerald-600" />
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
            {plant.currentPhase}
          </span>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-1">
        <h3 className="text-lg font-bold text-stone-800 leading-tight">{plant.name}</h3>
        <p className="text-sm text-stone-500 italic">{plant.strain}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-stone-400">
            <Clock size={14} />
            <span className="text-xs font-medium">Giorno {daysSinceStart}</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};
export default PlantCard;