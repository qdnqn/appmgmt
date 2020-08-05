import Vue from 'vue'
import Vuex from 'vuex'
import * as fb from '../firebase'
import router from '../router/index'
import algoliasearch from 'algoliasearch/lite';
import moment from 'moment'

Vue.use(Vuex)

fb.applicantsCollection.orderBy('createdOn', 'desc').onSnapshot(snapshot => {
  let applicantsArray = []
  
  snapshot.forEach(doc => {
    let applicant = doc.data()
    applicant.id = doc.id
    applicant.number = 1;
    
    applicantsArray.push(applicant)
  })

  store.commit('setApplicants', applicantsArray)
})

const store = new Vuex.Store({
  state: {
    applicantExperience: {},
    applicantEducation: {},
    applicantMessages: {},
    applicants: []
  },
  mutations: {
    setApplicantEducation(state, val) {
      state.applicantEducation = val
    },

    setApplicantExperience(state, val) {
      state.applicantExperience = val
    },

    setApplicantMessages(state, val){
      state.applicantMessages = val
    },

    setApplicants(state, val) {
      state.applicants = val
    }
  },
  actions: {
    async login({ dispatch }, form) {
      const { user } = await fb.auth.signInWithEmailAndPassword(form.email, form.password)
      router.push('/').catch(()=>{});
    },

    async fetchApplicants({ commit }) {
      fb.applicantsCollection.orderBy('createdOn', 'desc').onSnapshot(snapshot => {
        let applicantsArray = []
        
        snapshot.forEach(doc => {
          let applicant = doc.data()
          applicant.id = doc.id
          applicant.number = 1;
          
          applicantsArray.push(applicant)
        })

        store.commit('setApplicants', applicantsArray)
      })
    },

    async fetchApplicantExperience({ commit }, user) {
      console.log(user)
      fb.experienceCollection.where("userId", "==", user).orderBy('createdOn', 'desc').onSnapshot(snapshot => {
      let experienceArray = []
      
      snapshot.forEach(doc => {
        let experienceEntry = doc.data()
        experienceEntry.id = doc.id
        
        experienceArray.push(experienceEntry)
      })

      store.commit('setApplicantExperience', experienceArray)
    })
    },

    async fetchApplicantEducation({ commit }, user) {
      fb.educationCollection.where("userId", "==", user).orderBy('createdOn', 'desc').onSnapshot(snapshot => {
      let educationArray = []
      
      snapshot.forEach(doc => {
        let educationEntry = doc.data()
        educationEntry.id = doc.id
        
        educationArray.push(educationEntry)
      })

      store.commit('setApplicantEducation', educationArray)
    })
    },

    async fetchApplicantMessages({ commit }, userId) {
      fb.messagesCollection.where("refByUser", "==", userId).orderBy('createdOn', 'desc').onSnapshot(snapshot => {
      let messagesArray = []
      let group = {}
      
      snapshot.forEach(doc => {
        let message = doc.data()
        message.id = doc.id
        
        message.dateGroup = moment.unix(doc.data().createdOn.seconds).format("DDMMYYYY");

        messagesArray.unshift(message)
      })

      store.commit('setApplicantMessages', messagesArray)
    })
    },

    async createApplicant() {
      await fb.applicantsCollection.add({
        firstname: Vue.faker().name.firstName(),
        lastname:  Vue.faker().name.lastName(),
        photo: Vue.faker().image.avatar(),
        position: Vue.faker().name.jobTitle(),
        company: Vue.faker().company.companyName(),
        country: Vue.faker().address.country(),
        city: Vue.faker().address.city(),
        address: Vue.faker().address.streetAddress(),
        createdOn: new Date(),
      })
    },

    async createExperience({ state }, uid) {
      await fb.experienceCollection.add({
        userId: uid.userId,
        photo: Vue.faker().image.avatar(),
        position: Vue.faker().name.jobTitle(),
        company: Vue.faker().company.companyName(),
        startDate: Vue.faker().date.between('2000-01-01', '2005-12-31'),
        endDate: Vue.faker().date.between('2005-12-31', '2020-12-31'),
        location: Vue.faker().address.city(),
        present: (Math.random() < 0.5) ? true : false,
        createdOn: new Date()
      })
    },

    async createEducation({ state }, uid) {
      await fb.educationCollection.add({
        userId: uid.userId,
        university: 'University of ' + Vue.faker().address.city(),
        faculty: 'Department of ' + Vue.faker().name.jobArea(),
        startDate: Vue.faker().date.between('2000-01-01', '2005-12-31'),
        endDate: Vue.faker().date.between('2005-12-31', '2020-12-31'),
        present: (Math.random() < 0.5) ? true : false,
        createdOn: new Date()
      })
    },

    async createMessage({ state }, message) {
      await fb.messagesCollection.add({
        senderId: message.senderId,
        receiverId: message.receiverId,
        message: Vue.faker().lorem.paragraph(),
        refByUser: message.refByUser,
        createdOn: new Date()
      })
    },

    async viewApplicant({dispatch}, id) {
      dispatch('fetchApplicantExperience', id)
      dispatch('fetchApplicantEducation', id)
      dispatch('fetchApplicantMessages', id)

      router.push('/view/'+id);
    },

    async findApplicants({dispatch}, query) {
      var client = algoliasearch("EIYLU23CL1", "60f1ef4e287eb0e80e12a69ab3d83754");
      var index = client.initIndex('applicants');

      let applicantsArray = [], i = 0

      console.log(query.find)

      if(query.find == ""){
        fb.applicantsCollection.orderBy('createdOn', 'desc').onSnapshot(snapshot => {
          let applicantsArray = []
          
          snapshot.forEach(doc => {
            let applicant = doc.data()
            applicant.id = doc.id
            applicant.number = 1;
            
            applicantsArray.push(applicant)
          })

          store.commit('setApplicants', applicantsArray)
        })
      } else {
        return index
          .search(query.find)
          .then(function(responses) {
            for(i in responses.hits){
              let applicant = responses.hits[i];
              applicant.id = applicant.objectID;
              applicant.number = 1;

              applicantsArray.push(applicant)
            }

            store.commit('setApplicants', applicantsArray)
          });
      }
    }
  },
  modules: {
  }
})

export default store