import { RouterProvider } from "react-router-dom";
import Route from "./routes/Route";
import("preline");

import Tailwind from 'primereact/passthrough/tailwind';

import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
        
function App() {
  return (
    <>
      <PrimeReactProvider value={{ unstyled: false, pt: Tailwind }}><RouterProvider router={Route} /></PrimeReactProvider>
     
    </>
  )
}

export default App
