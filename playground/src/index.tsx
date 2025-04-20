import React from 'react';
import ReactDOM from 'react-dom/client';

import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import routes from '~pages'

console.log(routes)



ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={createBrowserRouter(routes)} />,
)
