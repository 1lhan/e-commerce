import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { NavLink, useSearchParams } from "react-router-dom"

export default function Products() {

    const { url, featuresByCategory } = useSelector(state => state.siteConfig)
    let [searchParams, setSearchParams] = useSearchParams()
    const [products, setProducts] = useState([])
    const [product, setProduct] = useState({})
    const [updateFormDp, setUpdateFormDp] = useState(false)
    const [infoDivText, setInfoDivText] = useState('')

    const [choosedCategory, setChoosedCategory] = useState(-1)


    const filterHandle = (name, value) => {
        if (value == '-1') searchParams.delete(name)
        else if (searchParams.has(name)) {
            searchParams.delete(name)
            searchParams.append(name, value)
        }
        else searchParams.append(name, value)
        setSearchParams(searchParams)
        getProducts()
    }

    const getProducts = async () => {
        let _products = await fetch(url + '/get-products/category=' + searchParams.get('category')).then(_res => _res.json())
        setProducts(_products)
    }

    const deleteProduct = async (productId) => {
        if (confirm('Product delete confirm')) {
            let _delete = await fetch(url + '/delete-product', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productId })
            }).then(_res => _res.json())

            if (_delete.action) {
                setInfoDivText('The product just deleted')
                getProducts()
            }
        }
    }

    const updateProduct = async (e) => {
        e.preventDefault();

        let productFeatures = {}
        let formChildren = e.target.childNodes
        let title;
        let price;
        let stock;
        for (let i = 1; i <= 3; i++) {
            if (i == 1) title = formChildren[i].childNodes[1].value
            if (i == 2) price = formChildren[i].childNodes[1].value
            if (i == 3) stock = formChildren[i].childNodes[1].value
        }

        let _childrensOfFeaturesDiv = document.getElementById('features-div').childNodes
        let _bool = true
        for (let i = 0; i < _childrensOfFeaturesDiv.length; i++) {
            if (_childrensOfFeaturesDiv[i].childNodes[1].value == -1) {
                _bool = false
                _childrensOfFeaturesDiv[i].childNodes[1].style.border = '1px solid red'
            }
            else {
                _bool = true
                productFeatures[_childrensOfFeaturesDiv[i].childNodes[1].name] = _childrensOfFeaturesDiv[i].childNodes[1].value
                _childrensOfFeaturesDiv[i].childNodes[1].style.border = '1px solid $gray-300'
            }
        }
        if (_bool) {
            let _addProduct = await fetch(url + '/update-product', {
                method: 'POST',
                headers: { 'Accept': 'application/json, text/plain', 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: product._id, title, price, stock, productFeatures, category: choosedCategory })
            }).then(_res => _res.json())

            if (_addProduct.action) {
                setInfoDivText('Product update successful')
                setUpdateFormDp(false)
            }
        }
    }

    useEffect(() => {
        getProducts()
    }, [updateFormDp])

    return (
        <div className="admin-products-page container">
            {infoDivText && <div className="info-div">
                <span>{infoDivText}</span>
                <i onClick={() => setInfoDivText('')} className="fa-solid fa-xmark" />
            </div>}
            <div className="top-div">
                <select onChange={(e) => filterHandle('category', e.target.value)} className="custom-select">
                    <option value={-1}>Choose Category</option>
                    {featuresByCategory && Object.keys(featuresByCategory).map((category, index) =>
                        <option key={index} className="index" value={category}>{category.includes('-') ? category.split('-').join(' ') : category}</option>
                    )}
                </select>
            </div>
            <div className="products">
                <div className="fields">
                    <span className="image">Img</span>
                    <span className="title">Title</span>
                    <span className="price">Price</span>
                    <span className="buttons">Buttons</span>
                </div>
                {products && products.map((product, index) =>
                    <div key={index} className="product">
                        <div className="image" />
                        <NavLink className='title' to={'/product/' + product.title}>{product.title}</NavLink>
                        <span className="price">{product.price}</span>
                        <div className="buttons">
                            <i onClick={() => {
                                setProduct(product)
                                setUpdateFormDp(true)
                                setChoosedCategory(product.category)
                                updateProduct(product._id)
                            }} className="fa-regular fa-pen-to-square" />
                            <i onClick={() => deleteProduct(product._id)} className="fa-regular fa-trash-can" />
                        </div>
                    </div>
                )}
            </div>
            <div style={{ display: updateFormDp ? '' : 'none' }} className="update-product-div">
                <form onSubmit={updateProduct} className="form">
                    <i onClick={() => setUpdateFormDp(false)} className="fa-solid fa-xmark" />
                    <span className="form-item">
                        <span>Title</span>
                        <input defaultValue={product.title} type="text" />
                    </span>
                    <span className="form-item">
                        <span>Price</span>
                        <input defaultValue={product.price} type="text" />
                    </span>
                    <span className="form-item">
                        <span>Stock</span>
                        <input defaultValue={product.stock} type="number" />
                    </span>
                    <span className="form-item">
                        <span>Category</span>
                        <select value={choosedCategory} onChange={(e) => setChoosedCategory(e.target.value)}>
                            <option value={-1}>Choose Category</option>
                            {featuresByCategory && Object.keys(featuresByCategory).map((category, index) =>
                                <option value={category} key={index}>{category}</option>
                            )}
                        </select>
                    </span>
                    {choosedCategory != -1 &&
                        <>
                            <span className="form-second-header">Features</span>
                            <div id="features-div">
                                {Object.keys(featuresByCategory[choosedCategory]).map((features, index) =>
                                    <span key={index} className="form-row-item">
                                        <span>{features}</span>
                                        <select defaultValue={product.features[features]} name={features}>
                                            <option value={-1}></option>
                                            {featuresByCategory[choosedCategory][features].map((item, index2) =>
                                                <option key={index2}>{item}</option>
                                            )}
                                        </select>
                                    </span>
                                )}
                            </div>
                        </>
                    }
                    <button className="submit-btn" type="submit">Update Product</button>
                </form>
            </div>
        </div>
    )
}