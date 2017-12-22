import React from 'react'
import '../styles/index.scss'

class Index extends React.Component{
    render(){
        return (
                <div className="container">
                    {this.props.children}
                </div>
        )
    }
}
export default Index