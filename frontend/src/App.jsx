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

export default function App() {
    return (
        <>
            <Header />
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/category/:categoryName' element={<ProductsByCategory />} /> {/*const { categoryName } = useParams()*/}
                <Route path='/product/:productName' element={<ProductPage />} />
                <Route path='/admin'>
                    <Route path='add-product' element={<AddProduct />} />
                    <Route path='products' element={<Products />} />
                </Route>
                <Route path='/user-informations' element={<UserInformations />} />
                <Route path='/my-orders' element={<MyOrders />} />
                <Route path='/addresses' element={<Addresses />} />
                <Route path='/favorites' element={<Favorites />} />
            </Routes>
        </>
    )
}