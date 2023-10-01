import { useState } from "react"
import { useSelector } from "react-redux"

export default function AddProduct() {

    const { featuresByCategory, url } = useSelector(state => state.siteConfig)
    const [choosedCategory, setChoosedCategory] = useState(-1)
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')
    const [stock, setStock] = useState('')

    const addProduct = async (e) => {
        e.preventDefault()

        let productFeatures = {}
        let _childrensOfFeaturesDiv = document.getElementById('features-div').childNodes
        for (let i = 0; i < _childrensOfFeaturesDiv.length; i++) {
            productFeatures[_childrensOfFeaturesDiv[i].childNodes[1].name] = _childrensOfFeaturesDiv[i].childNodes[1].value
        }
        let _addProduct = await fetch(url + '/add-product', {
            method: 'POST',
            headers: { 'Accept': 'application/json, text/plain', 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, price, stock, productFeatures, category: choosedCategory })
        }).then(_res => _res.json())

        if (_addProduct.action) {
            e.target.reset()
        }
        console.log(_addProduct)
    }

    return (
        <div className="add-product-page container">
            <form onSubmit={addProduct} className="form">
                <span className="form-header">Add Product</span>
                <span className="form-item">
                    <span>Title</span>
                    <input onChange={(e) => setTitle(e.target.value)} type="text" />
                </span>
                <span className="form-item">
                    <span>Price</span>
                    <input onChange={(e) => setPrice(e.target.value)} type="text" />
                </span>
                <span className="form-item">
                    <span>Stock</span>
                    <input onChange={(e) => setStock(e.target.value)} type="number" />
                </span>
                <span className="form-item">
                    <span>Category</span>
                    <select onChange={(e) => setChoosedCategory(e.target.value)}>
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
                                    <select name={features}>
                                        {featuresByCategory[choosedCategory][features].map((item, index2) =>
                                            <option key={index2}>{item}</option>
                                        )}
                                    </select>
                                </span>
                            )}
                        </div>
                    </>
                }
                <button className="submit-btn" type="submit">Add Product</button>
            </form>
        </div>
    )
}