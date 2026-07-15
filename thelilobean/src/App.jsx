import { Routes, Route } from 'react-router-dom';
import Landing from './Landing.jsx';
import Menu from './Menu.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/menu" element={<Menu />} />
    </Routes>
  );
}