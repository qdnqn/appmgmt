<template>
<div class="max-width">
  <nav class="navbar navbar-expand-md navbar-dark bg-custom navbar-static-top">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand">LOGO</router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    </div>
  </nav>

  <main role="main" class="edit container container-fluid mt-5 mb-5">
    <div class="row justify-content-md-center">
      <div class="col-md-11 col-12 col-sm-12">
        <div class="row">
          <div class="col-md-12 col-12 col-sm-12">
            <ul class="list-group list-group-flush rounded list-border-custom">
              <li class="list-group-item border-bottom-0">
                <span class="custom-heading small">
                  Editing applicant {{applicant.firstname }} {{ applicant.lastname}}.
                </span>
              </li>

              <li class="list-group-item">
                <div class="non-active container-fluid">
                  <div class="row">
                    <div class="col-1 col-sm-1 col-md-1 pl-0">
                      <img :src="applicant.photo" alt="" class="rounded-circle avatar">
                    </div>
                    <div class="col-8 col-sm-11 col-md-11 pr-0">
                      <div class="">
                        <span class="d-block custom-span">
                          <router-link :to="'/view/'+applicant.id" class="a-custom small">{{applicant.firstname}}  {{applicant.lastname}}</router-link>
                        </span>
                        <span class="d-block custom-span">
                          <span class="small">{{applicant.position}}</span> <span class="small">at</span> <span class="small">{{applicant.company}}</span>
                        </span>
                        <span class="d-block custom-span text-muted small">
                          <span class="small">{{applicant.address}}</span>, <span class="small">{{applicant.city}}</span>, <span class="small">{{applicant.country}}</span>
                        </span>
                        <button class="btn btn-danger btn-sm mt-3" @click="removeApplicantFirst()">Delete applicant</button>
                        <a class="a-custom btn btn-default btn-sm mt-3" @click="removeApplicant()">I am sure</a>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              <li class="list-group-item">
                <div class="non-active container-fluid">
                  <div class="row">
                    <div class="col-1 col-sm-1 col-md-1 pl-0">
                      
                    </div>
                    <div class="col-11 col-sm-11 col-md-11">
                      <div class="row">
                        <div class="col-11 col-sm-6 col-md-6">
                          <span class="custom-heading small display-block">
                            Edit personal information 
                            <span class="badge badge-warning" v-if="changed">
                              Changes not saved!
                            </span>
                          </span>
                          <form v-on:submit.prevent="onSubmit">
                            <div class="form-group input-group-sm mt-3">
                              <label class="small text-muted">Firstname</label>
                              <input type="text" class="form-control" v-model="applicant.firstname" v-on:keyup="check()" placeholder="Firstname">
                            </div>
                            <div class="form-group input-group-sm">
                              <label class="small text-muted">Lastname</label>
                              <input type="text" class="form-control" v-model="applicant.lastname" v-on:keyup="check()" placeholder="Lastname">
                            </div>
                            <div class="form-group input-group-sm">
                              <label class="small text-muted">Country</label>
                              <input type="text" class="form-control" v-model="applicant.country" v-on:keyup="check()" placeholder="Country">
                            </div>
                            <div class="form-group input-group-sm">
                              <label class="small text-muted">City</label>
                              <input type="text" class="form-control" v-model="applicant.city" v-on:keyup="check()" placeholder="City">
                            </div>
                            <div class="form-group input-group-sm">
                              <label class="small text-muted">Company</label>
                              <input type="text" class="form-control" v-model="applicant.company" v-on:keyup="check()" placeholder="Company">
                            </div>
                            <div class="form-group input-group-sm">
                              <label class="small text-muted">Position</label>
                              <input type="text" class="form-control" v-model="applicant.position" v-on:keyup="check()" placeholder="Position">
                            </div>
                            <div v-if="update.type == 'success'">
                              <div class="alert alert-success p-1" role="alert">
                                <small>{{update.message}} <a class="a-custom" @click="undo()">Undo?</a></small>
                              </div>
                            </div>
                            <div v-if="update.type == 'undo'">
                              <div class="alert alert-info p-1" role="alert">
                                <small>{{update.message}}</small>
                              </div>
                            </div>
                            <input type="submit" class="btn btn-primary btn-sm" value="Save changes">
                          </form>
                        </div>

                        <div class="col-11 col-sm-6 col-md-6">
                          <div>
                            <span class="custom-heading small display-block">
                              Add experience <a class="a-custom small" v-b-toggle.collapse-1 variant="primary">(+)</a>
                            </span>
                            <div v-if="addExp.type == 'success'">
                              <div class="alert alert-success p-1 mt-2" role="alert">
                                <small>{{addExp.message}}</small>
                              </div>
                            </div>
                            <b-collapse id="collapse-1" class="mt-2">
                              <b-card>
                                <form v-on:submit.prevent="onSubmitExp">
                                  <div class="form-group input-group-sm">
                                    <label class="small text-muted">Company</label>
                                    <input type="text" class="form-control" v-model="exp.company" placeholder="Company">
                                  </div>
                                  <div class="form-group input-group-sm">
                                    <label class="small text-muted">Position</label>
                                    <input type="text" class="form-control" v-model="exp.position" placeholder="Position">
                                  </div>
                                  <div class="form-group input-group-sm">
                                    <label class="small text-muted">Location</label>
                                    <input type="text" class="form-control" v-model="exp.location" placeholder="Location">
                                  </div>
                                  <div class="form-group input-group-sm">
                                    <label class="small text-muted">Started at</label>
                                    <datetime v-model="exp.startDate"></datetime>
                                  </div>
                                  <div class="form-group input-group-sm" v-if="!exp.present">
                                    <label class="small text-muted">End at</label>
                                    <datetime v-model="exp.endDate"></datetime>
                                  </div>
                                  <div class="form-check">
                                    <input type="checkbox" class="form-check-input" v-model="exp.present">
                                    <label class="form-check-label small">Currently working here</label>
                                  </div>
                                  <input type="submit" class="btn btn-primary btn-sm mt-3" value="Add new experience">
                                </form>
                              </b-card>
                            </b-collapse>
                            <div class="mt-3">
                              <experience v-bind="userIdDyn"></experience>
                            </div>
                          </div>
                          <div class="mt-5">
                            <span class="custom-heading small display-block">
                              Add education <a class="a-custom small" v-b-toggle.collapse-2 variant="primary">(+)</a>
                            </span>
                            <b-collapse id="collapse-2" class="mt-2">
                              <b-card>
                                <form v-on:submit.prevent="onSubmitEdu">
                                  <div class="form-group input-group-sm">
                                    <label class="small text-muted">University</label>
                                    <input type="text" class="form-control" v-model="edu.university" placeholder="University">
                                  </div>
                                  <div class="form-group input-group-sm">
                                    <label class="small text-muted">Faculty</label>
                                    <input type="text" class="form-control" v-model="edu.faculty" placeholder="Faculty">
                                  </div>
                                  <div class="form-group input-group-sm">
                                    <label class="small text-muted">Started at</label>
                                    <datetime v-model="edu.startDate"></datetime>
                                  </div>
                                  <div class="form-group input-group-sm" v-if="!edu.present">
                                    <label class="small text-muted">End at</label>
                                    <datetime v-model="edu.endDate"></datetime>
                                  </div>
                                  <div class="form-check">
                                    <input type="checkbox" class="form-check-input" v-model="edu.present">
                                    <label class="form-check-label small">Currently studying here</label>
                                  </div>
                                  <input type="submit" class="btn btn-primary btn-sm mt-3" value="Add new education">
                                </form>
                              </b-card>
                            </b-collapse>
                            <div class="mt-3">
                              <education v-bind="userIdDyn"></education>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>


            </ul>
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
import { Datetime } from 'vue-datetime';

export default {
  data() {
    return {
      oldApplicant: {},
      changed: false,
      lock: false,
      edu: {
        university: '',
        faculty: '',
        startDate: '',
        endDate: '',
        present: false,
        userId: ''
      },
      exp: {
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        location: '',
        present: false,
        userId: ''
      }
    }
  },
  components: {
    experience,
    education,
    datetime: Datetime
  },
  computed: {
    ...mapState(['applicant','update','addExp']),
    userIdDyn: function() {
      return {userId: this.applicant.id}
    },
  },
  created: function(){
    if(this.$route.params.id){
      this.$store.dispatch('fetchApplicant', this.$route.params.id)
    }
  },
  methods: {
    onSubmit() {
      this.lock = true
      this.$store.dispatch('updateApplicant', this.applicant)
    },
    onSubmitExp() {
      this.exp.userId = this.applicant.id
      this.$store.dispatch('addApplicantExperience', this.exp)
    },
    onSubmitEdu() {
      this.exp.userId = this.applicant.id
      this.$store.dispatch('addApplicantEducation', this.edu)
    },
    undo() {
      console.log("Trying undo")
      this.$store.dispatch('updateApplicant', this.oldApplicant)
    },
    check() {
      if(this.oldApplicant.firstname != this.applicant.firstname ||
         this.oldApplicant.lastname != this.applicant.lastname ||
         this.oldApplicant.country != this.applicant.country ||
         this.oldApplicant.city != this.applicant.city ||
         this.oldApplicant.company != this.applicant.company ||
         this.oldApplicant.position != this.applicant.position
        )
        this.changed = true
      else
        this.changed = false
    },
    notFound() {
      this.$router.push('/error')
    }
  },
  filters: {
    
  },
  beforeCreate: function() {
    document.body.className = 'dashboard';
  },
  watch: {
    applicant: function(newApplicant, old){
      if(!this.lock){
        this.oldApplicant = Object.assign({}, newApplicant);
        this.oldApplicant.undo = true;
      }
    },
    update: function(){
      if(this.update.type == "success"){
        this.changed = false

        setTimeout(() => { 
          this.$store.state.update = {}
          this.lock = false
          this.oldApplicant = this.applicant
        }, 10000)
      } else if(this.update.type == "undo"){
        this.changed = false

        setTimeout(() => { 
          this.$store.state.update = {}
          this.lock = false
          this.oldApplicant = this.applicant
        }, 5000)
      } else {
        this.lock = false
      }
    },
    addExp: function(){
      if(this.addExp.type == "success"){
        this.exp = {
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          location: '',
          present: false,
          userId: ''
        }

        this.$root.$emit('bv::toggle::collapse', 'collapse-1')

        setTimeout(() => { 
          this.$store.state.addExp = {}
        }, 10000)
      } 
    }
  }
}

</script>

<style>
  @import '../assets/styles/dashboard.css';
</style>
