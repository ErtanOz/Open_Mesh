import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { Model, Collection } from '../types';
import ModelCard from '../components/ModelCard';

const CollectionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [collection, setCollection] = useState<Collection | undefined>();
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const col = await api.collections.get(id);
        setCollection(col);
        if (col && col.modelIds.length > 0) {
            // In a real API we would fetch by ID list or have a sub-route
            // Here we just fetch all and filter (inefficient but works for mock)
            const allModels = await api.models.list();
            const colModels = allModels.filter(m => col.modelIds.includes(m.id));
            setModels(colModels);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!collection) return <div>Collection not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       <div className="bg-white rounded-xl p-8 mb-8 border border-gray-200 shadow-sm">
           <h1 className="text-3xl font-bold text-gray-900 mb-2">{collection.name}</h1>
           <p className="text-lg text-gray-600 max-w-3xl">{collection.description}</p>
           <div className="mt-4 text-sm text-gray-400">
               Created {new Date(collection.createdAt).toLocaleDateString()} • {models.length} items
           </div>
       </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {models.map(model => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
        
        {models.length === 0 && (
            <div className="text-center py-12 text-gray-500">
                This collection is empty.
            </div>
        )}
    </div>
  );
};

export default CollectionDetail;