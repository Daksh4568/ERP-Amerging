import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './Layout.jsx'
import Dashboard from './Dashboard/Dashboard.jsx'
import Login from './components/Molecules/Login'
import JoiningForm from './Modules/HRModule/JoiningForm'
import SelfEvalFrom from './components/Molecules/SelfEvalFrom'
import ExitForm from './components/Molecules/ExitForm'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' elements={<Layout/>} >
      <Route path='' element={<Login/>}/>
      <Route path='dashboard' element={<Dashboard/>}>
        <Route className='' path='joining-form' element={<JoiningForm/>}/>
        <Route path='selfeval-form' element={<SelfEvalFrom />}/>
        <Route path='exit-form' element={<ExitForm />}/>
      </Route>
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
