<template>
    <b-container>
      <b-form-input type="date"></b-form-input>

    
    </b-container>
    

</template>

<script>
import CalendarView from 'vue-simple-calendar';
import "vue-simple-calendar/dist/static/css/default.css";

export default {
  components: {
    CalendarView
  },
  data() {
    return {
      dateCourante: new Date(),
      message: '',
      dismissSecs: 10,
      dismissCountDown : 0,
      showDismissibleAlert: false,
      uom: "week",
      programme: {
        nom: "semaine 14",
        menus: [
          {
            jour: "",
            plat: ""
          }
        ]
      }
    };
  },
  methods: {
    
  }
};
</script>

<style>
</style>
