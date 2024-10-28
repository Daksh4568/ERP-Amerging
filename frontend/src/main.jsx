import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './Layout.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import Login from './components/Forms/Login.jsx'
import JoiningForm from './components/Forms/JoiningForm'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' elements={<Layout/>} >
      <Route path='' element={<Login/>}/>
      <Route path='dashboard' element={<Dashboard/>}>
        <Route path='joining-form' element={<JoiningForm/>}/>
      </Route>
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
