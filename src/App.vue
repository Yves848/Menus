<template>
<div>
  <b-container v-if="userIn">

    <app-header></app-header>
    <router-view></router-view>
    
  </b-container>

  <div class="back" v-else>
    <b-modal id="modalPrevent"
             ref="modal"
             title="Identifiez-vous"
             @ok="handleOk"
             @shown="clearName"
             @cancel="handleCancel"
             visible
             no-close-on-backdrop
             no-close-on-esc>
             
      <form @submit.stop.prevent="handleSubmit">
        <b-form-input type="text"
                      placeholder="Entrez votre identifiant"
                      v-model="userName"></b-form-input>
                      
      </form>
    </b-modal>
  </div>
</div>
  
</template>


<script>
import Header from "./components/Header.vue";
import { mapMutations } from 'vuex';
export default {
  name: 'app',
  data () {
    return {
      userName: "",
      
    }
  },
  components: {
    appHeader: Header 
  },
  computed:{
    userIn() {
      return this.$store.getters.userName;
    }
  },
  methods: {
    clearName () {
      //this.user = ''
    },
    handleOk (evt) {
      // Prevent modal from closing
      evt.preventDefault()
      if (!this.userName) {
        alert('Vous devez vous identifier')
      } else {
        this.handleSubmit()
      }
    },
    handleSubmit () {
      //this.clearName()
      this.$store.dispatch('setUser',this.userName);
      //this.$store.state.user = this.userName;
      this.$refs.modal.hide()
    },
    handleCancel (){
      this.$router.go('');
    }
  }

}
</script>

<style>
.back {
  background-image: url('./assets/images/logo.jpg');
  height: auto;
   left: 0;
   margin: 0;
   min-height: 100%;
   min-width: 674px;
   padding: 0;
   position: absolute;
   top: 0;
   width: 100%;
   z-index: -1;
}
</style>
