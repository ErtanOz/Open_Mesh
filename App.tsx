import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Upload from './pages/Upload';
import ModelDetail from './pages/ModelDetail';
import Collections from './pages/Collections';
import CollectionDetail from './pages/CollectionDetail';
import Embed from './pages/Embed';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/model/:id" element={<ModelDetail />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collection/:id" element={<CollectionDetail />} />
          <Route path="/embed/:type/:id" element={<Embed />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;