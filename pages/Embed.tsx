import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { Model } from '../types';
import Viewer3D, { ViewerRef } from '../components/Viewer3D';

const Embed: React.FC = () => {
  const { type, id } = useParams<{ type: string, id: string }>();
  const [model, setModel] = useState<Model | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const viewerRef = useRef<ViewerRef>(null);

  useEffect(() => {
    const fetchModel = async () => {
      setLoading(true);
      setError(null);
      try {
        if (type === 'model' && id) {
          const m = await api.models.get(id);
          if (m) {
            setModel(m);
          } else {
            setError('Model not found');
          }
        } else if (type === 'collection') {
           // Placeholder for future collection embed support
           setError('Collection embedding not yet supported');
        } else {
            setError('Invalid embed parameters');
        }
      } catch (err) {
        console.error("Error fetching model for embed:", err);
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    };
    fetchModel();
  }, [type, id]);

  const getDetailUrl = () => {
    if (!model) return '#';
    try {
        // Construct URL relative to the current origin and path
        const baseUrl = window.location.href.split('#')[0];
        return `${baseUrl}#/model/${model.id}`;
    } catch {
        return '#';
    }
  };

  if (loading) {
    return (
        <div className="w-full h-screen flex items-center justify-center bg-gray-900">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-400 text-sm font-medium">Loading 3D Model...</span>
            </div>
        </div>
    );
  }

  if (error || !model) {
      return (
        <div className="w-full h-screen flex items-center justify-center bg-gray-900">
             <div className="text-center px-4">
                <div className="text-4xl mb-2">⚠️</div>
                <h3 className="text-white font-medium mb-1">Content Unavailable</h3>
                <p className="text-gray-500 text-sm">{error || 'The requested model could not be found.'}</p>
             </div>
        </div>
      );
  }

  const detailUrl = getDetailUrl();

  return (
    <div className="w-full h-screen relative overflow-hidden bg-gray-900 font-sans group">
      {/* 3D Viewer Layer */}
      <div className="absolute inset-0 z-0">
          <Viewer3D ref={viewerRef} fileUrl={model.fileUrl} backgroundColor="#111827" />
      </div>
      
      {/* Controls Overlay - Top Left, visible on hover */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
         <button
            onClick={() => viewerRef.current?.resetCamera()}
            className="bg-black/40 hover:bg-black/70 text-white/90 hover:text-white p-2.5 rounded-full backdrop-blur-md transition-all transform hover:scale-105 border border-white/10 shadow-lg"
            title="Reset Camera"
            aria-label="Reset Camera"
         >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
         </button>
      </div>
      
      {/* Bottom Info Bar - Responsive */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/90 via-black/70 to-transparent pt-24 pb-4 px-4 md:px-6 pointer-events-none transition-opacity duration-300 group-hover:opacity-100 opacity-0 sm:opacity-100">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 max-w-7xl mx-auto">
          {/* Metadata */}
          <div className="flex-1 min-w-0 mr-0 sm:mr-4 mb-2 sm:mb-0 transform translate-y-4 sm:translate-y-0 transition-transform duration-300 group-hover:translate-y-0">
             <h2 className="text-white font-bold text-lg sm:text-2xl drop-shadow-lg truncate leading-tight tracking-tight">{model.title}</h2>
             <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs sm:text-sm text-gray-300 mt-2 font-medium">
                {model.category && (
                    <span className="bg-white/10 border border-white/10 px-2.5 py-0.5 rounded-full backdrop-blur-sm shadow-sm">
                        {model.category}
                    </span>
                )}
                {model.license && <span className="opacity-90 shadow-black drop-shadow-md">{model.license}</span>}
                {model.region && (
                    <>
                        <span className="opacity-40 hidden sm:inline">•</span>
                        <span className="opacity-90 shadow-black drop-shadow-md">{model.region}</span>
                    </>
                )}
            </div>
          </div>
          
          {/* View Details Button */}
          <a 
            href={detailUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="pointer-events-auto shrink-0 inline-flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 active:bg-blue-700 text-white text-sm sm:text-base font-semibold px-6 py-3 sm:py-2.5 rounded-lg sm:rounded-full transition-all shadow-lg hover:shadow-primary/40 transform active:scale-95 w-full sm:w-auto border border-transparent hover:border-white/10"
          >
            <span>View Details</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
          </a>
        </div>
      </div>
      
      {/* Logo watermark */}
      <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-10 pointer-events-none">
          <a 
            href={detailUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity bg-black/30 hover:bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-white pointer-events-auto border border-white/10 hover:border-white/30"
            title="OpenMesh Repository"
          >
              <span className="text-xl sm:text-2xl leading-none">⬡</span>
              <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase hidden xs:block">OpenMesh</span>
          </a>
      </div>
    </div>
  );
};

export default Embed;