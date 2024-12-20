import Header from "./layouts/Header";
import Home from "./pages/Home/Home";
import Footer from "./layouts/Footer";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Cart from "./pages/Cart/Cart";
import Product from "./pages/Product/Product";
import DetailProduct from "./pages/Product/DetailProduct";
import Checkout from "./pages/Checkout/Checkout";
import ForgetPassword from "./pages/ForgetPassword/ForgetPassword";
import Blog from "./pages/Blog/Blog";
import Page403 from './pages/Admin/400/Page403';
import Contact from "./pages/FAQ/Contact";
import URL_PATH from "./config/UrlPath";
import AuthRoute from "./Auth/AuthRoute";
import DetailUser from "./pages/User/DetailUser";
import OrderUser from "./pages/User/OrderUser";
import CheckPayment from "./pages/checkpayment/payment";
import Order from "./pages/Orders/Order";
import DetailOrder from "./pages/Orders/DetailOrder";
import ChatBot from "./pages/ChatBot/ChatBot";
'use client'

 function Client(){
   const isAuthenticated = localStorage.getItem('hasLogin') === 'true';
  //  const slug = useParams()['slug'];
    return(
        <div className="page-holder">
          <Header />
          <div style={{minHeight:550}}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path={URL_PATH} element={<Home />} />
              <Route path={URL_PATH.concat("/lien-he.html")} element={<Contact />} />
              <Route path={URL_PATH.concat("/cua-hang")} element={<Product />} />
              <Route path={URL_PATH.concat("/tin-tuc.html")} element={<Blog />} />
              <Route path={URL_PATH.concat("/cua-hang/:id")} element={<DetailProduct />} />
              <Route path={URL_PATH.concat("/quen-mat-khau")} element={<ForgetPassword/>}/>
              <Route path={URL_PATH.concat("/checkpayment")} element={<CheckPayment/>}/>
              <Route path={URL_PATH.concat("/chatbot")} element={<ChatBot/>}/>
              <Route path="*" element={<Page403 />} />
              <Route path={URL_PATH.concat("/tien-hanh-dat-hang")} element={<AuthRoute element={Checkout} isAuthenticated={!isAuthenticated} redirectPath={URL_PATH} />}/>
              <Route path={URL_PATH.concat("/gio-hang")} element={<AuthRoute element={Cart} isAuthenticated={!isAuthenticated} redirectPath={URL_PATH} />}/>
              <Route path={URL_PATH.concat("/don-hang")} element={<AuthRoute element={Order} isAuthenticated={!isAuthenticated} redirectPath={URL_PATH} />}/>
              <Route path={URL_PATH.concat("/chi-tiet-don-hang/:id")} element={<AuthRoute element={DetailOrder} isAuthenticated={!isAuthenticated} redirectPath={URL_PATH} />}/>
              <Route path={URL_PATH.concat("/thong-tin-khach-hang.html")} element={<AuthRoute element={DetailUser} isAuthenticated={!isAuthenticated} redirectPath={URL_PATH} />}/>
              <Route path={URL_PATH.concat("/dang-nhap")} element={<AuthRoute element={Login} isAuthenticated={!isAuthenticated} redirectPath={URL_PATH} />}/>
              <Route path={URL_PATH.concat("/dang-ky")} element={<AuthRoute element={Register} isAuthenticated={!isAuthenticated} redirectPath={URL_PATH} />}/>
            </Routes>
          </div>
          <Footer />
        </div>
    );
 }
 export default Client;