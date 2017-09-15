import React, { Component } from 'react'
import texts from './test'
import styles from './geen.css';
import "./sty.less"
import bgimg from './pj.png'

class Geen extends Component{
    render(){
        return (
            <div className="b">
                {texts.textContext}
                <img src={bgimg} alt=""/>
            </div>
        )
    }
}
export default Geen;