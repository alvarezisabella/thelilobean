import { Routes, Route, useParams } from 'react-router-dom';
import Landing from './Landing.jsx';
import Menu from './Menu.jsx';
import {drinks} from './drinksMenu.js';
import DrinkDetailPage from './DrinksDetails.jsx';
import CustomizePage from './Customize.jsx';
import { useNavigate } from 'react-router-dom';

function DrinkDetailRoute() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const drink = drinks[slug];
  console.log(`SLUG: ${slug}`);
  if (!drink) return <p>Drink not found.</p>;
  return <DrinkDetailPage {...drink} onCustomizeClick={() => navigate(`/menu/${slug}/customize`)} />;
}

function CustomizeRoute() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const drink = drinks[slug];
  if (!drink) return <p>Drink not found.</p>;
  return <CustomizePage name={drink.name} imageUrl={drink.imageUrl} categories={drink.categories} onConfirm={() => navigate(`/menu`)} />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/menu/:slug" element={<DrinkDetailRoute />} />
      <Route path="/menu/:slug/customize" element={<CustomizeRoute />} />
    </Routes>
  );
}