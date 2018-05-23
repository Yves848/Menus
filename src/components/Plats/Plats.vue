<template>
<div>
        <b-modal ref="showModal" :title="title" 
                                  hide-footer 
                                  no-close-on-backdrop 
                                  :dismiss-btn="false"
                                  @shown="focusAjout">

          <div>
            <b-form>
              <b-form-group id="idNomPlat"
                            label="Nom :"
                            label-for="NomPlat"
                            description="Décrivez le plat">
                <b-input-group>
                  <b-form-input v-model="plat.Nom"
                                ref="NomPlat"
                                id="NomPlat"
                                type="text"
                                placeholder="Nom du plat"
                                @blur.native="makeImageSearch(plat)">

                  </b-form-input>
              </b-input-group>
            </b-form-group> 
            <b-form-group id="idImagePlat"
                          label="Image :"
                          :description="plat.imageSearch"
                        >

            
              <b-input-group>
                <b-form-input v-model="plat.imageSearch"></b-form-input>
                <b-input-group-append>
                  <b-btn variant="info" @click="searchImage(plat.imageSearch,1)">Go</b-btn>
                </b-input-group-append>

              </b-input-group>
            </b-form-group>
            </b-form>
            <div v-if="images.length>0" class="panel panel-default">
              <div class="row">
                <div class="col-sm-3" v-for="image in images">
                    <img :src="image.url" width="100" alt="" @click="plat.Image=image.url">
                </div>
              </div>
              <div style="margin-top:3px; margin-bottom:3px">
                 <b-button variant="success" size="sm"  @click="searchImage(plat.Nom,++imgPage)">Suivants ({{imgPage}})</b-button>
              </div>
            </div>
          </div>
          <div class="row">
                <div class="col-sm-6">
                    <b-button variant="success" block size="sm"  @click="ajouterPlat">Enregistrer</b-button> 
                </div>
                <div class="col-sm-6">
                    <b-button variant="warning" block size="sm"  @click="annulerAjout">Annuler</b-button>
                </div>
                
          </div>

          
          
       
        </b-modal>

        <b-modal ref="showConfirmDelete" title="Confirmez la suppression" hide-footer>
          <h1>{{toSuppress.Nom}}</h1>
          <img :src="toSuppress.Image" class="platImg2">
          
          <div class="row" id="modalSuppressConfirm">
            <div class="col-md-6">
                <b-button variant="success" size="sm"  v-on:click="closeConfirmDelete()"> Non </b-button>
            </div>
            <div class="col-md-6">
                <b-button variant="success" size="sm"  v-on:click="doSuppress()"> Oui </b-button>
            </div>
          </div>  
        </b-modal>

    <div class="panel panel-primary" style="padding:4px" >
    <b-alert show id="search">
      <b-container>
        <b-row>
          <b-col cols="6">
            <b-form-group id="searchZone"
                          horizontal
                          :label-cols="2"
                          breakpoint="md"
                          description="Entrez votre recherche"
                          label="Recherche"
                          label-for="inputRecherche">
                <b-form-input id="inputRecherche"
                              v-model="filtre">

                </b-form-input>

            </b-form-group>
          </b-col>
          <b-col cols="auto">
            <b-button variant="success"  @click="addPlat">Ajouter</b-button>
          </b-col>
          <b-col cols="4">
            <b-dropdown id="ddown-divider" text="Options" class="l-2">
              <b-dropdown-item-button @click="cleanDb()">Supprimer tous les plats</b-dropdown-item-button>
              <b-dropdown-item-button @click="importDb()">Importer les plats standards</b-dropdown-item-button>
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-item-button disabled>(Inactif)</b-dropdown-item-button>
            </b-dropdown>
          </b-col>
        </b-row>
        
      </b-container>
      </b-alert>
      
      
      
    </div>
    <div>
    <b-card-group columns>
          <b-card :title="unplat.Nom"
                  :img-src="unplat.Image"
                  style="max-width: 20rem;"
                  border-variant="secondary"
                  v-for="unplat in platsfilter"
          >
            <div class="row">
                      <div class="col-sm-6">
                          <b-button variant="primary" block size="sm" @click="editPlat(unplat)">Editer</b-button>
                      </div>
                      <div class="col-sm-6">
                          <b-button variant="danger" block size="sm" @click.prevent="removePlat(unplat)">Supprimer</b-button>
                      </div>
                      
                </div>
          </b-card>
            
    </b-card-group>
    </div>   
 </div> 

</template>

<script>
//import { platsRef } from "../../firebase";
import axios from 'axios'
import objPlat from '../../plats.js'


//import GoogleImages from "google-images";
var options = {
  labels: {
    tip: "Message popup"
  },
  position: "bottom-right",
  duration: 3000
};
var platsRef = {};
export default {
  components: {},
  created() {
    platsRef = this.$store.getters.dbPlats;
    platsRef.on("child_added", snapshot => {
      this.plats.push({ ...snapshot.val(), id: snapshot.key });
    });

    platsRef.on("child_removed", snapshot => {
      const deletedPlat = this.plats.find(plat => plat.id === snapshot.key);
      const index = this.plats.indexOf(deletedPlat);
      this.plats.splice(index, 1);
    });
  },
  data() {
    return {
      title: "",
      showModal: false,
      showConfirmDelete: false,
      showImages:false,
      confirmed: true,
      plats: [],
      images: [],
      imgPage: 1,
      plat: {},
      msg: "Plats",
      filtre: "",
      toSuppress: {},
      rate: 3
    };
  },
  methods: {
    resetPlat() {
      this.plat = new objPlat("");
      this.images = [];
    },
    addPlat() {
      this.resetPlat();
      this.title = "Ajouter un plat";
      this.$refs.showModal.show();
    },
    editPlat(plat) {
      this.resetPlat();
      this.title = "Editer un plat";
      this.plat = plat;
      this.$refs.showModal.show();
    },
    toast(message) {
      this.$toasted.show(message.text, {
        position: "bottom-right",
        duration: 2000,
        theme: "outline"
      });
    },
    ajouterPlat() {
      if (this.title == "Ajouter un plat") {
        this.addPlatToDB(this.plat);
      } else {
        this.editPlatInDB(this.plat);
      }
      this.$refs.showModal.hide();

      this.resetPlat();
    },
    annulerAjout() {
      this.$refs.showModal.hide();
    },
    removePlat(plat) {
      console.log(plat)
      this.toSuppress = plat;
      this.$refs.showConfirmDelete.show();
    },
    doSuppress() {
      this.closeConfirmDelete();
      platsRef.child(this.toSuppress.id).remove();
      this.toast({ text: this.toSuppress.Nom + " supprimé" });
      this.toSuppress = {};
    },
    closeConfirmDelete() {
      this.$refs.showConfirmDelete.hide();
    },
    addPlatToDB(plat) {
      platsRef.push({ Nom: plat.Nom, Image: plat.Image, Rating: plat.Rating });
      this.toast({ text: plat.Nom + " ajouté" });
    },
    editPlatInDB(plat) {
      platsRef.child(plat.id).update({
        Nom: plat.Nom,
        Image: plat.Image,
        Rating: plat.Rating
      });
      this.toast({ text: plat.Nom + " modifié" });
    },
    makeImageSearch(plat) {
      if (!plat.imageSearch || plat.imageSearch == '') {
        plat.imageSearch = plat.Nom;
      }
    },
    cleanDb() {
      var keys = [];

      this.plats.forEach(plat => {
        keys.push(plat.id);  
      });

      keys.forEach(key => {
        platsRef.child(key).remove();
      })
    },
    importDb(){
      var refDb = this.$store.getters.dbPlatsStd;
      refDb.on("child_added", snapshot => {
        //console.log(snapshot.val())
        let plat = snapshot.val();
        platsRef.push({ Nom: plat.Nom, Image: plat.Image, Rating: plat.Rating });
    });

    },
    searchImage(key,page) {
      
        var CSE_API_KEY ='007439388879951561867:3ragl0fkhpm';
        var CSE_ID = 'AIzaSyDYvQx76ZvFawwKOaDeGqRClb2RJlIcsXM';

        var parameters = '?q='+encodeURIComponent(key);
        parameters += '&cx=' + CSE_API_KEY;
        parameters += '&imgSize=large';
        //parameters += '&imgType=photo';
        parameters += '&searchType=image';
        parameters += '&fields=items(displayLink%2CfileFormat%2CformattedUrl%2ChtmlFormattedUrl%2ChtmlSnippet%2ChtmlTitle%2Cimage%2Ckind%2Clabels%2Clink%2Cmime%2Cpagemap%2Csnippet%2Ctitle)';
        parameters += '&key=' + CSE_ID;
        parameters += '&lr=lang_fr';
        parameters += '&start=' + page;

        var path = 'https://www.googleapis.com/customsearch/v1/siterestrict'+parameters;
        this.imgPage = page;
        console.log(path)
        axios.get(path)
        .then(response => {
          console.log(response);
          this.images =[];
          var images = response.data.items;
          images.forEach(image => {
               this.images.push(
            {
              url: image.link,
              width: image.image.width,
              height: image.image.height
            }
          )     
          });
        })
        

      },
      focusAjout(e) {
        this.$refs.NomPlat.focus();
      }

      
    

  },
  computed: {
    platsfilter() {
      return this.plats.filter(plat => {
        return plat.Nom.toUpperCase().includes(this.filtre.toUpperCase());
      });
    }
  }
};
</script>

<style>


#modalSuppressConfirm {
  margin: 5px;
}

.plats {
  background: #ffffff;
}
div {
  margin: 0px;
  padding: 0px;
}
.platImg {
  height: 100px;
  width: 100px;
}

.platImg2 {
  height: 200px;
  width: auto;
  margin-bottom: 10px;
}

.card {
  margin-bottom: 2px;
  margin-top: 2px;
}

.box {
  margin-top: 10px;
}

#carte {
  margin: 2px;
  padding: 2px;
  background-color: rgba(93, 101, 172, 0.562);
}
</style>
