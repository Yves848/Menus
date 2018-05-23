<template>
<div>
    
    <b-modal ref="showProfile"
             hide-footer
             hide-header
             hide-header-close
             no-close-on-backdrop
             size="lg">
        <b-alert show>
            <h4>Profile {{user}}</h4>
            <b-button variant="primary" @click="closeProfile()">Fermer</b-button>
        </b-alert>
    </b-modal>
    
    <b-alert show variant="secondary">
        <b-navbar toggleable="md">
            <b-navbar-brand href="#">
                <img src="../assets/images/logo.jpg" style="height:60px;" alt="BV">
            </b-navbar-brand>
            <b-navbar-nav fill>
                <b-nav-item href="/menus">Menus</b-nav-item>
                <b-nav-item href="/plats">Plats</b-nav-item>
                <b-nav-item href="/programmes">Programmes</b-nav-item>
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto">
                <b-nav-item-dropdown right>
                    <template slot="button-content">
                        <em>{{user}}</em>
                    </template>
                    <b-dropdown-item @click="showProfile()">Profile</b-dropdown-item>
                    <b-dropdown-item @click="signOut()">Se déconnecter</b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>
        </b-navbar>
    </b-alert>
</div>
</template>

<script>


export default {
    data() {
        return {
            
        }

    },
    computed:{
        user() {
            return this.$store.getters.userName;
        }
    },
    methods:{
        signOut() {
            this.$store.dispatch('logOut');
            this.$router.go('/');
        },
        showProfile() {
            this.$refs.showProfile.show();
            
        },
        closeProfile(){
            this.$refs.showProfile.hide();
        }
    },
    components: {
    }
}
</script>
