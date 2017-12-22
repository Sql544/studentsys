import React from 'react'
import { Form, Input,Button,message } from 'antd';
import {connect} from 'react-redux'
import axios from 'axios'
const FormItem = Form.Item;

class Formbox extends React.Component {
    
    handlesubmit = () => {
        this.datalist = this.props.form.getFieldsValue()
        this.datalist.key=Number(this.props.data[this.props.data.length-1].key)+1;
        // let currentlist = this.props.data.concat([this.datalist])
        if(this.props.columns[2].dataIndex==='stuid'){
            axios({
                url : 'bk/index.php/studentsys/addStu',
                data : this.datalist,
                method : 'post'
            }).then((res)=>{
                if(res.data.ret){
                    this.props.submit(this.datalist);
                    this.props.form.resetFields();
                    message.success('添加成功')
                }else{
                    message.error('添加失败')
                }
            })
        }else if(this.props.columns[0].dataIndex==='holiday'){
            axios({
                url : 'bk/index.php/studentsys/addHoliday',
                data : this.datalist,
                method : 'post'
            }).then((res)=>{
                if(res.data.ret){
                    this.props.submit(this.datalist);
                    this.props.form.resetFields();
                    message.success('添加成功')
                }else{
                    message.error('添加失败')
                }
            })
        }else if(this.props.columns[0].dataIndex==='name'){
            axios({
                url : 'bk/index.php/studentsys/addTeacher',
                data : this.datalist,
                method : 'post'
            }).then((res)=>{
                if(res.data.ret){
                    this.props.submit(this.datalist);
                    this.props.form.resetFields();
                    message.success('添加成功')
                }else{
                    message.error('添加失败')
                }
            })
        }else if(this.props.columns[0].dataIndex==='stuname'){
            axios({
                url : 'bk/index.php/studentsys/addstuScore',
                data : this.datalist,
                method : 'post'
            }).then((res)=>{
                if(res.data.ret){
                    this.props.submit(this.datalist);
                    this.props.form.resetFields();
                    message.success('添加成功')
                }else{
                    message.error('添加失败')
                }
            })
        }else if(this.props.columns[0].dataIndex==='stdname'){
            axios({
                url : 'bk/index.php/studentsys/addstuPrize',
                data : this.datalist,
                method : 'post'
            }).then((res)=>{
                if(res.data.ret){
                    this.props.submit(this.datalist);
                    this.props.form.resetFields();
                    message.success('添加成功')
                }else{
                    message.error('添加失败')
                }
            })
        }else if(this.props.columns[0].dataIndex==='hisername'){
            axios({
                url : 'bk/index.php/studentsys/addHiserMember',
                data : this.datalist,
                method : 'post'
            }).then((res)=>{
                if(res.data.ret){
                    this.props.submit(this.datalist);
                    this.props.form.resetFields();
                    message.success('添加成功')
                }else{
                    message.error('添加失败')
                }
            })
        }
        
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        return (
            
            <Form onSubmit={this.handlesubmit}>
                {
                    this.props.columns.filter((item,index)=>item.dataIndex!=='operation').map((item, index) => {
                        return (
                            <FormItem
                                key={index}
                                {...formItemLayout}
                                label={item.title}
                            >
                            {getFieldDecorator(item.dataIndex)(<Input placeholder={`请输入${item.title}`} />)}
                            </FormItem>
                        )
                    })
                }

                <FormItem
                    wrapperCol={{ span: 8, offset: 11 }}
                >
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                </FormItem>
            </Form>
        )
    }
}
export default connect(
    (state)=>{
        return {
            columns : state.columns,
            data : state.data,
            insert : state.insert
        }
    },
    (dispatch)=>{
        return {
            submit : function(datalist){
                dispatch({
                    type : 'addmember',
                    data : datalist,
                })
            }
        }
    }
)(Form.create()(Formbox))