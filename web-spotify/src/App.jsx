import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from './pages/Home';
import Detail from "./pages/Detail";
import AddSong from "./components/AddSong";

function App() {
 return (
   <BrowserRouter>
     <Routes>
       <Route path="/" element={<Home />} />
       <Route path="song/:id" element={<Detail/>} />
       <Route path="/add-song" element={<AddSong />} />
     
     </Routes>
   </BrowserRouter>
 );
}

export default App;
