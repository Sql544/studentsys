import React from 'react'
import axios from 'axios'
import { Table,Input,Col,Row,Button} from 'antd';
const Search = Input.Search;

class Files extends React.Component{
    constructor(){
        super();
        this.state = {
            data : [],
            columns : [{
                title : '文件名',
                dataIndex : 'filename',
                key : 'filename',
                width : 600
            },{
                title : '操作',
                dataIndex : 'operation',
                key : 'operation',
                width : 200,
                render: (text, record)=> {return(
                    <div>
                        <Button type="primary" ><a href={record.address}>下载</a></Button>
                    </div>
                )}
            }],
        }
    }
    
    componentDidMount(){
        axios({
            url : '/get/index.php/studentsys/getfiles'
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
            if(item.filename.indexOf(value)!==-1){
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
        
        return (
            <div>
                <Row>
                <Col span={22}> 
                    <Search
                        placeholder="输入文件名"
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
export default Files;