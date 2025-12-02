import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Collection } from '../types';

const Collections: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [newColDesc, setNewColDesc] = useState('');

  const fetchCollections = async () => {
    const data = await api.collections.list();
    setCollections(data);
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!newColName) return;
    await api.collections.create({
        name: newColName,
        description: newColDesc,
        modelIds: []
    });
    setNewColName('');
    setNewColDesc('');
    setShowCreate(false);
    fetchCollections();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Collections</h1>
        <button 
            onClick={() => setShowCreate(!showCreate)}
            className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-slate-700 transition-colors"
        >
            {showCreate ? 'Cancel' : 'New Collection'}
        </button>
      </div>

      {showCreate && (
          <div className="mb-8 bg-white p-6 rounded-lg border border-gray-200 shadow-sm max-w-2xl">
              <h2 className="text-lg font-semibold mb-4">Create Collection</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input 
                        type="text" 
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        value={newColName}
                        onChange={e => setNewColName(e.target.value)}
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea 
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        value={newColDesc}
                        onChange={e => setNewColDesc(e.target.value)}
                      />
                  </div>
                  <div className="flex justify-end">
                      <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md">Create</button>
                  </div>
              </form>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map(col => (
            <Link key={col.id} to={`/collection/${col.id}`} className="block group">
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all h-full flex flex-col">
                    <div className="h-40 bg-gray-100 flex items-center justify-center text-4xl text-gray-300">
                        {/* Future: Render cover image or collage of thumbnails */}
                        📂
                    </div>
                    <div className="p-4 flex-1">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">{col.name}</h3>
                        <p className="text-gray-500 text-sm mt-2 line-clamp-2">{col.description}</p>
                        <div className="mt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            {col.modelIds.length} Models
                        </div>
                    </div>
                </div>
            </Link>
        ))}
      </div>
      
      {collections.length === 0 && !showCreate && (
          <div className="text-center py-12 text-gray-500">
              No collections yet. Create one to organize your models.
          </div>
      )}
    </div>
  );
};

export default Collections;