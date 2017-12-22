import React from 'react'
import Index from '../pages/index'
import Mine from '../pages/mine/mine'
import Layout from '../pages/layout/layout'
import Table from '../pages/table/table'
import Holiday from '../pages/holiday/holiday'
import TeacherMsg from '../pages/teacherMsg/teacherMsg'
import Login from '../pages/login/login'
import Grade from '../pages/grade/grade'
import Prize from '../pages/prize/prize'
import Postmessage from '../pages/postmessage/postmessage'
import GetPostmessage from '../pages/postmessage/getpostmessage'
import Activity from '../pages/hiser/activity'
import HiserMember from '../pages/hiser/member'
import Meeting from '../pages/hiser/meeting'
import Upload from '../pages/uploadfiles/uploadfile'
import Files from '../pages/uploadfiles/files'

import '../styles/index.scss'

import {Router,Route,hashHistory,IndexRedirect} from 'react-router'
class App extends React.Component{
    render(){
        return(
            
                <Router history={hashHistory}>
                    <Route path='/' component={Index}>
                        <IndexRedirect to='/login'></IndexRedirect>
                        <Route path='index' component={Layout}>
                            <Route path='/index/mine' component={Mine}></Route>
                            <Route path='/index/table' component={Table}></Route>
                            <Route path='/index/holiday' component={Holiday}></Route>
                            <Route path='/index/teacherMsg' component={TeacherMsg}></Route>
                            <Route path='/index/grade' component={Grade}></Route>
                            <Route path='/index/prize' component={Prize}></Route>
                            <Route path='/index/postMessage' component={Postmessage}></Route>
                            <Route path='/index/getpostMessage' component={GetPostmessage}></Route>
                            <Route path='/index/activity' component={Activity}></Route>
                            <Route path='/index/hiserMsg' component={HiserMember}></Route>
                            <Route path='/index/meeting' component={Meeting}></Route>
                            <Route path='/index/upload' component={Upload}></Route>
                            <Route path='/index/files' component={Files}></Route>
                        </Route>
                        <Route path='login' component={Login}></Route>
                    </Route>
                </Router>
            
        )
    }
}

export default App