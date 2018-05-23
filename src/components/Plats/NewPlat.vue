<template>
    <div class="jumbotron">
        <h1>Nouveau Plat</h1>
        <form>
        <div class="form-row">
            <div class="form-group col-md-6">
            <label for="inputName">Nom</label> 
            <input type="text" v-model="plat.nom" class="form-control" id="inputName" placeholder="Nom du plat">
            </div>
            {{plat.nom}}
        </div>
        <div class="form-group">
            <label for="inputImage">Image</label>
            <input v-model="plat.image" type="text" class="form-control" id="inputImage" placeholder="Url de l'image">
        </div>
        
        <button class="btn btn-primary" @click.prevent="ajouterPlat">Enregistrer</button> 
        <button class="btn btn-info" @click.prevent="annulerAjout">Annuler</button>
    </form>
    </div>
</template>

<script>
import { platsRef } from "../../firebase";


export default {
  data() {
      return {
          plat: {
              nom: '',
              image: ''
          }
      }
  },
  methods: {
      ajouterPlat() {
          
          platsRef.push({Nom: this.plat.nom, Image: this.plat.image});
          this.$router.push("/plats");
          
      }
  }
}
</script>

<style>


</style>


