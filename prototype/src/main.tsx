import React from 'react';
import { createRoot } from 'react-dom/client';
import AlbumCleanerPrototype from '../album-cleaner-prototype.canvas';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AlbumCleanerPrototype />
  </React.StrictMode>
);
