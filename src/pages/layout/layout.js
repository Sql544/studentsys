import React from 'react'
import {Link} from 'react-router'
import { Layout, Menu, Icon,Avatar,Dropdown } from 'antd';
import {connect} from 'react-redux'
import './layout.scss'
const PropTypes = require('prop-types');
const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
class SiderDemo extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            type : ''
        }
    }
    componentDidMount(){
        
        if(!sessionStorage.getItem('username')){
            this.context.router.push('/login')
            return;
        }
        this.setState({
            type : sessionStorage.getItem('type')
        })
    }
    state = {
        collapsed: false,
    };
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
    logout(){
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('type');
        this.context.router.push('/login')
    }
    render() {
        const menu = (
            <Menu>
              <Menu.Item>
                <Link to='index'>你好{sessionStorage.getItem('username')}</Link>
              </Menu.Item>
              <Menu.Item>
                <Link to='index/mine'>个人信息</Link>
              </Menu.Item>
              <Menu.Item>
                <p onClick={this.logout.bind(this)}>退出登陆</p>
              </Menu.Item>
            </Menu>
          );
          if(sessionStorage.getItem('type')==='s'){
            return (
                <Layout>
                    <Sider
                        trigger={null}
                        collapsible
                        breakpoint="lg"
                        collapsed={this.state.collapsed}
                        style={{ overflowY: 'auto' }}
                    >
                        <div className="logo" />
                        <Menu
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            mode="inline"
                            theme="dark"
                            inlineCollapsed={this.state.collapsed}
                        >
                            
                            <SubMenu key="sub1" title={<span><Icon type="mail" /><span>信息查询</span></span>}>
                                <Menu.Item key="1"><Link to='index/mine'>个人信息</Link></Menu.Item>
                                <Menu.Item key="6"><Link to='index/holiday'>放假安排</Link></Menu.Item>
                                <Menu.Item key="8"><Link to='index/teacherMsg'>老师办公室及电话</Link></Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub2" title={<span><Icon type="solution" /><span>舆情反馈</span></span>}>
                                <Menu.Item key="9"><Link to='index/postMessage'> 提交反馈</Link></Menu.Item>
                                <Menu.Item key="15"><Link to='index/getpostmessage'> 查看舆情反馈</Link></Menu.Item>
                            </SubMenu>
                            
                            <SubMenu key="sub3" title={<span><Icon type="share-alt" /><span>学习交流</span></span>}>
                                <Menu.Item key="10"><Link to='/index/files'>资源下载</Link></Menu.Item>
                                <Menu.Item key="11">交流平台</Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub4" title={<span><Icon type="team" /><span>团学社</span></span>}>
                                <Menu.Item key="12"><Link to='/index/activity'>活动信息</Link></Menu.Item>
                                <Menu.Item key="13"><Link to='/index/hiserMsg'>联系方式</Link></Menu.Item>
                                <Menu.Item key="14"><Link to='/index/meeting'>例会内容</Link></Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>
                    <Layout>
                        <Header style={{ background: '#fff', padding: 0 }}>
                            <Icon
                                className="trigger"
                                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                onClick={this.toggle}
                                style={{float:'left',marginTop:25}}
                            />
                            <div style={{float:'left'}}>
                                <img src="./images/logonew.png" alt="logo" style={{height:64}}></img>
                            </div>
                            <Dropdown overlay={menu} placement="bottomCenter">
                                <Avatar style={{ backgroundColor: '#87d068',float:'right',marginTop:16+'px',marginRight:40+'px' }}  >{this.state.type}</Avatar>
                            </Dropdown>
                            
                        </Header>
                        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
                            {this.props.children}
                        </Content>
                    </Layout>
                </Layout>
            );
          }else if(sessionStorage.getItem('type')==='t'){
            return (
                <Layout>
                    <Sider
                        trigger={null}
                        collapsible
                        breakpoint="lg"
                        collapsed={this.state.collapsed}
                        style={{ overflowY: 'auto' }}
                    >
                        <div className="logo" />
                        <Menu
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            mode="inline"
                            theme="dark"
                            inlineCollapsed={this.state.collapsed}
                        >
                            
                            <SubMenu key="sub1" title={<span><Icon type="mail" /><span>信息查询</span></span>}>
                                <Menu.Item key="1"><Link to='index/teacherMsg'>教师信息</Link></Menu.Item>
                                <Menu.Item key="6"><Link to='index/mine'>学生信息</Link></Menu.Item>
                                <Menu.Item key="7"><Link to='index/postMessage'>舆情查询</Link></Menu.Item>
                                <Menu.Item key="8"><Link to='index/upload'>文件上传</Link></Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>
                    <Layout>
                        <Header style={{ background: '#fff', padding: 0 }}>
                            <Icon
                                className="trigger"
                                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                onClick={this.toggle}
                                style={{float:'left',marginTop:25}}
                            />
                            <div style={{float:'left'}}>
                                <img src="./images/logonew.png" alt="logo" style={{height:64}}></img>
                            </div>
                            <Dropdown overlay={menu} placement="bottomCenter">
                                <Avatar style={{ backgroundColor: '#87d068',float:'right',marginTop:16+'px',marginRight:40+'px' }}  >{this.state.type}</Avatar>
                            </Dropdown>
                            
                        </Header>
                        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
                            {this.props.children}
                        </Content>
                    </Layout>
                </Layout>
            );
          }else{
            return (
                <Layout>
                    <Sider
                        trigger={null}
                        collapsible
                        breakpoint="lg"
                        collapsed={this.state.collapsed}
                        style={{ overflowY: 'auto' }}
                    >
                        <div className="logo" />
                        <Menu
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            mode="inline"
                            theme="dark"
                            inlineCollapsed={this.state.collapsed}
                        >
                            
                            <SubMenu key="sub1" title={<span><Icon type="mail" /><span>信息管理</span></span>}>
                                <Menu.Item key="1"><Link to='index/mine'>学生信息管理</Link></Menu.Item>
                                <Menu.Item key="6"><Link to='index/grade'>绩点管理</Link></Menu.Item>
                                <Menu.Item key="7"><Link to='index/prize'>获奖情况管理</Link></Menu.Item>
                                <Menu.Item key="8"><Link to='index/holiday'>放假安排管理</Link></Menu.Item>
                                <Menu.Item key="10"><Link to='index/teacherMsg'>老师办公室及电话管理</Link></Menu.Item>
                            </SubMenu>
                            <Menu.Item key="11"><Link to='index/postMessage'><Icon type="solution" />舆情反馈统计</Link></Menu.Item>
                            
                            <SubMenu key="sub3" title={<span><Icon type="share-alt" /><span>学习交流</span></span>}>
                                <Menu.Item key="12"><Link to='index/upload'>上传文件</Link></Menu.Item>
                                <Menu.Item key="13">平台管理</Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub4" title={<span><Icon type="team" /><span>团学社</span></span>}>
                                <Menu.Item key="14"><Link to='/index/activity'>活动信息管理</Link></Menu.Item>
                                <Menu.Item key="15"><Link to='/index/hiserMsg'>联系方式管理</Link></Menu.Item>
                                <Menu.Item key="16"><Link to='/index/meeting'>例会内容管理</Link></Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>
                    <Layout>
                        <Header style={{ background: '#fff', padding: 0 }}>
                        
    
                            <Icon
                                className="trigger"
                                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                onClick={this.toggle}
                                style={{float:'left',marginTop:25}}
                            />
                            <div style={{float:'left'}}>
                                <img src="./images/logonew.png" alt="logo" style={{height:64}}></img>
                            </div>
                            <Dropdown overlay={menu} placement="bottomCenter">
                                <Avatar style={{ backgroundColor: '#87d068',float:'right',marginTop:16+'px',marginRight:40+'px' }}  >{this.state.type}</Avatar>
                            </Dropdown>
                            
                        </Header>
                        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
                            {this.props.children}
                        </Content>
                    </Layout>
                </Layout>
            );
          }
        
    }
}
SiderDemo.contextTypes = {
    router: PropTypes.object
};
  export default connect(
    (state)=>{
        return {
            loginstate : {
                username : state.user,
                type : state.usertype
            }
        }
    },
    
)(SiderDemo)