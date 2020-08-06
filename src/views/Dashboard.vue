<template>
<div class="max-width">
  <nav class="navbar navbar-expand-md navbar-dark bg-custom navbar-static-top">
    <div class="container-fluid">
      <router-link to="/" v-on:click.native="clearDashboard()" class="navbar-brand">LOGO</router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse w-100 order-2 dual-collapse2">
        <form class="form-inline my-2 my-lg-0" v-on:submit.prevent>
          <div class="input-group input-group-sm">
            <div class="input-group-prepend">
              <span class="input-group-text custom-ig-text border-right-0">
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-search" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z"/>
                  <path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
                </svg>
              </span>
            </div>
            <input v-on:keyup="searchApplicants()" v-model="find" type="text" class="form-control mr-sm-2 no-focus-outline shadow-none custom-input" placeholder="Search" aria-label="search" aria-describedby="basic-addon1">
          </div>
        </form>
      </div>

      <div class="navbar-collapse collapse order-3 dual-collapse2 text-right">
        <ul class="navbar-nav mr-auto text-right">
            <li class="nav-item">
              <a to="/logout" class="a-custom small" v-on:click.stop="logout()">Logout</a>
            </li>
        </ul>
      </div>
    </div>
  </nav>

  <main role="main" id="dashboard" class="container container-fluid mt-5 mb-5">
    <div class="row justify-content-md-center">
      <div class="col-md-11 col-12 col-sm-12">
        <div class="row">
          <div :class="{'col-md-12 col-12 col-sm-12': activeApplicant == '', 'col-md-5': activeApplicant != ''}">
            <ul v-if="applicants.length" class="list-group list-group-flush rounded list-border-custom">
              <li class="list-group-item border-bottom-0">
                <span v-if="activeApplicant == ''">
                  <button @click="createApplicant()" class="btn btn-light btn-sm">
                    Add dummy applicant 
                  </button>
                  &#183;
                </span>
                <span v-if="!applicants.length"
                      class="text-muted font-weight-light small"
                >
                  No applicants to show.
                </span>
                <span v-if="applicants.length==1"
                      class="text-muted font-weight-light small"
                >
                  Showing {{applicants.length}} result.
                </span>

                <span v-if="applicants.length > 1"
                      class="text-muted font-weight-light small"
                >
                  Showing {{applicants.length}} results.
                </span>
              </li>

              <li v-for="applicant in applicants" 
                  :key="applicant.id"
                  :class="{ 'pr-1 border-bottom-0': activeApplicant == applicant.id, 'list-group-item pr-1 pb-0 pt-0 border-bottom-0 clickable': true}"
              >
                <div @click="viewApplicant(applicant.id, applicant.firstname, applicant.lastname, applicant.photo)" 
                      :class="{ 'active': activeApplicant == applicant.id, 'pt-3 non-active container-fluid': true}">
                  <div class="row">
                    <div :class="{ 'pl-1': activeApplicant == applicant.id, 'col-1 col-sm-1 col-md-1 pl-1': true}">
                      <img :src="applicant.photo" alt="" 
                      :class="{'rounded-circle avatar': activeApplicant == '', 'rounded-circle avatar-min': activeApplicant != ''}">
                    </div>
                    <div class="col-8 col-sm-11 col-md-11 pr-0 pl-4-small">
                      <div :class="{ 'border-bottom-transparent': activeApplicant == applicant.id, 'pb-3 border-bottom-custom': true}"
                      >
                        <span class="d-block custom-span">
                          <router-link :to="'/view/'+applicant.id" class="a-custom small">{{applicant.firstname}}  {{applicant.lastname}}</router-link>
                          <span class="small"> &#183; </span> 
                          <span class="small text-muted"> <small>{{applicant.number | oridinal}}</small></span> 
                          <span class="small"> &#183; </span> 
                          <a to="/edit" class="a-custom small" @click="editMode($event, applicant.id)">Edit applicant</a>
                        </span>
                        <span class="d-block custom-span" v-if="applicant.position || applicant.company">
                          <span class="small">{{applicant.position}}</span> <span class="small">at</span> <span class="small">{{applicant.company}}</span>
                        </span>
                        <span class="d-block custom-span text-muted small">
                          <span class="small">{{applicant.address}}</span>, <span class="small">{{applicant.city}}</span>, <span class="small">{{applicant.country}}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>

            <ul v-else class="list-group list-group-flush rounded list-border-custom">
              <li class="list-group-item border-bottom-0">
                <button @click="createApplicant()" class="btn btn-light btn-sm">
                  Add dummy applicant 
                </button>
                &#183;
                <span v-if="!applicants.length"
                      class="text-muted font-weight-light small"
                >
                  No applicants to show.
                </span>
              </li>
            </ul>
          </div>
          <div class="col-md-4" v-if="activeApplicant != ''">
            <experience v-bind="userIdDyn"></experience>
            <education v-bind="userIdDyn"></education>
          </div>
          <div class="col-md-3" v-if="activeApplicant != ''">
            <chat v-bind="userInfoDyn"></chat>
          </div>
        </div>
      </div>
    </div>
  </main>

</div>
</template>

<script>

import { mapState } from 'vuex'
import experience from '@/components/experience'
import education from '@/components/education'
import chat from '@/components/chat'

export default {
  data() {
    return {
      find: '',
      activeApplicant: '',
      firstname: '',
      lastname: '',
      photo: '',
      firstLoad: true
    };
  },
  components: {
    experience,
    education,
    chat
  },
  created: function() {
    console.log("CREATED: ")
    console.log(this.loggedOut)

    if(this.loggedOut){
      this.$store.dispatch('fetchApplicants')
      this.loggedOut = false
    }

    if(this.applicants.length > 0)
      this.viewFromRoute();
  },
  computed: {
    ...mapState(['applicants']),
    userIdDyn: function() {
      return {userId: this.activeApplicant}
    },
    userInfoDyn: function(){
      return {userId: this.activeApplicant,
              firstname: this.firstname,
              lastname: this.lastname,
              photo: this.photo
            }
    }
  },
  methods: {
    createApplicant() {
      this.$store.dispatch('createApplicant', {})
    },
    searchApplicants() {
      this.activeApplicant = ''
      this.$router.push('/')
      this.$store.dispatch('findApplicants', {find: this.find})
    },
    viewApplicant(applicant, firstname, lastname, photo) {     
      if(this.activeApplicant != applicant){
        this.activeApplicant = applicant
        this.firstname = firstname
        this.lastname = lastname
        this.photo = photo

        this.$store.dispatch('viewApplicant', applicant)

        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        
      } else {
        this.activeApplicant = ''
        this.$router.push('/')
      }
    },
    viewFromRoute(){
      if(this.$route.params.id && this.firstLoad){
        this.firstLoad = false

        let flag = false, i

        for(i in this.applicants){
          if(this.applicants[i].id == this.$route.params.id){
            flag = true;

            this.firstname = this.applicants[i].firstname
            this.lastname = this.applicants[i].lastname
            this.photo = this.applicants[i].photo
          }
        }

        if(flag)
          this.viewApplicant(this.$route.params.id, this.firstname, this.lastname, this.photo)
        else
          this.notFound()
      } else {
        this.firstLoad = false
      }
    },
    clearDashboard(){
      this.activeApplicant = ''

      if(this.find != ''){
        this.find = ''

        this.$store.dispatch('fetchApplicants')
      }
    },
    editMode(event, id){
      event.stopPropagation()
      this.$router.push('/edit/'+id)
    },
    notFound() {
      this.$router.push('/error')
    },
    logout() {
      this.$store.dispatch('logout')
    }
  },
  filters: {
    oridinal: function (value) {
      var j = value % 10,
      k = value % 100;
      
      if(j == 1 && k != 11){
          return value + "st"
      }

      if(j == 2 && k != 12){
          return value + "nd"
      }

      if(j == 3 && k != 13){
          return value + "rd"
      }

      return value + "th"
    }
  },
  beforeCreate: function() {
    document.body.className = 'dashboard';
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.previousRoute = from
    })
  },
  watch: {
    applicants (newAppl, oldAppl) {
      this.viewFromRoute()
    }
  }
}

</script>

<style>
  @import '../assets/styles/dashboard.css';
</style>
