import { useEffect, useState } from "react"

export default function LineChart(data) {
    // chart'ın kullanılacağı componentteki kullanım şekli
    // {valueForLineChart?.length > 0 && <LineChart data={{ chartHeader: 'Daily Earnings Chart', values: valueForLineChart, chartValueKey: 'value', horizontalAreaKey: 'date' }} />}

    // values = [{ value: 1968.84, date: '04.10.2023' }, { value: 1983.66, date: '05.10.2023' }, { value: 1950.67, date: '06.10.2023' }, { value: 1978.09, date: '07.10.2023' }]
    // chartValueKey = charttaki noktaların _values içindeki obje içerisinden hangi değere göre ayarlanacağının seçilmesi
    // horizontalAreaKey = charttaki yatay alandaki değerlerin _values içindeki obje içerisinden hangi değere göre ayarlanacağının seçilmesi
    // chartta gösterilecek değerler için bu durumda (_chartValueKey:'value', _horizontalAreaKey:'date') olur

    const [chartData, setChartData] = useState({})
    const [chartPopUp, setChartPopUp] = useState({})

    /*
    const values = [{ value: 1968.84, date: '04.10.2023' }, { value: 1983.66, date: '05.10.2023' }, { value: 1950.67, date: '06.10.2023' }, { value: 1978.09, date: '07.10.2023' },
    { value: 2303.91, date: '08.10.2023' }, { value: 2420.27, date: '09.10.2023' }, { value: 2539.63, date: '10.10.2023' }]
    */

    const lineChart = (_values, _chartValueKey, _chartWidth, _chartHeight) => {
        console.log(_values)
        // values : chart'ta nokta olarak gözükecek değerler
        // labels : chart'taki noktaların üzerine gelince pop-up şeklinde gözükecek veriler
        // verticalPoints : chart'ın solundaki değerler(7 tane)
        // stylesOfValues : chart'taki nokta olarak gözükecek değerlerin chart'ın yukarısından ne kadar uzaklığa sahip olacağına ait değerler
        // lines : iki nokta arasındaki çizgilerin css özellikleri
        let dataForChart = { values: _values, verticalPoints: [], stylesOfValues: [], lines: [] }

        // tabloda dikey tarafta 7 tane nokta olacak. En yüksek ve en düşük değeri bulmak için değerler büyükten küçüğe sıralanır.
        let sortedValues = dataForChart.values.slice(0).sort((a, b) => b[_chartValueKey] - a[_chartValueKey])
        let lowestValue = sortedValues[sortedValues.length - 1][_chartValueKey]
        let highestValue = sortedValues[0][_chartValueKey]

        // chartın sol tarafı en için en yüksek ve en düşük değerlerin yuvarlanarak oluşturulması
        let lowestChartPoint = lowestValue + ((highestValue - lowestValue) / 4) * -1
        let highestChartPoint = lowestValue + ((highestValue - lowestValue) / 4) * 5

        lowestChartPoint = lowestChartPoint - (lowestChartPoint % Math.pow(10, lowestChartPoint.toFixed(0).length - 2))
        highestChartPoint = highestChartPoint - (highestChartPoint % Math.pow(10, highestChartPoint.toFixed(0).length - 2)) + Math.pow(10, highestChartPoint.toFixed(0).length - 2)

        let difference = ((highestChartPoint - lowestChartPoint) / 6)
        difference = difference - (difference % Math.pow(10, difference.toFixed(0).length - 2)) + Math.pow(10, difference.toFixed(0).length - 2)

        // grafiğin solundaki dikey alandaki değerlerin oluşturulması
        for (let i = 0; i <= 6; i++) {
            dataForChart.verticalPoints.push((lowestChartPoint + (difference * i)).toFixed(2))
        }
        dataForChart.verticalPoints.reverse()

        highestChartPoint = (Number(dataForChart.verticalPoints[0]))

        //charttaki değerlerin chartın yukarısından ne kadar uzaklığa sahip olacağının belirlenmesi
        for (let i in dataForChart.values) {
            let top = ((highestChartPoint - dataForChart.values[i][_chartValueKey]) / (highestChartPoint - lowestChartPoint)) * 100
            dataForChart.stylesOfValues.push({ top })
        }

        //chartın genişliği ve yüksekliği
        let chartWidth = _chartWidth * 0.9
        let chartHeight = (_chartHeight * 0.875) * 0.8

        //chartta 2 nokta arasındaki çizgilerin belirlenmesi. iki nokta arasında bir üçgen varmış gibi hayal edilir
        for (let i = 0; i < dataForChart.values.length - 1; i++) {
            // bu üçgenin dikey kenarı 2 nokta arasındaki top değerlerin(noktanın yukardan uzaklığı) farkıdır
            let verticalSideLength = dataForChart.stylesOfValues[i + 1].top - dataForChart.stylesOfValues[i].top
            verticalSideLength = chartHeight * (verticalSideLength * 0.01)

            //yatay kenar, chartın genişliği / charttaki toplam değer sayısı
            let horizontalSideLength = chartWidth / dataForChart.values.length

            let hipotenus = Math.sqrt(verticalSideLength * verticalSideLength + horizontalSideLength * horizontalSideLength)

            // degree : dikey kenar / hipotenüsün arcsin'i alınır  = arcsin(dikey kenar/ hipotenüs) * 180/pi
            dataForChart.lines.push({
                degree: Math.asin(verticalSideLength / hipotenus) * 180 / Math.PI,
                width: hipotenus,
                top: dataForChart.stylesOfValues[i].top,
                left: (((100 / dataForChart.values.length) * i) + ((100 / dataForChart.values.length) / 2))
            })
        }

        setChartData(dataForChart)
    }

    useEffect(() => {
        lineChart(data.data.values, data.data.chartValueKey, data.data.chartWidth, data.data.chartHeight)
    }, [])

    return (
        <div className="container">
            {chartData &&
                <div className="line-chart-wrapper">
                    <div style={{ backgroundColor: data.data.backgroundColor }} className="chart-header">
                        <span className="header">
                            <i style={{ color: data.data.chartColor }} className="fa-solid fa-chart-line" />
                            <span>{data.data.chartHeader}</span>
                        </span>
                        <div className="buttons">
                            <button style={{ backgroundColor: data.data.chartColor }}
                                onClick={() => lineChart(data.data.values.slice(-7), data.data.chartValueKey, data.data.chartWidth, data.data.chartHeight)}>7</button>
                            <button style={{ backgroundColor: data.data.chartColor }}
                                onClick={() => lineChart(data.data.values.slice(-15), data.data.chartValueKey, data.data.chartWidth, data.data.chartHeight)}>15</button>
                            <button style={{ backgroundColor: data.data.chartColor }}
                                onClick={() => lineChart(data.data.values.slice(-30), data.data.chartValueKey, data.data.chartWidth, data.data.chartHeight)}>30</button>
                            <button style={{ backgroundColor: data.data.chartColor }}
                                onClick={() => lineChart(data.data.values, data.data.chartValueKey, data.data.chartWidth, data.data.chartHeight)}>All</button>
                        </div>
                    </div>
                    <div style={{ background: data.data.backgroundColor }} className="chart-body">
                        <div className="vertical-points">
                            {chartData?.verticalPoints?.map((item, index) =>
                                <span style={{ display: index == 0 || index == 6 ? 'none' : '' }} key={index}>{item}</span>
                            )}
                        </div>
                        <div className="chart-right-side">
                            <div id="chart" className="chart">
                                {chartPopUp && chartPopUp.content &&
                                    <div style={{ top: (chartPopUp.top + 2) + '%', left: (((100 / chartData.values.length) * chartPopUp.index) + ((100 / chartData.values.length) / 2)) + '%' }} className="chart-pop-up">
                                        {Object.keys(chartPopUp.content).map((item, index) =>
                                            <div key={index}>
                                                <span>{Object.keys(chartPopUp.content)[index]}</span>
                                                <span>{Object.values(chartPopUp.content)[index]}</span>
                                            </div>
                                        )}
                                    </div>
                                }
                                { }
                                <div className="values">
                                    {chartData?.values?.map((item, index) =>
                                        <div key={index} style={{ width: (100 / chartData.values.length) + '%' }} className="value-wrapper">
                                            <span className="value"
                                                style={{ backgroundColor: data.data.chartColor, top: chartData.stylesOfValues[index].top + '%' }} >
                                                <span className="value-children"
                                                    onMouseMove={() => setChartPopUp({ top: chartData.stylesOfValues[index].top, index, content: chartData.values[index] })}
                                                    onMouseLeave={() => setChartPopUp({})} />
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="chart-lines-wrapper">
                                    <div className="chart-lines">
                                        {chartData?.lines?.map((item, index) =>
                                            <span className="line" key={index}
                                                style={{
                                                    backgroundColor: data.data.chartColor,
                                                    top: item.top + '%',
                                                    width: item.width + 'px',
                                                    left: item.left + '%',
                                                    transform: `rotate(${item.degree}deg) translateY(-50%)`
                                                }} />
                                        )}
                                    </div>
                                </div>

                                <div className="horizontal-back-lines">
                                    {[...Array(6)].map((line, index) =>
                                        <span key={index} className="line"></span>
                                    )}
                                </div>

                                <div className="vertical-back-lines">
                                    {[...Array(7)].map((line, index) =>
                                        <span key={index} className="line"></span>
                                    )}
                                </div>
                            </div>
                            <div className="horizontal-points">
                                {chartData?.values?.map((item, index) =>
                                    <span key={index}
                                        style={{
                                            visibility: (index) % Math.floor((chartData.values.length) / 7) == 0 || chartData.values.length <= 7 ? '' : 'hidden',
                                            width: (100 / chartData.values.length) + '%'
                                        }}>
                                        {item.date}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div >
    )
}
