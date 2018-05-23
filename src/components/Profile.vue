<template>
    <div>
        <b-modal ref="modalProfile">
            <h2>Profile {{userName}}</h2>
            {{show}}
        </b-modal>
    </div>   
</template>

<script>
export default {
    props: 
        ['show']
    ,
    mounted: function(){
        this.$refs.modalProfile.show()
    },
    data() {
        return {
            bShow: this.show
        }
    },
    watch: {
        show: function(newVis,oldVis){
            console.log(newVis);
            if (newVis) {
                this.$refs.modalProfile.show();
            } else {
                this.$refs.modalProfile.hide();
            }
        }
    },
    computed:{
        userName() {
            return this.$store.getters.userName;
        }
    }
}
</script>

<style>

</style>
