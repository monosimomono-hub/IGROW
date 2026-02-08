import { useState, useEffect } from 'react';
import { Plant, Activity, Product, AppData, GrowthPhase } from '../types';

const STORAGE_KEY = 'igrow_app_data_v1';

const INITIAL_DATA: AppData = {
  plants: [
    {
      id: '1',
      name: 'White Widow #1',
      strain: 'White Widow (Auto)',
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      photoUrl: 'https://picsum.photos/seed/plant1/400/600',
      currentPhase: GrowthPhase.VEGETATIVE
    }
  ],
  activities: [],
  products: [
    { id: 'p1', name: 'Grow A', type: 'Fertilizzante', npk: '3-0-1', brand: 'Advanced Nutrients' },
    { id: 'p2', name: 'Grow B', type: 'Fertilizzante', npk: '1-0-4', brand: 'Advanced Nutrients' },
  ]
};

export const useStore = () => {
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addPlant = (plant: Plant) => {
    setData(prev => ({ ...prev, plants: [...prev.plants, plant] }));
  };

  const updatePlant = (plant: Plant) => {
    setData(prev => ({
      ...prev,
      plants: prev.plants.map(p => p.id === plant.id ? plant : p)
    }));
  };

  const deletePlant = (id: string) => {
    setData(prev => ({
      ...prev,
      plants: prev.plants.filter(p => p.id !== id),
      activities: prev.activities.filter(a => a.plantId !== id)
    }));
  };

  const addActivity = (activity: Activity) => {
    setData(prev => ({ ...prev, activities: [activity, ...prev.activities] }));
  };

  const deleteActivity = (id: string) => {
      setData(prev => ({ ...prev, activities: prev.activities.filter(a => a.id !== id) }));
  }

  const addProduct = (product: Product) => {
    setData(prev => ({ ...prev, products: [...prev.products, product] }));
  };

  const deleteProduct = (id: string) => {
    setData(prev => ({ ...prev, products: prev.products.filter(p => p.id !== id) }));
  }

  const importData = (newData: AppData) => {
    setData(newData);
  };

  return {
    ...data,
    addPlant,
    updatePlant,
    deletePlant,
    addActivity,
    deleteActivity,
    addProduct,
    deleteProduct,
    importData
  };
};