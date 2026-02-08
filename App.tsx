import React, { useState } from 'react';
import { useStore } from './store/useStore';
import Layout from './components/Layout';
import HomeView from './views/HomeView';
import PlantDetail from './views/PlantDetail';
import ProductsView from './views/ProductsView';
import { Plant, GrowthPhase } from './types';
import { Download, Upload, Info, CheckCircle2 } from 'lucide-react';

const App: React.FC = () => {
  const store = useStore();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

  const handleAddPlant = () => {
    const name = prompt('Nome della pianta:');
    const strain = prompt('Varietà (Strain):');
    if (name && strain) {
      store.addPlant({
        id: Math.random().toString(36).substr(2, 9),
        name,
        strain,
        startDate: new Date().toISOString(),
        photoUrl: `https://picsum.photos/seed/${Math.random()}/400/600`,
        currentPhase: GrowthPhase.GERMINATION
      });
    }
  };

  if (selectedPlant) {
    return (
      <PlantDetail 
        plant={selectedPlant}
        activities={store.activities}
        products={store.products}
        onBack={() => setSelectedPlant(null)}
        onDelete={(id) => { store.deletePlant(id); setSelectedPlant(null); }}
        onAddActivity={store.addActivity}
        onDeleteActivity={store.deleteActivity}
        onUpdatePhase={(p, phase) => {
          store.updatePlant({ ...p, currentPhase: phase });
          setSelectedPlant({ ...p, currentPhase: phase });
        }}
      />
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} onAddClick={handleAddPlant}>
      {activeTab === 'home' && <HomeView plants={store.plants} onPlantClick={setSelectedPlant} />}
      
      {activeTab === 'calendar' && (
        <div className="p-6">
           <h1 className="text-3xl font-black text-stone-900 mb-4">Calendario</h1>
           <div className="bg-white p-6 rounded-[32px] shadow-sm text-center">
             <p className="text-stone-500">Funzionalità calendario completa in arrivo.</p>
           </div>
        </div>
      )}

      {activeTab === 'products' && (
        <ProductsView products={store.products} onAddProduct={store.addProduct} onDeleteProduct={store.deleteProduct} />
      )}

      {activeTab === 'settings' && (
         <div className="p-6">
           <h1 className="text-3xl font-black text-stone-900 mb-4">Impostazioni</h1>
           <p className="text-stone-500">Versione scaricata (Netlify Ready)</p>
         </div>
      )}
    </Layout>
  );
};
export default App;