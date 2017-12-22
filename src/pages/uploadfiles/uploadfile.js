import React from 'react'
import { Upload, Button, Icon, message } from 'antd';
import reqwest from 'reqwest';
import qiniu from 'qiniu';
import axios from 'axios';

class Uploads extends React.Component {
  state = {
    fileList: [],
    uploading: false,
  }

  handleUpload = () => {
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('file', file);
    });
    this.setState({
      uploading: true,
    });
    var accessKey = 'zw0dgZbWU99GJz9GIymeSffhG6DBvFNjAILl-bzp';
    var secretKey = 'vnY_m520XJAhVf_45w5HfNFnmR2Y6W8YmwJ_c775';
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    var options = {
        scope: 'miniboy:'+fileList[0].name,
        expires: 7200
    };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken=putPolicy.uploadToken(mac);
    formData.append('token',uploadToken)
    formData.append('key',fileList[0].name)
    // You can use any AJAX library you like
    reqwest({
      url: 'http://up-z1.qiniu.com',
      'Content-Type': 'multipart/form-data',
      method: 'post',
      processData: false,
      data: formData,
      success: () => {
        this.setState({
          fileList: [],
          uploading: false,
        });
        axios({
            url : '/bk/index.php/studentsys/addfile',
            method : 'post',
            data : {
                filename : fileList[0].name,
                address : 'http://ozet8lhr5.bkt.clouddn.com/'+fileList[0].name
            }
        }).then((res)=>{
            if(res.data.ret){
                message.success('upload successfully.');
            }else{
                message.success('push failed.');
            }
        })
      },
      error: () => {
        this.setState({
          uploading: false,
        });
        message.error('upload failed.');
      },
    });
  }

  render() {
    const { uploading } = this.state;
    const props = {
      action: '//jsonplaceholder.typicode.com/posts/',
      onRemove: (file) => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
        }));
        return false;
      },
      fileList: this.state.fileList,
    };

    return (
      <div>
        <Upload {...props}>
          <Button>
            <Icon type="upload" /> Select File
          </Button>
          
        </Upload>
        <Button
          className="upload-demo-start"
          type="primary"
          onClick={this.handleUpload}
          disabled={this.state.fileList.length === 0}
          loading={uploading}
        >
          {uploading ? 'Uploading' : 'Start Upload' }
        </Button>
      </div>
    );
  }
}
export default Uploads;