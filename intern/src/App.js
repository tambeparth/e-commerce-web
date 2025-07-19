import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Shop from './Pages/shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import LoginSignUp from './Pages/LoginSignUp';
import Footer from './Components/Footer/Footer';
import Wishlist from './Components/Wishlist/Wishlist';
import UserProfile from './Components/UserProfile/UserProfile';
import Portfolio from './Components/Portfolio/Portfolio';
import men_banner from './Components/Asset/banner_mens.png';
import women_banner from './Components/Asset/banner_women.png';
import kid_banner from './Components/Asset/banner_kids.png';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path='/' element={<Shop />} />
            <Route path='/mens' element={<ShopCategory banner={men_banner} category="men" />} />
            <Route path='/womens' element={<ShopCategory banner={women_banner} category="women" />} />
            <Route path='/kids' element={<ShopCategory banner={kid_banner} category="kid" />} />
            <Route path="/product" element={<Product />}>
              <Route path=':productId' element={<Product />} />
            </Route>
            <Route path='/cart' element={<Cart />} />
            <Route path='/wishlist' element={<Wishlist />} />
            <Route path='/profile' element={<UserProfile />} />
            <Route path='/portfolio' element={<Portfolio />} />
            <Route path='/login' element={<LoginSignUp />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;

