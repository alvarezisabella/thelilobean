import { Routes, Route, useParams, useLocation } from 'react-router-dom';
import Landing from './Landing.jsx';
import Menu from './Menu.jsx';
import {drinks} from './drinksMenu.js';
import DrinkDetailPage from './DrinksDetails.jsx';
import CustomizePage from './Customize.jsx';
import { CartProvider, useCart } from './Cart.jsx';
import CheckoutPage from './Checkout.jsx';
import PaymentPage from './Payment.jsx';
import OrderConfirmationPage from './OrderConfirm.jsx';
import { useNavigate } from 'react-router-dom';

function DrinkDetailRoute() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const drink = drinks[slug];

  if (!drink) return <p>Drink not found.</p>;

  const handleAddToOrder = (selectedSize) => {
    addItem({
      slug,
      name: drink.name,
      imageUrl: drink.imageUrl,
      size: selectedSize,
    });
    navigate('/checkout');
  };

  const handleCustomizeClick = (selectedSize) => {
    navigate(`/menu/${slug}/customize`, { state: { size: selectedSize } });
  };

  return (
    <DrinkDetailPage
      name={drink.name}
      imageUrl={drink.imageUrl}
      sizes={drink.sizes}
      included={drink.included}
      onAddToOrder={handleAddToOrder}
      onCustomizeClick={handleCustomizeClick}
    />
  );
}

function CustomizeRoute() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { items, addItem, updateItem } = useCart();
  const drink = drinks[slug];

  if (!drink) return <p>Drink not found.</p>;

  // If we got here from "edit" on the checkout page, find that exact cart item
  const cartItemId = location.state?.cartItemId;
  const editingItem = cartItemId ? items.find((i) => i.id === cartItemId) : null;

  const handleConfirm = (order) => {
    if (editingItem) {
      updateItem(editingItem.id, order);   // ← update in place, no new card
    } else {
      addItem(order);
    }
    navigate('/checkout');
  };

  return (
    <CustomizePage
      name={drink.name}
      imageUrl={drink.imageUrl}
      slug={slug}
      category={drink.category}
      size={editingItem?.size}
      initialSelections={editingItem?.selections}
      initialShots={editingItem?.shots}
      onConfirm={handleConfirm}
    />
  );
}

function CheckoutRoute() {
  return <CheckoutPage />;
}

export default function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/:slug" element={<DrinkDetailRoute />} />
        <Route path="/menu/:slug/customize" element={<CustomizeRoute />} />
        <Route path="/checkout" element={<CheckoutRoute />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
      </Routes>
    </CartProvider>
  );
}