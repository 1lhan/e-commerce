import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import LineChart from "../LineChart"

export default function AnalysisCenter() {

    const { url, featuresByCategory } = useSelector(state => state.siteConfig)

    const [featuresOfCategory, setFeaturesOfCategory] = useState([])
    const [category, setCategory] = useState('')
    const [totalEarning, setTotalEarning] = useState(0)
    const [numberOfOrders, setNumberOfOrders] = useState(0)
    const [numberOfSaledProducts, setNumberOfSaledProducts] = useState(0)
    const [productNumberByCategory, setProductNumberByCategory] = useState(null)
    const [productNumberByFeatures, setProductNumberByFeatures] = useState({})
    const [valueForLineChart, setValueForLineChart] = useState([])

    const analysisDataHandle = async () => {
        document.getElementById('analysis-data-btn').style.display = 'none'
        document.getElementById('bubbless').style.display = 'flex'

        let orders = await fetch(url + '/get-orders').then(_res => _res.json())

        let _values = []
        for (let i in orders) {
            let _date = new Date(orders[i].date.orderDate).getDate() + '.' + (new Date(orders[i].date.orderDate).getMonth() + 1) + '.' + new Date(orders[i].date.orderDate).getFullYear()
            if (_values.length == 0 || _values.findIndex(item => item.date == _date) == -1) {
                _values.push({ value: orders[i].totalPrice, date: _date })
            }
            else if (_values.findIndex(item => item.date == _date) != -1) {
                _values[_values.findIndex(item => item.date == _date)].value += orders[i].totalPrice
            }
        }
        setValueForLineChart(_values)

        let featuresDiv = document.getElementById('features-div').children
        let featuresArray = []
        for (let i in featuresDiv) {
            if (featuresDiv[i].tagName == 'LABEL') {
                if (featuresDiv[i].children[1].checked) featuresArray.push(featuresDiv[i].children[1].name)
            }
        }

        let _numberOfOrders = 0
        let _numberOfSaledProducts = 0
        let _totalEarning = 0

        let _productNumberByFeatures = {}
        let _productNumberByCategory = { total: 0, background: 'top', data: [] }
        featuresArray.every(item => _productNumberByFeatures[item] = { total: 0, background: 'top', data: [] })

        for (let i in orders) {
            _numberOfOrders++
            _totalEarning += orders[i].lastCartPrice

            for (let j in orders[i].cart) {
                let quantity = orders[i].cart[j].quantity
                _numberOfSaledProducts += quantity

                let product = await fetch(url + '/get-product-by-id/' + orders[i].cart[j].productId).then(_res => _res.json())

                let categoryIndex = _productNumberByCategory.data.findIndex(item => item[0] == product.product.category)
                if (categoryIndex == -1) _productNumberByCategory.data.push([product.product.category, quantity, 0])
                else _productNumberByCategory.data[categoryIndex][1] += quantity
                _productNumberByCategory.total += quantity

                if (product.product.category == category) {
                    for (let f in featuresArray) {
                        let featureIndex = _productNumberByFeatures[featuresArray[f]].data.findIndex(item => item[0] == product.product.features[featuresArray[f]])

                        if (featureIndex == -1) _productNumberByFeatures[featuresArray[f]].data.push([product.product.features[featuresArray[f]], quantity, 0])
                        else _productNumberByFeatures[featuresArray[f]].data[featureIndex][1] += quantity
                        _productNumberByFeatures[featuresArray[f]].total += quantity
                    }
                }
            }
        }
        for (let i in Object.keys(_productNumberByFeatures)) {
            _productNumberByFeatures[Object.keys(_productNumberByFeatures)[i]] = (chartDataHandler(_productNumberByFeatures[Object.keys(_productNumberByFeatures)[i]]))
        }
        setProductNumberByFeatures(_productNumberByFeatures)
        setProductNumberByCategory(chartDataHandler(_productNumberByCategory))
        setNumberOfSaledProducts(_numberOfSaledProducts)
        setNumberOfOrders(_numberOfOrders)
        setTotalEarning(_totalEarning)

        document.getElementById('analysis-data-btn').style.display = 'flex'
        document.getElementById('bubbless').style.display = 'none'
    }

    const chartDataHandler = (data) => {
        //example data structure: { background: "top" total: 0, data: [['mobile-phone', 14, 0], ['mainboard', 3, 0]] } data[0][0]: name, data[0][1]: value, data[0][2]: height (%)
        for (let i in data.data) {
            let num1 = Math.floor(Math.random() * 255)
            let num2 = Math.floor(Math.random() * 255)
            let num3 = Math.floor(Math.random() * 255)
            let height = ((data.data[i][1] / data.total) * 100).toFixed(0)
            data.data[i][2] = height
            data.data[i][3] = `rgb(${num1},${num2},${num3})`
        }
        return data
    }

    useEffect(() => {
    }, [])

    return (
        <div className="analysis-center-page container">
            <div className="get-data-settings">
                <select onChange={(e) => {
                    setCategory(e.target.value)
                    if (e.target.value != -1) {
                        setFeaturesOfCategory(Object.keys(featuresByCategory[e.target.value]))
                    }
                }} className="custom-select">
                    <option value={-1}>Category</option>
                    {featuresByCategory && Object.keys(featuresByCategory).map((category, index) =>
                        <option value={category} key={index}>{category}</option>
                    )}
                </select>
                <div className="dropdown-checkboxes">
                    <label htmlFor="dropdown-children-dp-controller" className="header-label">
                        Features
                        <i className="fa-solid fa-caret-down" />
                    </label>
                    <input id="dropdown-children-dp-controller" type="checkbox" />
                    <div id="features-div" className="children-div">
                        {featuresOfCategory && featuresOfCategory.map((feature, index) =>
                            <label key={index} htmlFor={feature}>
                                <span>{feature}</span>
                                <input name={feature} id={feature} type="checkbox" />
                            </label>
                        )}
                    </div>
                </div>
                <i id="analysis-data-btn" onClick={() => analysisDataHandle()} className="blue-btn fa-solid fa-play" />
                <div id="bubbless" style={{ display: 'none', width: '4rem', height: '1rem' }} className="bubbles">
                    <div className="bubble" />
                    <div className="bubble" />
                    <div className="bubble" />
                </div>
            </div>
            <section>
                <div className="data-div-1">
                    <div className="total-earning">
                        <span className="name">
                            <i className="fa-solid fa-coins" />
                            Total Earning
                        </span>
                        <span className="value add-currency-symbol">{totalEarning}</span>
                    </div>
                    <div className="number-of-orders">
                        <span className="name">
                            <i className="fa-solid fa-box" />
                            Number of Orders
                        </span>
                        <span className="value">{numberOfOrders}</span>
                    </div>
                    <div className="number-of-saled-products">
                        <span className="name">
                            <i className="fa-solid fa-box" />
                            Number of Saled Products
                        </span>
                        <span className="value">{numberOfSaledProducts}</span>
                    </div>
                </div>
                {valueForLineChart?.length > 0 &&
                    <LineChart data={{
                        chartHeader: 'Daily Earnings Chart', values: valueForLineChart, chartValueKey: 'value', horizontalAreaKey: 'date',
                        chartWidth: 1150, chartHeight: 304, backgroundColor: '#f3f4f6', chartColor: 'orange'
                    }} />}
                <div style={{ display: productNumberByCategory == null ? 'none' : '' }} className="charts">
                    <h4><i className="fa-solid fa-chart-column" />Charts</h4>
                    {productNumberByCategory &&
                        <div className="vertical-chart-wrapper">
                            <span className="chart-header">Sold Product Number By Category</span>
                            <div className="chart-body">
                                <div className="vertical-chart" >
                                    {productNumberByCategory?.data?.map((item2, index2) =>
                                        <div className="chart-item" key={index2} style={{ background: item2[3], height: `${item2[2]}%` }} />
                                    )}
                                </div>
                                <div className="chart-values">
                                    {productNumberByCategory?.data?.map((item, index) =>
                                        <div className="values-item" key={index} style={{ height: `${item[2]}%` }}>
                                            <span className="height">{item[2] + '%'}</span>
                                            <span className="name">{item[0].split('-').join(' ')}</span>
                                            <span className="value">{item[1]}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>}
                    {productNumberByFeatures && Object.keys(productNumberByFeatures).map((item, index) =>
                        <div key={index} className="vertical-chart-wrapper">
                            <span className="chart-header">{item}</span>
                            <div className="chart-body">
                                <div className="vertical-chart" >
                                    {productNumberByFeatures[item]?.data?.map((item2, index2) =>
                                        <div className="chart-item" key={index2} style={{ background: item2[3], height: `${item2[2]}%` }} />
                                    )}
                                </div>
                                <div className="chart-values">
                                    {productNumberByFeatures[item]?.data?.map((item2, index2) =>
                                        <div className="values-item" key={index2} style={{ height: `${item2[2]}%` }}>
                                            <span className="height">{item2[2] + '%'}</span>
                                            <span className="name">{item2[0].split('_').join(' ')}</span>
                                            <span className="value">{item2[1]}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div >
    )
}