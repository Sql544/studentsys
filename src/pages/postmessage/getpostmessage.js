import React from 'react'
import { Input,Col,Row,Table } from 'antd';
import axios from 'axios'
const Search = Input.Search;
class getpostmessage extends React.Component{
    constructor(){
        super();
        this.state = {
            columns : [{
                title : '提交的舆情',
                dataIndex : 'message',
                key : 'message',
                width : 300
            },{
                title : '回复',
                dataIndex : 'solution',
                key : 'solution',
                width : 300
            }],
            data : []
        }
    }
    componentDidMount(){
        axios({
            url : '/get/index.php/studentsys/getpostmessage_stu',
        }).then((res)=>{
            if(res.data.ret){
                var newarr = res.data.data.filter(function(item,index){
                    return item.solution
                })
                this.setState({
                    data : newarr
                })
                this.data = newarr;
            }
        })
    }
    handlesearch(value){
        if(this.state.data){
            this.data =  Object.assign(this.state.data,this.data);
        }
        this.newdata = this.data.filter(function(item,index){
            if(item.message.indexOf(value)!==-1){
                return true
            }else{
                return false
            }
        })
        this.setState({
            data : this.newdata
        })
    }
    render(){
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
export default getpostmessage