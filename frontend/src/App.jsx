import { Route, Routes } from 'react-router-dom'
import Header from './Components/Header'
import ProductsByCategory from './Components/ProductsByCategory'
import Login from './Components/Login'
import Register from './Components/Register'
import AddProduct from './Components/admin/AddProduct'
import Products from './Components/admin/Products'
import UserInformations from './Components/user/UserInformations'
import MyOrders from './Components/user/MyOrders'
import Addresses from './Components/user/Addresses'
import ProductPage from './Components/ProductPage'
import Favorites from './Components/user/Favorites'
import MyCart from './Components/MyCart'
import Reviews from './Components/user/Reviews'
import HomePage from './Components/HomePage'
import PaymentPage from './Components/PaymentPage'
import Orders from './Components/admin/Orders'
import AnalysisCenter from './Components/admin/AnalysisCenter'

export default function App() {
    return (
        <>
            <Header />
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/category/:categoryName' element={<ProductsByCategory />} /> {/*const { categoryName } = useParams()*/}
                <Route path='/product/:productName' element={<ProductPage />} />
                <Route path='/admin'>
                    <Route path='add-product' element={<AddProduct />} />
                    <Route path='products' element={<Products />} />
                    <Route path='orders' element={<Orders />} />
                    <Route path='analysis-center' element={<AnalysisCenter />} />
                </Route>
                <Route path='/user-informations' element={<UserInformations />} />
                <Route path='/my-orders' element={<MyOrders />} />
                <Route path='/addresses' element={<Addresses />} />
                <Route path='/favorites' element={<Favorites />} />
                <Route path='/reviews' element={<Reviews />} />
                <Route path='/my-cart' element={<MyCart />} />
                <Route path='/payment' element={<PaymentPage />} />
            </Routes>
        </>
    )
}