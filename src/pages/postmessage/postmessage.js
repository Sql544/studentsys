import React from 'react'
import { Input,Radio,Button,message,Col,Row,Icon,Popconfirm,Table,AutoComplete } from 'antd';
import axios from 'axios'
import './postmessage.scss'
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const Search = Input.Search;
const EditableCell = ({ editable, value, onChange }) => (
    <div>
        {editable
        ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
        : value
        }
    </div>
);
class postMessage extends React.Component{
    constructor(){
        super()
        this.state = {
            dataSource:[],
            value : 1,
            inputvalue : '',
            data : [],
            targetValue : '其他',
            columns : [{
                title : '提交上来的舆情',
                dataIndex : 'message',
                key : 'message',
                width : 300,
            },{
                title : '回复',
                dataIndex : 'solution',
                key : 'solution',
                width : 300,
                render: (text, record) => this.renderColumns(text, record, 'solution'),
            },{
                title : '提交人',
                dataIndex : 'username',
                key : 'username',
                width : 100,
            },{
                title : '提交对象',
                dataIndex : 'target',
                key : 'target',
                width : 100,
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
        }
    }
    componentDidMount(){
        
        if(sessionStorage.getItem('type')==='s'){
            axios({
                url : '/get/index.php/studentsys/getTarget'
            }).then((res)=>{
                if(res.data.ret){
                    var dataSource = [];
                    for(var i in res.data.data){
                        dataSource.push(res.data.data[i].name)
                    }
                    dataSource =dataSource.concat(['学院','团学社','其他'])
                    this.setState({
                        dataSource : dataSource
                    })
                }
            })
        }else if(sessionStorage.getItem('type')==='m'){
            axios({
                url : '/get/index.php/studentsys/getpostmessage'
            }).then((res)=>{
                if(res.data.ret){
                    this.setState({
                        data : res.data.data
                    })
                    this.data = res.data.data;
                }
            })
        }else if(sessionStorage.getItem('type')==='t'){
            axios({
                url : '/bk/index.php/studentsys/getTeacherName',
                method : 'post',
                data : {
                    teacherid : sessionStorage.getItem('username')
                }
            }).then((result)=>{
                if(result.data.ret){
                    axios({
                        url : '/get/index.php/studentsys/getpostmessage'
                    }).then((res)=>{
                        if(res.data.ret){
                            res.data.data = res.data.data.filter(function(item){
                                return item.target === result.data.data[0].name
                            })
                            this.setState({
                                data : res.data.data
                            })
                            this.data = res.data.data;
                        }
                    })
                }
            })
            
        }
    }
    onChange = (e) => {
        this.setState({
            value: e.target.value,
        });
    }
    submit = ()=>{
        if(this.state.value === 1){
            axios({
                url : '/bk/index.php/studentsys/addPostMessage',
                data : {
                    message:this.state.inputvalue,
                    type : this.state.value,
                    target : this.state.targetValue
                },
                method : 'post'
            }).then((res)=>{
                if(res.data.ret){
                    message.success('提交成功');
                    this.setState({
                        value : 1,
                        inputvalue : ''
                    })
                }else{
                    message.error('提交失败');
                }
            })
        }else{
            axios({
                url : '/bk/index.php/studentsys/addPostMessage',
                data : {
                    message : this.state.inputvalue,
                    username : sessionStorage.getItem('username'),
                    type : this.state.value,
                    target : this.state.targetValue
                }, 
                method : 'post'
            }).then((res)=>{
                if(res.data.ret){
                    message.success('提交成功');
                    this.setState({
                        value : 1,
                        inputvalue : ''
                    })
                }else{
                    message.error('提交失败');
                }
            })
        }
    }
    handlesearch(value){
        if(this.state.data){
            this.data =  Object.assign(this.state.data,this.data);
        }
        if(value==='1'||value==='已解决'){
            this.newdata = this.data.filter(function(item,index){
                if(item.solution===''){
                    return false
                }else{
                    return true
                }
            })
        }else if(value==='0'||value==='未解决'){
            this.newdata = this.data.filter(function(item,index){
                if(item.solution===''){
                    return true
                }else{
                    return false
                }
            })
        }
        this.setState({
            data : this.newdata
        })
    }
    changeinput = (e)=>{
        this.setState({
            inputvalue: e.target.value,
        });
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
                url : '/bk/index.php/studentsys/deletepostmessage',
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
                url: '/bk/index.php/studentsys/updatepostmessage',
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
    onSelect = (value) => {
        this.setState({
            targetValue : value
        })
    }
    render(){
        if(sessionStorage.getItem('type')==='s'){
            
            return (
                <div>
                <h1>提交舆情</h1>
                <Row>
                    <Col span={20} offset={2}>
                        <TextArea placeholder="输入你的舆情反馈" autosize={{ minRows: 8, maxRows: 10 }} value={this.state.inputvalue} onChange={this.changeinput} ref="inputtext"/>
                    </Col>
                </Row>
                <Row style={{marginTop:30}}>
                    <Col span={4} offset={9}>
                        <AutoComplete
                            dataSource={this.state.dataSource}
                            style={{ width: 200 }}
                            onSelect={this.onSelect}
                            placeholder="请选择下列选项之一(提交对象)"
                            filterOption={(inputValue, option) => option.props.children.indexOf(inputValue) !== -1}
                        />
                    </Col>
                </Row>
                <Row style={{marginTop:30,marginBottom:30}}>
                    <Col span={4} offset={10}>
                        <RadioGroup onChange={this.onChange} value={this.state.value}>
                            <Radio value={1}>匿名</Radio>
                            <Radio value={2}>不匿名</Radio>
                        </RadioGroup>
                    </Col>
                </Row>
                <Row>
                    <Col span={4} offset={11}>
                        <Button type="primary" onClick={this.submit}>提交</Button>
                    </Col>
                </Row>
                
            </div>
            )
        }else{
            return(
                <div>
                    <Row>
                    <Col span={22}> 
                        <Search
                            placeholder="输入1查找已解决，0查找未解决"
                            style={{ width: 200 ,marginBottom:30}}
                            onSearch={this.handlesearch.bind(this)}
                        />
                    </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Table columns={this.state.columns} dataSource={this.state.data} pagination={{ pageSize: 10 }} scroll={{ y: 400 }} />
                        </Col>
                    </Row>
                </div>
            )
        }
    }
}
export default postMessage