import React from 'react';
import { Plant } from '../types';
import PlantCard from '../components/PlantCard';
import { Leaf } from 'lucide-react';

interface HomeViewProps {
  plants: Plant[];
  onPlantClick: (plant: Plant) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ plants, onPlantClick }) => {
  return (
    <div className="p-6">
      <header className="mb-8 mt-2">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2.5 rounded-2xl text-white shadow-lg shadow-emerald-200">
            <Leaf size={24} />
          </div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">IGrow</h1>
        </div>
        <p className="text-stone-500 text-sm mt-2 font-medium">Benvenuto nel tuo giardino digitale</p>
      </header>

      {plants.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center space-y-4">
          <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center text-stone-300">
             <Leaf size={40} />
          </div>
          <h2 className="text-xl font-bold text-stone-800">Ancora nessuna pianta</h2>
          <p className="text-stone-400 text-sm">Inizia premendo il pulsante + per aggiungere il tuo primo strain.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {plants.map(plant => (
            <PlantCard key={plant.id} plant={plant} onClick={onPlantClick} />
          ))}
        </div>
      )}
    </div>
  );
};
export default HomeView;