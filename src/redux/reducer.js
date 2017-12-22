export default (state,action) => {
    switch(action.type){
        case 'addmember' : 
        return {...state,insert : action.data}
        case 'init' : 
        return {...state,columns : action.columns,data : action.data}
        case 'loginstate' : 
        return {...state,user : action.username , usertype : action.usertype}
        default : 
        return state
    }
}