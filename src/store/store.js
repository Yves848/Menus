import Vue from 'vue';
import Vuex from 'vuex';
import {db} from '../firebase';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state:{
      user: localStorage.getItem("userName"),
      
    },
    actions: {
        setUser(state,user) {
            state.commit('SET_USER',user);
        },
        logOut(state) {
            state.commit('LOG_OUT');
        }
    },
    getters:{
        userName: state => {
            return state.user;
        },
        dbPlats: state => {
            return db.ref('Plats/'+state.user);
        },
        dbPlatsStd: state => {
            return db.ref('Plats');
        }

    },
    mutations:{
        'SET_USER' (state,user) {
            state.user = user;
            localStorage.setItem("userName",user);
        },
        'LOG_OUT' (state) {
            localStorage.removeItem("userName");
        }
    }
});

