import {createStore} from 'redux'

import reducer from './reducer'

let state = {
    columns : [],
    data : [],
    user : '',
    usertype : '',
    insert : {}
}

export default createStore(reducer,state)