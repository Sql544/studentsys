import React from 'react'
import { Form, Icon, Input, Button,Col,Radio,message } from 'antd';
import axios from 'axios'
import {connect} from 'react-redux'
import './login.scss'
const PropTypes = require('prop-types');
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
class Login extends React.Component {
    handleSubmit = (event)=>{
        event.preventDefault()
        axios({
            url: '/bk/index.php/studentsys/querylogin',
            data : this.props.form.getFieldsValue(),
            method : 'post',
        }).then((res)=>{
            if(res.data.ret){
                sessionStorage.setItem('username', res.data.data[0].username);
                sessionStorage.setItem('type', res.data.data[0].type);
                this.props.init(res.data.data[0].username,res.data.data[0].type)
                if(res.data.data[0].type==='t'){
                    this.context.router.push('/index/teacherMsg')
                }else{
                    this.context.router.push('/index/mine')
                }
            }else{
                message.error('登陆失败');                
            }
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
          };
        return (
        <Col span={10} offset={7}>
            <div className="loginbox">
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <FormItem>
                            {getFieldDecorator('userName', {
                                rules: [{ required: true, message: 'Please input your username!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
                                )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: 'Please input your Password!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
                                )}
                        </FormItem>
                        <FormItem
                        {...formItemLayout}
                        label="身份"
                        >
                        {getFieldDecorator('type')(
                            <RadioGroup>
                                <Radio value="s">学生</Radio>
                                <Radio value="t">老师</Radio>
                                <Radio value="m">管理员</Radio>
                            </RadioGroup>
                        )}
                        </FormItem>
                        <FormItem
                            wrapperCol={{ span: 8, offset: 10 }}
                        >
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登陆
                            </Button>
                        </FormItem>
                    </Form>
                
                </div>
            </Col>
        )
    }
}

Login.contextTypes = {
    router: PropTypes.object
};
var Logins = connect(
    (state)=>{
        return {
            loginstate : {
                username : state.user,
                type : state.usertype,
            }
        }
    },
    (dispatch)=>{
        return {
            init : function(username,usertype){
                dispatch({
                    type : 'loginstate',
                    usertype : usertype,
                    username : username
                })
            }
            
        }
    }
)(Form.create()(Login))

export default Logins