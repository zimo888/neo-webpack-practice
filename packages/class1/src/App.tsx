import React from 'react'
import Paid from '@src/assets/account.svg'
import './App.scss'
import AI from '@src/assets/ai.png'
export default ()=>{
    return <div>
        <div>
            <Paid width="100" height="100"/>
        </div>
        <div className="app">自定义字体测试</div>
        <div>
            <img src={AI} />
        </div>
    </div>
}