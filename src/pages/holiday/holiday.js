import React,{Component} from 'react'
import { Table,Input,Col,Row,Icon,Popconfirm,message} from 'antd';
import Modal from '../modal/modal'
import axios from 'axios'
import {connect} from 'react-redux'
// import axios from "axios"
import './holiday.scss'
const Search = Input.Search;
const EditableCell = ({ editable, value, onChange }) => (
    <div>
        {editable
        ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
        : value
        }
    </div>
);
class Holiday extends Component{
    constructor(props){
        super(props)
        this.state = {
            columns : [],
            data : []
        } 
    }
  
    componentDidMount(){
        if(sessionStorage.getItem('type')==='s'){
            this.columns = [{
                title : '节日',
                dataIndex : 'holiday',
                key : 'holiday',
                width: 150
            },{
                title : '放假天数',
                dataIndex : 'days',
                key : 'days',
                width: 150
            },{
                title : '时间段',
                dataIndex : 'during',
                key : 'during',
                width: 150
            },{
                title : '注意事项',
                dataIndex : 'warning',
                key : 'warning'
            }]
            
        }else{
            this.columns = [{
                title : '节日',
                dataIndex : 'holiday',
                key : 'holiday',
                width: 150,
                render: (text, record) => this.renderColumns(text, record, 'holiday'),
            },{
                title : '放假天数',
                dataIndex : 'days',
                key : 'days',
                width: 150,
                render: (text, record) => this.renderColumns(text, record, 'days'),
                
            },{
                title : '时间段',
                dataIndex : 'during',
                key : 'during',
                width: 150,
                render: (text, record) => this.renderColumns(text, record, 'during'),
                
            },{
                title : '注意事项',
                dataIndex : 'warning',
                key : 'warning',
                render: (text, record) => this.renderColumns(text, record, 'warning'),
                
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
        axios({
            url : '/get/index.php/studentsys/get_holidays',
            method : 'get',
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
    }
    handlesearch(value){
        this.data =  Object.assign(this.state.data,this.data);
        this.newdata = this.data.filter(function(item,index){
            if(item.holiday.indexOf(value)!==-1){
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
            this.index = target.holiday
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
                url : '/bk/index.php/studentsys/deleteHoliday',
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
                url: '/bk/index.php/studentsys/updateHoliday',
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
                <Col span={22}> 
                    <Search
                        placeholder="输入节日"
                        style={{ width: 200 ,marginBottom:30}}
                        onSearch={this.handlesearch.bind(this)}
                    />
                </Col>
                <Col span={2}>
                {   
                    sessionStorage.getItem('type')==='s'?
                    null : 
                    <Modal name="增加" tablelist={this.props.columns}/>
                }
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
)(Holiday)