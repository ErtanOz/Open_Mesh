import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { ModelCategory } from '../types';

const Upload: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    license: 'CC-BY 4.0',
    sourceUrl: '',
    region: '',
    category: ModelCategory.OTHER,
    tags: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert('Please select a file');

    setLoading(true);
    try {
      const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
      await api.models.create({
        ...formData,
        tags: tagsArray,
        fileName: file.name
      }, file);
      
      // Instead of navigating (which causes sandbox security errors), show success screen
      setSuccess(true);
      
    } catch (error) {
      console.error(error);
      alert('Upload failed: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload Successful!</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Your model has been successfully published to the OpenMesh repository.</p>
            <div className="flex justify-center gap-4">
                <Link to="/" className="bg-primary text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors shadow-sm">
                    Return to Library
                </Link>
                <button 
                  onClick={() => {
                      setSuccess(false);
                      setFile(null);
                      setFormData(prev => ({ ...prev, title: '' }));
                  }} 
                  className="bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors"
                >
                    Upload Another
                </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
           <h1 className="text-xl font-bold text-gray-900">Upload New 3D Model</h1>
           <p className="text-sm text-gray-500 mt-1">Share infrastructure, monuments, or civic artifacts.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* File Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">3D Model File (.glb, .gltf)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600 justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".glb,.gltf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">GLB, GLTF up to 50MB</p>
                {file && <p className="text-sm text-green-600 font-semibold mt-2">Selected: {file.name}</p>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input required type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as ModelCategory})}>
                    {Object.values(ModelCategory).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
          </div>

          <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">License</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="e.g. CC0, CC-BY 4.0" value={formData.license} onChange={e => setFormData({...formData, license: e.target.value})} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Region / City</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="e.g. New York, NY" value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} />
            </div>
          </div>

          <div>
              <label className="block text-sm font-medium text-gray-700">Source URL</label>
              <input type="url" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="https://data.city.gov/..." value={formData.sourceUrl} onChange={e => setFormData({...formData, sourceUrl: e.target.value})} />
          </div>

          <div>
              <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
              <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="park, statue, historical..." value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} />
          </div>

          <div className="pt-4 flex justify-end">
            <button
                type="submit"
                disabled={loading}
                className={`bg-primary text-white px-6 py-2 rounded-md font-medium shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {loading ? 'Uploading...' : 'Publish Model'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;