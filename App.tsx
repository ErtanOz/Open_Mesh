import React from 'react';
import { MemoryRouter, HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Upload from './pages/Upload';
import ModelDetail from './pages/ModelDetail';
import Collections from './pages/Collections';
import CollectionDetail from './pages/CollectionDetail';
import Embed from './pages/Embed';

const App: React.FC = () => {
  // CONFIGURATION:
  // For production deployment where you want the URL bar to update (e.g. domain.com/#/model/123),
  // you can replace <MemoryRouter> with <HashRouter>.
  // We currently use MemoryRouter to ensure compatibility with strict sandbox environments (like AI previewers)
  // that block URL manipulation.
  
  const getInitialRoute = () => {
    try {
      const hash = window.location.hash;
      if (hash && hash.length > 1) {
        return hash.substring(1); // Remove the '#'
      }
    } catch (e) {
      console.warn("Could not read location hash", e);
    }
    return '/';
  };

  return (
    <MemoryRouter initialEntries={[getInitialRoute()]}>
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
    </MemoryRouter>
  );
};

export default App;