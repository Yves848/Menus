<template>
<section>
        <modal v-model="showModal" :title="title" :footer="false" :backdrop="false" :dismiss-btn="false">
          <form>
              <div class="form-group">
                <label for="nomPlat">Nom</label>
                <input v-model="plat.Nom" @blur="plat.imageSearch=plat.Nom" type="text" id="nomPlat" placeholder="Nom du plat" class="form-control">
              </div>

              <div class="form-group">
                <label for="inputImage">Image</label>
                <div class="input-group">
                <input v-model="plat.imageSearch" type="text" class="form-control" id="inputImage" placeholder="Mots clés ....."> 
                <span class="input-group-btn">
                  <button class="btn btn-default" type="button" @click="searchImage(plat.imageSearch,1)">Go!</button>
                </span>
                </div>
              </div>
              <div v-if="images.length>0" class="panel panel-default">
              <div class="row">
                <div class="col-sm-3" v-for="image in images">
                    <img :src="image.url" width="100" alt="" @click="plat.Image=image.url">
                </div>
            </div>
            <div style="margin-top:3px; margin-bottom:3px">
            <button class="btn btn-success" @click.prevent="searchImage(plat.Nom,++imgPage)">Suivants ({{imgPage}})</button>
            </div>
            </div>
          </form>

          <button class="btn btn-primary" @click="ajouterPlat">Enregistrer</button> 
          <button class="btn btn-info" @click="annulerAjout">Annuler</button>
       
        </modal>

        <modal v-model="showConfirmDelete" title="Confirmez la suppression" :footer="false">
          <h1>{{toSuppress.Nom}}</h1>
          <img :src="toSuppress.Image" class="platImg2">
          
          <div class="row" id="modalSuppressConfirm">
            <div class="col-md-6">
                <button class="btn btn-info btn-block" v-on:click="showConfirmDelete=false"> Non </button>
            </div>
            <div class="col-md-6">
                <button class="btn btn-warning btn-block" v-on:click="doSuppress()"> Oui </button>
            </div>
          </div>  
        </modal>

    <div class="panel panel-primary" style="padding:4px" >
      
      <form class="form-inline">
        <div class="form-group">
          <label class="control-label" for="formGroupInputSmall">Recherche</label>
            <input class="form-control" type="text" id="formGroupInputSmall" placeholder="recherche....." v-model="filtre">
          
        </div>
        <btn type="primary" @click="addPlat">Ajouter</btn>
      </form>
      
    </div>
    
    <div class="row">
        <div class="col-lg-3" v-for="plat in platsfilter">
            <div class="panel panel-info">
              <div class="panel-heading">
                  <h3 class="panel-title">{{plat.Nom}}</h3>
              </div>
              <div class="panel-body">
                <div class="row">
                  <div class="col-md-6">
                      <img :src="plat.Image" class="platImg"><br>  
                  </div>
                  
                </div>
            </div>
            <div class="panel-footer">
              <div class="row">
                      <div class="col-sm-6">
                          <btn type="success btn-sm btn-block"  @click.prevent="editPlat(plat)">Editer</btn>
                      </div>
                      <div class="col-sm-6">
                          <btn type="danger btn-sm btn-block"  @click.prevent="removePlat(plat)">Supprimer</btn>
                      </div>
                      
                  </div>
              </div>
            </div>
        </div>
    </div>
       
  
  </section>
</template>

<script>
import { platsRef } from "../../firebase";
import axios from 'axios'

//import GoogleImages from "google-images";
var options = {
  labels: {
    tip: "Message popup"
  },
  position: "bottom-right",
  duration: 3000
};

export default {
  components: {},
  created() {
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
      plat: {
        Nom: "",
        Image: "",
        Rating: 0,
        imageSearch: ""
      },
      msg: "Plats",
      filtre: "",
      toSuppress: {},
      rate: 3
    };
  },
  methods: {
    resetPlat() {
      this.plat = {
        Nom: "",
        Image: "",
        Rating: 0,
        imageSearch: ""
      };
      this.images = [];
    },
    addPlat() {
      this.resetPlat();
      this.title = "Ajouter un plat";
      this.showModal = true;
    },
    editPlat(plat) {
      this.title = "Editer un plat";
      this.plat = plat;
      this.showModal = true;
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
      this.showModal = false;

      this.resetPlat();
    },
    annulerAjout() {
      this.showModal = false;
    },
    removePlat(plat) {
      this.toSuppress = plat;
      this.showConfirmDelete = true;
    },
    doSuppress() {
      this.showConfirmDelete = false;
      platsRef.child(this.toSuppress.id).remove();
      this.toast({ text: this.toSuppress.Nom + " supprimé" });
      this.toSuppress = {};
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
