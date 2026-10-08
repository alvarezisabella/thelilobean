import { Routes, Route, useParams, useLocation, useNavigate } from 'react-router-dom';
import Landing from './Landing.jsx';
import Menu from './Menu.jsx';
import DrinkDetailPage from './DrinksDetails.jsx';
import CustomizePage from './Customize.jsx';
import { CartProvider, useCart } from './Cart.jsx';
import { MenuDataProvider, useMenuData } from './MenuDataContext.jsx';
import CheckoutPage from './Checkout.jsx';
import PaymentPage from './Payment.jsx';
import OrderConfirmationPage from './OrderConfirm.jsx';

function DrinkDetailRoute() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { drinks, loading, error } = useMenuData();

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Couldn't load the menu. Please refresh and try again.</p>;

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
  const { drinks, customizeCategories, loading, error } = useMenuData();

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Couldn't load the menu. Please refresh and try again.</p>;

  const drink = drinks[slug];
  if (!drink) return <p>Drink not found.</p>;

  // If we got here from "edit" on the checkout page, find that exact cart item
  const cartItemId = location.state?.cartItemId;
  const editingItem = cartItemId ? items.find((i) => i.id === cartItemId) : null;

  const handleConfirm = (order) => {
    if (editingItem) {
      updateItem(editingItem.id, order);   // update in place, no new card
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
      categories={customizeCategories}
      size={editingItem?.size ?? location.state?.size}
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
    <MenuDataProvider>
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
    </MenuDataProvider>
  );
}
