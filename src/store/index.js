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
    admin: {},
    applicantExperience: {},
    applicantEducation: {},
    applicantMessages: {},
    applicants: [],
    applicant: {},
    update: {},
    addExp: {},
    addEdu: {}
  },
  mutations: {
    setAdmin(state, val){
      state.admin = val
    },
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
    },

    setApplicant(state, val) {
      state.applicant = val
    },

    setUpdateCompleted(state, val){
      state.update = val
    },

    setAddExp(state, val){
      state.addExp = val
    },

    setAddEdu(state, val){
      state.addEdu = val
    }
  },
  actions: {
    async login({ dispatch }, form) {
      const { user } = await fb.auth.signInWithEmailAndPassword(form.email, form.password)

      dispatch('fetchAdmin', user)
      dispatch('fetchApplicants')

      router.push('/').catch(()=>{});
    },

    async logout({ dispatch }) {
      await fb.auth.signOut()

      store.commit('setApplicants', {})
      store.commit('setApplicantEducation', {})
      store.commit('setApplicantExperience', {})
      store.commit('setApplicantMessages', {})
      store.commit('setApplicant', {})
      store.commit('setApplicants', {})

      router.push('/login')
    },


    async fetchAdmin({ commit }, user) {
      const admin = await fb.usersCollection.doc(user.uid).get()
      commit('setAdmin', admin.data())
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

    async fetchApplicant({dispatch}, id) {
      dispatch('fetchApplicantExperience', id)
      dispatch('fetchApplicantEducation', id)
      
      fb.applicantsCollection.doc(id).onSnapshot(doc => {
        let applicant = doc.data()
        applicant.id = doc.id
        store.commit('setApplicant', applicant)
      })
    },

    async viewApplicant({dispatch}, id) {
      dispatch('fetchApplicantExperience', id)
      dispatch('fetchApplicantEducation', id)
      dispatch('fetchApplicantMessages', id)

      router.push('/view/'+id);
    },

    async findApplicants({dispatch}, query) {
      var client = algoliasearch("EXLQASWZMZ", "9b1359906139b9b7ba2e76b0dc7f8586");
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
    },

    async addApplicantExperience({ state }, exp) {
      await fb.experienceCollection.add({
        userId: exp.userId,
        photo: Vue.faker().image.avatar(),
        position: exp.position,
        company: exp.company,
        startDate: new Date(exp.startDate),
        endDate: exp.present ? new Date() : new Date(exp.endDate),
        location: exp.location,
        present: exp.present,
        createdOn: new Date()
      }).then(function() {
        store.commit('setAddExp', {message: 'Successfully added new experience!', type: "success"})
      });
    },

    async addApplicantEducation({ state }, edu) {
      await fb.educationCollection.add({
        userId: edu.userId,
        university: edu.university,
        faculty: edu.faculty,
        startDate: new Date(edu.startDate),
        endDate: edu.present ? new Date() : new Date(edu.endDate),
        present: edu.present,
        createdOn: new Date()
      }).then(function() {
        store.commit('setAddEdu', {message: 'Successfully added new education!', type: "success"})
      });
    },

    async updateApplicant({dispatch}, applicant) {
      console.log(applicant)
      fb.applicantsCollection.doc(applicant.id).update({
        "firstname": applicant.firstname,
        "lastname": applicant.lastname,
        "country": applicant.country,
        "city": applicant.city,
        "company": applicant.company,
        "position": applicant.position
      }).then(function() {
        if(typeof applicant.undo == 'undefined')
          store.commit('setUpdateCompleted', {message: 'Successfully saved changes!', type: "success"})
        else
          store.commit('setUpdateCompleted', {message: 'Save action reversed!', type: "undo"})
      });
    },

    async deleteApplicant({ state }, userId) {
      fb.messagesCollection.where("refByUser", "==", userId).orderBy('createdOn', 'desc').onSnapshot(snapshot => {
        snapshot.forEach(doc => {
          fb.messagesCollection.doc(doc.id).delete()
        })
      })

      fb.experienceCollection.where("userId", "==", userId).orderBy('createdOn', 'desc').onSnapshot(snapshot => {
        snapshot.forEach(doc => {
          fb.experienceCollection.doc(doc.id).delete()
        })
      })

      fb.educationCollection.where("userId", "==", userId).orderBy('createdOn', 'desc').onSnapshot(snapshot => {
        snapshot.forEach(doc => {
          fb.educationCollection.doc(doc.id).delete()
        })
      })

      fb.applicantsCollection.doc(userId).delete()
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
    }
  },
  modules: {
  }
})

export default store