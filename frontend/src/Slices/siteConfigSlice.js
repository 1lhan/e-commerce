import { createSlice } from "@reduxjs/toolkit";

const categories = {
    telephone: ['mobile-phone', 'tablet', 'smart-watch'],
    computer: ['notebook', 'desktop-computer'],
    'tv, video, voice': ['television', 'headphone'],
    'computer-components': ['processor', 'mainboard', 'graphic-card', 'hdd', 'ssd', 'ram']
}
const featuresByCategory = {
    'mobile-phone': {
        brand: ['Apple', 'Huawei', 'Samsung', 'Xiaomi', 'Oppo', 'Reeder'],
        color: ['White', 'Black', 'Blue', 'Gold', 'Grey'],
        'screen-size': ['2.40_inch-5.00_inch', '5.1_inch-6.5_inch', '6.6_inch-6.78_inch', '6.78+_inch'],
        memory: ['16_GB', '32_GB', '64_GB', '128_GB', '256_GB'],
        'ram-size': ['3_GB', '4_GB', '6_GB', '8_GB'],
        'camera-resolution': ['0.3_MP-1.5_MP', '1.6_MP-5_MP', '6_MP-12_MP', '12+_MP'],
        battery: ['0-1999_mAh', '2000-3999_mAh', '4000-4999_mAh', '5000-5999_mAh', '6000+_mAh']
    },
    tablet: {}, 'smart-watch': {}, notebook: {}, 'desktop-computer': {}, television: {}, headphone: {}, processor: {}, mainboard: {
        compatibility: ['AMD_Compatible','Intel_Compatible'],
        brand: ['ASUS', 'GIGABYTE', 'MSI'],
        'mainboard-structure': ['ATX', 'Extended_ATX', 'Micro_ATX', 'Mini_ITX'], chipset: ['AMD_A320', 'AMD_A620', 'AMD_B650', 'AMD_A320', 'AMD_A520', 'AMD_A620', 'AMD_B450', 'AMD_B550',
            'AMD_B650', 'AMD_X570', 'AMD_X670', 'Intel_H470', 'Intel_H610', 'Intel_B365', 'Intel_B460', 'Intel_B560',
            'Intel_B660', 'Intel_B760', 'Intel_H310', 'Intel_H510', 'Intel_H610', 'Intel_H770', 'Intel_Z590', 'Intel_Z690', 'Intel_Z790'],
        'ram-type': ['DDR4', 'DDR5'],
        'socket-type': ['Socket_1151-V.2', 'Socket_1200', 'Socket_1700', 'Socket_AM4', 'Socket_AM5'],
        'ram-slot-number': ['2', '4'],
    }, 'graphic-card': {}, hdd: {}, ssd: {}, ram: {}
}


export const siteConfigSlice = createSlice({
    name: 'categories',
    initialState: {
        url: 'http://localhost:5000',
        siteName: 'e-commerce',
        categories,
        featuresByCategory
    },
    reducers: {
        dynamicTitle: (state, action) => {
            let _title = action.payload
            let title = [];

            if (action.payload.includes('-')) {
                _title = _title.split('-')
                for (let i in _title) {
                    title.push(_title[i].charAt(0).toUpperCase() + _title[i].slice(1))
                }
                title = title.join(' ')
            }
            else title = _title.charAt(0).toUpperCase() + _title.slice(1)

            document.title = title
        }
    }
})

export const { dynamicTitle } = siteConfigSlice.actions
export default siteConfigSlice.reducer

/*
getAllSubCategories
let _categories = []
for (let i in Object.keys(state.categories)) {
    for (let j in Object.keys(state.categories[Object.keys(state.categories)[i]])) {
        _categories.push(Object.keys(state.categories[Object.keys(state.categories)[i]])[j])
    }
}
return _categories
*/
