import React,{Component} from 'react'
import { Upload,Button,Col,Table,Row,Input,Popconfirm,Icon,message } from 'antd';
import {connect} from 'react-redux'
import axios from 'axios'
import './mine.scss'
var async = require('async')
const Search = Input.Search;
const EditableCell = ({ editable, value, onChange }) => (
    <div>
        {editable
        ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
        : value
        }
    </div>
);

class Mine extends Component{
    constructor(props){
        super(props);
        this.state = {
            name : '',
            class : '',
            stuid : '',
            volunteertime : 0,
            score : [],
            prize : [],
            data : []
        }
        var that = this;
        this.prop = {
            name: 'file',
            action: '/bk/index.php/studentsys/getexcel',
            showUploadList : false,
            headers: {
              authorization: 'authorization-text',
            },
            onChange(info) {
              if (info.file.status === 'done') {
                  if(info.file.response.ret){
                    message.success(`${info.file.name} file uploaded successfully`);
                    axios({
                        url : '/get/index.php/studentsys/getAllstuMsg',
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
    
    handlesearch(value){
        this.data =  Object.assign(this.state.data,this.data);
        this.newdata = this.data.filter(function(item,index){
            if(item.name.indexOf(value)!==-1||item.class.indexOf(value)!==-1||item.stuid.indexOf(value)!==-1){
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
    componentDidMount(){
        if(sessionStorage.getItem('type')==='s'){
            async.parallel([
                (cb) => {
                    axios({
                        url : '/bk/index.php/studentsys/getStdMsg',
                        method : 'post',
                        data : {
                            username : sessionStorage.getItem('username')
                        }
                    }).then((res)=>{
                        if(res.data.ret){
                            this.setState({
                                stuid : res.data.data[0].stuid,
                                name : res.data.data[0].name,
                                class : res.data.data[0].class,
                                volunteertime : res.data.data[0].volunteertime                
                            })
                            cb(null, 'one')
                        }
                        
                    })
                },
                (cb) =>{
                    axios({
                        url : '/bk/index.php/studentsys/get_grades',
                        method : 'post',
                        data : {
                            stuid : sessionStorage.getItem('username')
                        }
                    }).then((res)=>{
                        if(res.data.ret){
                            this.setState({
                                score : res.data.data                
                            })
                            cb(null,'one')
                        }
                        
                    })
                },
                (cb) =>{
                    axios({
                        url : '/bk/index.php/studentsys/get_prize',
                        method : 'post',
                        data : {
                            stuid : sessionStorage.getItem('username')
                        }
                    }).then((res)=>{
                        if(res.data.ret){
                            this.setState({
                                prize : res.data.data                
                            })
                            cb(null,'one')
                        }
                        
                    })
                }
            ],function(err,res){
            })
            // axios({
            //     url : '/bk/index.php/studentsys/getStdMsg',
            //     method : 'post',
            //     data : {
            //         username : sessionStorage.getItem('username')
            //     }
            // }).then((res)=>{
            //     if(res.data.ret){
            //         this.setState({
            //             stuid : res.data.data[0].stuid,
            //             name : res.data.data[0].name,
            //             class : res.data.data[0].class,
            //             volunteertime : res.data.data[0].volunteertime                
            //         })
            //     }
                
            // })
            // axios({
            //     url : '/bk/index.php/studentsys/get_grades',
            //     method : 'post',
            //     data : {
            //         stuid : sessionStorage.getItem('username')
            //     }
            // }).then((res)=>{
            //     if(res.data.ret){
            //         this.setState({
            //             score : res.data.data                
            //         })
            //     }
                
            // })
            // axios({
            //     url : '/bk/index.php/studentsys/get_prize',
            //     method : 'post',
            //     data : {
            //         stuid : sessionStorage.getItem('username')
            //     }
            // }).then((res)=>{
            //     if(res.data.ret){
            //         this.setState({
            //             prize : res.data.data                
            //         })
            //     }
                
            // })
        }else{
            this.columns = [{
                title : '姓名',
                dataIndex : 'name',
                key : 'name',
                width : 150,
                render: (text, record) => this.renderColumns(text, record, 'name'),
            },{
                title : '班级',
                dataIndex : 'class',
                key : 'class',
                width : 150,
                render: (text, record) => this.renderColumns(text, record, 'class'),
            },{
                title : '学号',
                dataIndex : 'stuid',
                key : 'stuid',
                width : 200,
                render: (text, record) => this.renderColumns(text, record, 'stuid'),
            },{
                title : '志愿者时数',
                dataIndex : 'volunteertime',
                key : 'volunteertime',
                width : 150,
                render: (text, record) => this.renderColumns(text, record, 'volunteertime'),
            },{
                title : '操作',
                dataIndex : 'operation',
                key : 'operation',
                width : 200,
                render: (text, record) => {
                    const { editable } = record;
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
                  },
            }]
            axios({
                url : '/get/index.php/studentsys/getAllstuMsg',
                method : 'get',
            }).then((res)=>{
                if(res.data.ret){
                    this.data = res.data.data;
                    this.setState({
                        data : this.data
                    })
                    this.props.init(this.columns,res.data.data);
                }
                
            })
        }            
        
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
        this.index = target.stuid
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
                url : '/bk/index.php/studentsys/deleteStuMsg',
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
      extend = (record)=>{
        return (
            <p>{record.name}</p>
        )
    }
      save(key) {
        const newData = [...this.state.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target.according = this.index
            axios({
                url: '/bk/index.php/studentsys/updateStuMsg',
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
        if(sessionStorage.getItem('type')==='s'){
            const columns = [{
                title: '学年',
                dataIndex: 'term',
                key: 'term',
              }, {
                title: '绩点',
                dataIndex: 'score',
                key: 'score',
              }];
                    
              const columns1 = [{
                    title: '获奖时间',
                    dataIndex: 'gettime',
                    key: 'gettime',
                  }, {
                    title: '奖项',
                    dataIndex: 'item',
                    key: 'item',
                },{
                    title : '级别',
                    dataIndex: 'level',
                    key : 'level'
                }]
            return (
                <div className='mine'>
                    <Col span={16}>
                        <div className='message'>
                        <Row>
                            <Col span={6}>
                                <p>姓名:</p>
                            </Col>
                            <Col span={18}>
                            <p>{this.state.name}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>
                                <p>班级:</p>
                            </Col>
                            <Col span={18}>
                            <p>{this.state.class}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>
                                <p>学号:</p>
                            </Col>
                            <Col span={18}>
                            <p>{this.state.stuid}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>
                                <p>志愿者时数:</p>
                            </Col>
                            <Col span={18}>
                            <p>{this.state.volunteertime}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>
                                <p>绩点:</p>
                            </Col>
                            <Col span={18}>
                            <Table dataSource={this.state.score} pagination={false} columns={columns} size="small" style={{width:500}} scroll={{x : false ,y:100}}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>
                                <p>获奖情况:</p>
                            </Col>
                            <Col span={18}>
                            <Table dataSource={this.state.prize} pagination={false} columns={columns1} size="small" style={{width:500,textAlign:'center'}} scroll={{x : false ,y:100}} />
                            </Col>
                        </Row>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className='image'>
                            <img src="./images/xzl.jpeg" alt="xzl"></img>
                        </div>
                    </Col>
                    
                    
                </div>
            )
        }else if(sessionStorage.getItem('type')==='m'){
            if(this.props.insert.key){
                this.state.data.push(this.props.insert);
                this.props.reset();
            }
            return (
                <div>
                    <Row>
                    <Col span={20}> 
                        <Search
                            placeholder="输入姓名或班级或学号查找"
                            style={{ width: 200 ,marginBottom:30}}
                            onSearch={this.handlesearch.bind(this)}
                        />
                    </Col>
                    <Col span={4}>
                        <Button type="primary" style={{marginRight:10}}>
                             <a href="http://ozet8lhr5.bkt.clouddn.com/学生信息模版.xlsx" style={{color:'white'}}>下载模版</a>
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
                        <Table columns={this.columns} dataSource={this.state.data} pagination={{ pageSize: 10 }} scroll={{ y: 400 }} />
                    </Col>
                    </Row>
                </div>
            )
        }else{
            return(
            <div>
            <Row>
            <Col span={20}> 
                <Search
                    placeholder="输入姓名或班级或学号查找"
                    style={{ width: 200 ,marginBottom:30}}
                    onSearch={this.handlesearch.bind(this)}
                />
            </Col>
            </Row>
            <Row>
            <Col span={24}>
                <Table columns={this.columns} dataSource={this.state.data} pagination={{ pageSize: 10 }} scroll={{ y: 400 }} />
            </Col>
            </Row>
        </div>)
        }
        
    }
}
export default connect(
    (state)=>{
        return {
            columns : state.columns,
            data : state.data,
            insert : state.insert,            
            loginstate : {
                username : state.user,
                type : state.usertype
            }
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
)(Mine)