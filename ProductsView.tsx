import React, { useState } from 'react';
import { Product } from '../types';
import { Package, Plus, Trash2, Tag, Beaker, X } from 'lucide-react';

interface ProductsViewProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
}

const ProductsView: React.FC<ProductsViewProps> = ({ products, onAddProduct, onDeleteProduct }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [npk, setNpk] = useState('');
  const [type, setType] = useState('Fertilizzante');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProduct({
      id: Math.random().toString(36).substr(2, 9),
      name,
      brand,
      npk,
      type
    });
    setName('');
    setBrand('');
    setNpk('');
    setShowAdd(false);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-stone-900">I Miei Prodotti</h1>
          <p className="text-sm text-stone-500">Gestisci i tuoi nutrienti</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="p-4 bg-emerald-600 text-white rounded-[24px] shadow-lg shadow-emerald-100"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {products.length === 0 ? (
          <div className="text-center py-12 text-stone-400 bg-white rounded-[32px] border border-dashed border-stone-200">
            <Package size={48} className="mx-auto mb-4 opacity-20" />
            <p>Nessun prodotto aggiunto.</p>
          </div>
        ) : (
          products.map(product => (
            <div key={product.id} className="bg-white p-5 rounded-[32px] shadow-sm border border-stone-100 flex items-center gap-4">
              <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center text-emerald-600">
                <Beaker size={28} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-stone-800">{product.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-stone-400 uppercase">
                    <Tag size={10} /> {product.brand}
                  </span>
                  <span className="px-2 py-0.5 bg-stone-100 rounded text-[10px] font-black text-stone-600 uppercase">
                    NPK {product.npk}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => onDeleteProduct(product.id)}
                className="p-2 text-stone-300 hover:text-red-400"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-stone-800">Nuovo Prodotto</h2>
              <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-stone-100 rounded-full">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                placeholder="Nome Prodotto (es. Bloom Master)" 
                value={name} onChange={e => setName(e.target.value)}
                className="w-full p-4 bg-stone-100 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <input 
                placeholder="Brand (es. BioBizz)" 
                value={brand} onChange={e => setBrand(e.target.value)}
                className="w-full p-4 bg-stone-100 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <input 
                placeholder="Valori NPK (es. 2-5-4)" 
                value={npk} onChange={e => setNpk(e.target.value)}
                className="w-full p-4 bg-stone-100 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <select 
                 value={type} onChange={e => setType(e.target.value)}
                 className="w-full p-4 bg-stone-100 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500"
              >
                <option>Fertilizzante</option>
                <option>Additivo</option>
                <option>Ammendante</option>
                <option>Altro</option>
              </select>
              <button type="submit" className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-bold shadow-lg shadow-emerald-100">
                Aggiungi Prodotto
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProductsView;