import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Model, Collection } from '../types';
import Viewer3D from '../components/Viewer3D';

const ModelDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [model, setModel] = useState<Model | undefined>();
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const m = await api.models.get(id);
        setModel(m);
        const c = await api.collections.list();
        setCollections(c);
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleAddToCollection = async () => {
      if(!selectedCollection || !model) return;
      const collection = collections.find(c => c.id === selectedCollection);
      if(collection) {
          // In a real backend, this would be a PATCH request
          const updated = { ...collection, modelIds: [...collection.modelIds, model.id] };
          // Mock update (we need an update method in API but for MVP we skip strict implementation)
          alert(`Added to ${collection.name} (simulated)`);
      }
  };

  if (loading) return <div className="p-8 text-center">Loading model...</div>;
  if (!model) return <div className="p-8 text-center">Model not found</div>;

  // Robustly construct the embed URL avoiding 'null' origins in some environments
  const getEmbedUrl = () => {
    try {
        const baseUrl = window.location.href.split('#')[0];
        return `${baseUrl}#/embed/model/${model.id}`;
    } catch {
        return '';
    }
  };
  
  const embedUrl = getEmbedUrl();
  const iframeCode = `<iframe src="${embedUrl}" width="100%" height="500" frameborder="0" allowfullscreen></iframe>`;

  return (
    <div className="flex flex-col h-full lg:flex-row">
      {/* Viewer Section */}
      <div className="h-[50vh] lg:h-full lg:w-3/4 bg-gray-900 relative">
         <Viewer3D fileUrl={model.fileUrl} backgroundColor="#1e293b" />
         <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button 
                onClick={() => navigator.clipboard.writeText(embedUrl).then(() => alert('Embed URL copied!'))}
                className="bg-black/50 text-white text-xs px-3 py-2 rounded backdrop-blur-md hover:bg-black/70"
            >
                Share
            </button>
         </div>
      </div>

      {/* Info Sidebar */}
      <div className="lg:w-1/4 bg-white border-l border-gray-200 overflow-y-auto p-6">
        <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{model.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
                 <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 font-semibold">{model.category}</span>
                 {model.region && <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">📍 {model.region}</span>}
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{model.description}</p>
        </div>

        <div className="space-y-4 border-t border-gray-100 pt-6">
            
            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <span className="block text-gray-400 text-xs uppercase">License</span>
                    <span className="font-medium text-gray-800">{model.license}</span>
                </div>
                <div>
                    <span className="block text-gray-400 text-xs uppercase">Published</span>
                    <span className="font-medium text-gray-800">{new Date(model.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="col-span-2">
                    <span className="block text-gray-400 text-xs uppercase mb-1">Source</span>
                    {model.sourceUrl ? (
                        <a href={model.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary truncate block hover:underline">
                            {model.sourceUrl}
                        </a>
                    ) : (
                        <span className="text-gray-500 italic">No source link provided</span>
                    )}
                </div>
            </div>

            {/* Tags */}
            <div className="pt-4">
                <span className="block text-gray-400 text-xs uppercase mb-2">Tags</span>
                <div className="flex flex-wrap gap-2">
                    {model.tags.map(tag => (
                        <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">#{tag}</span>
                    ))}
                </div>
            </div>

            {/* Embed Code */}
            <div className="pt-6 border-t border-gray-100">
                <span className="block text-gray-400 text-xs uppercase mb-2">Embed Code</span>
                <div className="bg-gray-50 p-2 rounded text-xs text-gray-600 font-mono break-all border border-gray-200 relative group">
                    {iframeCode}
                    <button 
                        onClick={() => navigator.clipboard.writeText(iframeCode)}
                        className="absolute top-1 right-1 bg-white border border-gray-200 px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        Copy
                    </button>
                </div>
            </div>

            {/* Add to Collection Mock UI */}
            <div className="pt-6">
                <span className="block text-gray-400 text-xs uppercase mb-2">Collections</span>
                <div className="flex gap-2">
                    <select 
                        className="flex-1 text-sm border border-gray-300 rounded p-2"
                        value={selectedCollection}
                        onChange={(e) => setSelectedCollection(e.target.value)}
                    >
                        <option value="">Select Collection...</option>
                        {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <button 
                        onClick={handleAddToCollection}
                        className="bg-gray-800 text-white px-3 rounded text-sm hover:bg-black"
                    >
                        Add
                    </button>
                </div>
                <div className="mt-2 text-right">
                    <Link to="/collections" className="text-xs text-primary hover:underline">Create New</Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ModelDetail;