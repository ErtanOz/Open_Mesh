import { Model, Collection } from '../types';
import { saveItem, getAllItems, getItem, saveFile, getFile } from './db';

// TOGGLE THIS TO TRUE TO USE REAL BACKEND (Requires running Node server)
const USE_REAL_BACKEND = false; 
const API_URL = 'http://localhost:3001/api';

const generateId = () => Math.random().toString(36).slice(2, 11);

export const api = {
  models: {
    list: async (): Promise<Model[]> => {
      if (USE_REAL_BACKEND) {
        const res = await fetch(`${API_URL}/models`);
        return res.json();
      }
      return getAllItems<Model>('models');
    },

    get: async (id: string): Promise<Model | undefined> => {
      if (USE_REAL_BACKEND) {
        const res = await fetch(`${API_URL}/models/${id}`);
        if (!res.ok) return undefined;
        return res.json();
      }
      const model = await getItem<Model>('models', id);
      if (model) {
        // Revoke old URL if exists to avoid memory leaks in long session
        // In a real app we'd manage this strictly
        const file = await getFile(id);
        if (file) {
           model.fileUrl = URL.createObjectURL(file);
        }
      }
      return model;
    },

    create: async (metadata: Omit<Model, 'id' | 'createdAt' | 'fileUrl'>, file: File): Promise<Model> => {
      if (USE_REAL_BACKEND) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('data', JSON.stringify(metadata));
        const res = await fetch(`${API_URL}/models`, {
          method: 'POST',
          body: formData,
        });
        return res.json();
      }

      const id = generateId();
      await saveFile(id, file);
      
      const newModel: Model = {
        ...metadata,
        id,
        createdAt: Date.now(),
        fileUrl: '', // Will be generated on get
        fileName: file.name
      };

      await saveItem('models', newModel);
      return newModel;
    }
  },

  collections: {
    list: async (): Promise<Collection[]> => {
      if (USE_REAL_BACKEND) {
        const res = await fetch(`${API_URL}/collections`);
        return res.json();
      }
      return getAllItems<Collection>('collections');
    },

    get: async (id: string): Promise<Collection | undefined> => {
      if (USE_REAL_BACKEND) {
        const res = await fetch(`${API_URL}/collections/${id}`);
        if (!res.ok) return undefined;
        return res.json();
      }
      return getItem<Collection>('collections', id);
    },

    create: async (data: Omit<Collection, 'id' | 'createdAt'>): Promise<Collection> => {
       if (USE_REAL_BACKEND) {
        const res = await fetch(`${API_URL}/collections`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
      }
      const newCollection: Collection = {
        ...data,
        id: generateId(),
        createdAt: Date.now(),
      };
      await saveItem('collections', newCollection);
      return newCollection;
    }
  }
};