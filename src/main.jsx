import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './styles.css'
import App from './App'
import Home from './pages/Home'
import About from './pages/About'
import Activities from './pages/Activities'
import HowItWorks from './pages/HowItWorks'
import Team from './pages/Team'
import Login from './components/Login'
import Signup from './components/Signup'
import VerifyEmail from './components/VerifyEmail'
import RequestHelp from './components/RequestHelp'
import RequestsList from './pages/RequestsList'
import MyRequests from './components/MyRequests'
import VerifyEmailCallback from './pages/VerifyEmailCallback'
import ActivateAccount from './pages/ActivateAccount'
import NotFound from './pages/NotFound'
import ChatPage from './pages/ChatPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'activities', element: <Activities /> },
      { path: 'how-it-works', element: <HowItWorks /> },
      { path: 'team', element: <Team /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'activate-account', element: <ActivateAccount /> },
      { path: 'verify-email', element: <VerifyEmail /> },
      { path: 'request-help', element: <RequestHelp /> },
      { path: 'edit-request/:id', element: <RequestHelp /> },
      { path: 'requests', element: <RequestsList /> },
      { path: 'my-requests', element: <MyRequests /> },
      { path: 'verify-email-callback', element: <VerifyEmailCallback /> },
      { path: 'chat', element: <ChatPage /> },
      { path: 'chat/:chatId', element: <ChatPage /> },
    ],
    errorElement: <NotFound />,
  },
])

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)


