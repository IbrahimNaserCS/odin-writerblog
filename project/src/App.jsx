import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Login } from './Login';
import { Header } from './Header';
import { Posts } from './Posts';
import { Post } from './Post';
import { Error } from './Error';

function App() {
  const isLoggedIn = !!localStorage.getItem('token');
  const router = createBrowserRouter([
    {
      path: '/',
      element: isLoggedIn ? <><Header></Header><Posts></Posts></> : <Login></Login>
    },
    {
      path: '/post/:id',
      element: isLoggedIn ? <><Header></Header><Post></Post></> : <Error></Error>
    } 
  ])

  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App
