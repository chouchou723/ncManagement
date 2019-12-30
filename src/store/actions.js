import * as types from './mutation-types'
import state from './state'
const actions = {
    setToKen: ({commit},code)=>{
        commit( types.SET_TOKEN, code )
    },
    setViewKey: ({commit}, key)=>{
        commit( types.SET_VIEW_KEY, key)
    },
    delView({commit }, view) {
        return new Promise(resolve => {
          commit('DELVIEW',view)
          resolve({
            visitedViews: [...state.tagsView]
          })
        })
      },
      delOthersViews({commit }, view) {
        return new Promise(resolve => {
          commit('DELOTHER', view)
          resolve({
            visitedViews: [...state.tagsView]
          })
        })
      },
      setFile: ({commit},file)=>{
        commit( 'SETFILE', file )
    },
}

export default actions