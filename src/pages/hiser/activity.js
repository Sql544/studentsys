import React from 'react'
import axios from 'axios'
import { Table,Input,Col,Row,Button,Modal,Form,Popconfirm,message} from 'antd';
const { TextArea } = Input;
const FormItem = Form.Item;
const Search = Input.Search;

class Activity extends React.Component{
    constructor(){
        super();
        this.state = {
            data : [{
                key : 1,
                theme : 'asd',
               
            }],
            columns : [{
                title : '活动主题',
                dataIndex : 'theme',
                key : 'theme',
                width : 600
            },{
                title : '操作',
                dataIndex : 'operation',
                key : 'operation',
                width : 200,
                render: (text, record)=> {return(
                    <div>
                    <Button type="primary" onClick={() => this.seedetails(record)}>查看</Button>
                    {
                        sessionStorage.getItem('type')==='s'?null:
                        <span style={{marginLeft:20}}>
                        <Popconfirm title="确定要删除吗" onConfirm={() => this.delete(record)}>
                            <Button type="danger" >删除</Button>
                        </Popconfirm>
                    </span>
                    }
                    
                    </div>
                )}
            }],
            visible : false,
            type : '',
            buttonvalue : '确认修改',
            title : '活动详情'
        }
    }
    seedetails = (record)=>{
        this.setState({
            visible : true,
            type : 'see',
            title :'活动详情',
            buttonvalue : '确认修改'
        })
        this.target = this.data.filter((item)=>{
            return item.key===record.key
        })[0];
        this.index = this.target.key;
        this.props.form.setFieldsValue({
            'theme' : this.target.theme,
            'datetime' : this.target.datetime,
            'position' : this.target.position,
            'content' : this.target.content,
        })
    }
    delete = (record)=>{
        axios({
            url : '/bk/index.php/studentsys/deleteHiserActivity',
            method : 'post',
            data: record
        }).then((res)=>{
            if(res.data.ret){
                message.success('删除成功');
                this.data = this.data.filter((item)=>{
                    return item.key!==record.key
                })
                this.setState({
                    data : this.data
                })
            }else{
                message.error('删除失败');
                
            }
        })
    }
    handleCancel = ()=>{
        this.setState({
            visible : false
        })
    }
    componentDidMount(){
        axios({
            url : '/get/index.php/studentsys/getHiserActivity'
        }).then((res)=>{
            if(res.data.ret){
                this.data = res.data.data;
                this.setState({
                    data : res.data.data.reverse()
                })
            }
        })
    }
    handlesearch(value){
        this.data =  Object.assign(this.state.data,this.data);
        this.newdata = this.data.filter(function(item,index){
            if(item.theme.indexOf(value)!==-1){
                return true
            }else{
                return false
            }
        })
        this.setState({
            data : this.newdata
        })
    }
    handlesubmit = ()=>{
        if(this.state.type === 'see'){
            this.datalist = this.props.form.getFieldsValue();
            this.datalist.key = this.index;
            var newarr = this.datalist;
            newarr.according = this.index;
            axios({
                url : '/bk/index.php/studentsys/updateHiserActivity',
                data : newarr,
                method : 'post'
            }).then((res)=>{
                if(res.data.ret){
                    message.success('修改成功');
                    for(var i=0;i<this.data.length;i++){
                        if(this.data[i].key === this.index){
                            this.data[i] = this.datalist
                        }
                    }
                    this.setState({
                        data : this.data,
                        visible : false
                    })
                }else{
                    message.success('修改失败');
                }
            })
        }else{
            this.datalist = this.props.form.getFieldsValue();
            this.datalist.key=Number(this.data[this.data.length-1].key)+1;
            axios({
                url : '/bk/index.php/studentsys/addHiserActivity',
                data : this.datalist,
                method : 'post'
            }).then((res)=>{
                if(res.data.ret){
                    message.success('添加成功');
                    this.data.unshift(this.datalist);
                    this.setState({
                        data : this.data,
                        visible: false
                    })
                }else{
                    message.error('添加失败');
                    
                }
            })
        }
    }
    addmember = ()=>{
        this.props.form.resetFields();
        this.setState({
            visible : true,
            type : 'add',
            title :'添加活动',
            buttonvalue : '确认添加'
        })
        
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        return (
            <div>
                <Row>
                <Col span={22}> 
                    <Search
                        placeholder="输入主题"
                        style={{ width: 200 ,marginBottom:30}}
                        onSearch={this.handlesearch.bind(this)}
                    />
                </Col>
                <Col span={2}>
                {   
                    sessionStorage.getItem('type')==='s'?
                    null : 
                    <Button type="primary" onClick={this.addmember}>增加</Button>
                }
                </Col>
                </Row>
                
                <Row>
                <Col span={24}>
                    <Table columns={this.state.columns} dataSource={this.state.data} pagination={{ pageSize: 10 }} scroll={{ y: 400 }} />
                </Col>
                </Row>
                <Modal
                    visible={this.state.visible}
                    title={this.state.title}
                    onCancel={this.handleCancel}
                    footer={[]}
                >
                    <Form onSubmit={this.handlesubmit}>
                        <FormItem
                            key={1}
                            {...formItemLayout}
                            label='活动主题'
                        >
                        {getFieldDecorator('theme')(<Input disabled={sessionStorage.getItem('type')==='s'} placeholder={`请输入活动主题`} />)}
                        </FormItem>
                        <FormItem
                            key={2}
                            {...formItemLayout}
                            label='活动时间'
                        >
                        {getFieldDecorator('datetime')(<Input disabled={sessionStorage.getItem('type')==='s'} placeholder={`请输入活动时间`} />)}
                        </FormItem>
                        <FormItem
                            key={3}
                            {...formItemLayout}
                            label='活动地点'
                        >
                        {getFieldDecorator('position')(<Input disabled={sessionStorage.getItem('type')==='s'} placeholder={`请输入活动地点`} />)}
                        </FormItem>
                        <FormItem
                            key={4}
                            {...formItemLayout}
                            label='活动内容'
                        >
                        {getFieldDecorator('content')(<TextArea disabled={sessionStorage.getItem('type')==='s'} autosize={{ minRows: 3, maxRows: 6 }} placeholder={`请输入活动内容`} />)}
                        </FormItem>
                        {   
                            sessionStorage.getItem('type')==='s'?
                            null : 
                        <FormItem
                            wrapperCol={{ span: 8, offset: 11 }}
                        >
                            <Button type="primary" htmlType="submit">
                                {this.state.buttonvalue}
                            </Button>
                        </FormItem>
                        }
                    </Form>
                </Modal>
            </div>
        )
    }
}
export default Form.create()(Activity);