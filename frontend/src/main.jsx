import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import Home from './Home.jsx'
import ServicePage from './Service.jsx'
import Notfound
 from './NotFound.jsx'
const router = createBrowserRouter([
  {
    path: '/admin',
    element: <App />,
  },
  {
    path: '/',
    element: <Home />,
    errorElement: <Notfound />
  },
  {
    path: '/service/:id',
    element: <ServicePage />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
