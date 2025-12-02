import React from 'react';
import { Link } from 'react-router-dom';
import { Model } from '../types';

interface ModelCardProps {
  model: Model;
}

const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
  return (
    <Link to={`/model/${model.id}`} className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-gray-100 relative flex items-center justify-center overflow-hidden">
        {model.thumbnail ? (
          <img src={model.thumbnail} alt={model.title} className="w-full h-full object-cover" />
        ) : (
          <div className="text-4xl text-gray-300">⬡</div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg leading-tight text-gray-900 line-clamp-1">{model.title}</h3>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
           <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
             {model.category}
           </span>
           {model.region && (
             <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
               {model.region}
             </span>
           )}
        </div>

        <div className="text-xs text-gray-500 flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
          <span className="truncate max-w-[120px]">{model.license}</span>
          <span>{new Date(model.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
};

export default ModelCard;