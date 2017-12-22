import React,{Component} from 'react'
import { Modal, Button } from 'antd';
import Form from '../form/form'
class Mod extends Component {
  state = {
    loading: false,
    visible: false,
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
  }
  handleCancel = () => {
    this.setState({ visible: false });
  }
  handlesubmit = (e) => {
  }
  render() {
    const { visible } = this.state;
    return (
      <div>
        <Button type="primary"  onClick={this.showModal}>
          {this.props.name || '增加'}
        </Button>
        <Modal
          visible={visible}
          title="添加信息"
          onCancel={this.handleCancel}
          footer={[]}
        >
          <Form
            inputlist={this.props.tablelist}
          />
        </Modal>
      </div>
    );
  }
}
export default Mod;