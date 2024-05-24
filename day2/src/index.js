import './test_css.css'
import './test_less.less'
import './test_scss.scss'
import LOGO from './assets/logo.svg'
import React from 'react'
import ReactDOM from 'react-dom'
const App =  ()=>{
    return <div>Hello World

        <LOGO style={{width: 40, height: 40}}/>
    </div>
}

ReactDOM.render(<App/>, document.getElementById('root'))