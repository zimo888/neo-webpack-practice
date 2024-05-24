import './test_css.css'
import './test_less.less'
import './test_scss.scss'
import LOGO from '@src/assets/logo.svg'
import React from 'react'
import ReactDOM from 'react-dom'
import GERRIT from '@src/assets/gerrit.png'
const App =  ()=>{
    return <div>Hello World
        <img src={GERRIT}/>
        <LOGO style={{width: 40, height: 40}}/>
    </div>
}

ReactDOM.render(<App/>, document.getElementById('root'))