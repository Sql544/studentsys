import React,{Component} from 'react'
import { Table,Input,Col,Row,Icon,Popconfirm,message,Button,Upload } from 'antd';
import axios from 'axios'
import {connect} from 'react-redux'
const Search = Input.Search;
const EditableCell = ({ editable, value, onChange }) => (
    <div>
        {editable
        ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
        : value
        }
    </div>
);
class TeacherMsg extends Component{
    constructor(props){
        super(props)
        this.state = {
            columns : [],
            data : []
        } 
        var that = this;
        this.prop = {
            name: 'file',
            action: '/bk/index.php/studentsys/excel_teacherMsg',
            showUploadList : false,
            headers: {
              authorization: 'authorization-text',
            },
            onChange(info) {
              if (info.file.status === 'done') {
                  if(info.file.response.ret){
                    message.success(`${info.file.name} file uploaded successfully`);
                    axios({
                        url : '/get/index.php/studentsys/get_teacherMsg_m',
                        method : 'get',
                    }).then((res)=>{
                        if(res.data.ret){
                            that.data = res.data.data;
                            that.setState({
                                data : that.data
                            })
                        }
                    })
                  }else{
                    message.error(`${info.file.name} file uploaded failed`);
                  }
                
              } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
              }
            },
          };
    }
    componentDidMount(){
        if(sessionStorage.getItem('type')==='s'){
            this.columns = [{
                title : '姓名',
                dataIndex : 'name',
                width : 150
            },{
                title : '办公室',
                dataIndex : 'position',
                width : 150
            },{
                title : '职称',
                dataIndex : 'job',
                width : 150
            },{
                title : '办公室电话',
                dataIndex : 'officetel',
                width : 200
            },{
                title : '个人电话',
                dataIndex : 'personaltel',
                width:200
            },{
                title : '邮箱',
                dataIndex : 'email',
                width : 200
            }]
            axios({
                url : '/get/index.php/studentsys/get_teacherMsg',
                mathod : 'get',
            }).then((res)=>{
                if(res.data.ret){
                    this.setState({
                        columns : this.columns,
                        data : res.data.data
                    })
                    this.data = res.data.data
                    this.props.init(this.columns,res.data.data);
                }
            })
        }else{
            this.columns = [{
                title : '姓名',
                dataIndex : 'name',
                width : 100,
                render: (text, record) => this.renderColumns(text, record, 'name'),
                
            },{
                title : '工号',
                dataIndex : 'teacherid',
                width : 150,
                
            },{
                title : '办公室',
                dataIndex : 'position',
                width : 150,
                render: (text, record) => this.renderColumns(text, record, 'position'),
                
            },{
                title : '职称',
                dataIndex : 'job',
                width : 150,
                render: (text, record) => this.renderColumns(text, record, 'job'),
                
            },{
                title : '办公室电话',
                dataIndex : 'officetel',
                width : 200,
                render: (text, record) => this.renderColumns(text, record, 'officetel'),
                
            },{
                title : '个人电话',
                dataIndex : 'personaltel',
                width:200,
                render: (text, record) => this.renderColumns(text, record, 'personaltel'),
                
            },{
                title : '邮箱',
                dataIndex : 'email',
                width : 200,
                render: (text, record) => this.renderColumns(text, record, 'email'),
                
            },{
                title : '操作',
                dataIndex : 'operation',
                key : 'operation',
                width : 200,
                render: (text, record) => {
                    const { editable } = record;
                    if(sessionStorage.getItem('type')==='m'||record.teacherid===sessionStorage.getItem('username')){
                        return (
                            <div className="editable-row-operations">
                              {
                                editable ?
                                  <span>
                                    <a onClick={() => this.save(record.key)}><Icon type="save" style={{ fontSize: 16, color: '#08c' }} /></a>
                                    <Popconfirm title="确定取消编辑吗" onConfirm={() => this.cancel(record.key)}>
                                      <a><Icon type="close-square-o" style={{ fontSize: 16 , color : '#ccc' }} /></a>
                                    </Popconfirm>
                                  </span>
                                  : <span>
                                      <a onClick={() => this.edit(record.key)}><Icon type="edit" style={{ fontSize: 16, color: '#08c' }} /></a>
                                      <Popconfirm title="确定要删除吗" onConfirm={() => this.delete(record.key)}>
                                          <a><Icon type="delete" style={{ fontSize: 16 , color : 'red' }} /></a>
                                      </Popconfirm>
                                  </span>
                              }
                            </div>
                          );
                    }else{
                        return(
                            <div>你没有权限</div>
                        )
                    }
                    
                  },
            }]
            axios({
                url : '/get/index.php/studentsys/get_teacherMsg_m',
                mathod : 'get',
            }).then((res)=>{
                if(sessionStorage.getItem('type')==='m'){
                    if(res.data.ret){
                        this.setState({
                            columns : this.columns,
                            data : res.data.data
                        })
                        this.data = res.data.data
                        this.props.init(this.columns,res.data.data);
                    }
                }else{
                    for(var i=0;i<res.data.data.length;i++){
                        if(res.data.data[i].teacherid===sessionStorage.getItem('username')){
                            var middle = res.data.data[i]
                            res.data.data.splice(i,1);
                            res.data.data.unshift(middle)
                        }
                    }
                    this.setState({
                        columns : this.columns,
                        data : res.data.data
                    })
                    this.data = res.data.data
                    this.props.init(this.columns,res.data.data);
                }
                
            })
        }
        
    }
    handlesearch(value){
        this.data =  Object.assign(this.state.data,this.data);
        this.newdata = this.data.filter(function(item,index){
            if(item.name.indexOf(value)!==-1){
                return true
            }else{
                return false
            }
        })
        this.setState({
            data : this.newdata
        })
        this.props.init(this.columns,this.newdata)
    }
    renderColumns(text, record, column) {
        return (
          <EditableCell
            editable={record.editable}
            value={text}
            onChange={value => this.handleChange(value, record.key, column)}
          />
        );
      }
    handleChange(value, key, column) {
        const newData = [...this.state.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
          target[column] = value;
          this.setState({ data: newData });
        }
      }
      edit(key) {
        const newData = [...this.state.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            this.index = target.key
            target.editable = true;
            this.setState({ data: newData });
        }
      }

      delete(key){
        const newData = [...this.state.data];
        const target = newData.filter(item => key === item.key)[0];
        if(target){
            const index =newData.indexOf(target);
            axios({
                url : '/bk/index.php/studentsys/deleteTeacher',
                data : newData[index],
                method : 'post'
            }).then((res)=>{
                if(res.data.ret){
                    newData.splice(index,1)
                    this.setState({ data : newData})
                    this.data.splice(this.data.indexOf(target),1);
                    message.success('删除成功')
                }else{
                    message.error('删除失败')
                    
                }
            })
        }
        

      }
      save(key) {
        const newData = [...this.state.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target.according = this.index
            axios({
                url: '/bk/index.php/studentsys/updateTeacher',
                method : 'post',
                data : target
            }).then((res)=>{
                if(res.data.ret){
                    delete target.editable;
                    this.setState({ data: newData });
                    this.data = newData.map(item => ({ ...item }));
                    message.success('修改成功')
                }else{
                    message.error('修改失败')
                    
                }
            })
            
        }
      }
      cancel(key) {
        const newData = [...this.state.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
          Object.assign(target, this.data.filter(item => key === item.key)[0]);
          delete target.editable;
          this.setState({ data: newData });
        }
      }
    render(){
        if(this.props.insert.key){
            this.state.data.push(this.props.insert);
            this.props.reset();
        }
        return (
            <div>
                <Row>
                <Col span={20}> 
                    <Search
                        placeholder="输入姓名"
                        style={{ width: 200 ,marginBottom:30}}
                        onSearch={this.handlesearch.bind(this)}
                    />
                </Col>
                <Col span={4}>
                    <Button type="primary" style={{marginRight:10}}>
                         <a href="http://ozet8lhr5.bkt.clouddn.com/老师信息模版.xlsx" style={{color:'white'}}>下载模版</a>
                    </Button>
                    {/* <Modal name="增加" tablelist={this.props.columns}/> */}
                    <Upload {...this.prop}>
                        <Button type="primary">
                        添加
                        </Button>
                    </Upload>
                </Col>
                </Row>
                <Row>
                <Col span={24}>
                    <Table columns={this.props.columns} dataSource={this.state.data} pagination={{ pageSize: 10 }} scroll={{ y: 400 }} />
                </Col>
                </Row>
            </div>
        )
    }
}
export default connect(
    (state)=>{
        return{
            columns : state.columns,
            data : state.data,
            insert : state.insert
        }
    },
    (dispatch)=>{
        return{
            init : function(columns,data){
                dispatch({
                    type : 'init',
                    columns : columns,
                    data : data
                })
            },
            reset : function(){
                dispatch({
                    type : 'addmember',
                    data : {}
                })
            }
        }
    }
)(TeacherMsg)