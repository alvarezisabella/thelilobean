import { Routes, Route, useParams } from 'react-router-dom';
import Landing from './Landing.jsx';
import Menu from './Menu.jsx';
import {drinks} from './drinksMenu.js';
import DrinkDetailPage from './DrinksDetails.jsx';

function DrinkDetailRoute() {
  const { slug } = useParams();
  const drink = drinks[slug];
  console.log(`SLUG: ${slug}`);
  if (!drink) return <p>Drink not found.</p>;
  return <DrinkDetailPage {...drink} onCustomizeClick={(size) => console.log('Customize', drink.name, size)} />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/menu/:slug" element={<DrinkDetailRoute />} />
    </Routes>
  );
}