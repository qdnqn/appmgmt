<template>
  <ul class="list-group list-group-flush list-border-custom rounded-bottom-custom">
    <li class="list-group-item">
      <span class="small custom-heading">Education</span>
    </li>

    <li v-if="!applicantEducation.length" class="list-group-item">
      <span class="text-muted font-weight-light small">No education added.</span>
    </li>
    <li class="list-group-item">
      <button @click="createEducation()" class="btn btn-light btn-sm">
        Add dummy education 
      </button>
    </li>
    <li v-for="(entry, index) in applicantEducation" 
        :key="entry.id"
        :class="{'list-group-item pr-1 border-bottom-0 pb-0 pt-0': index != applicantEducation.length - 1,
                 'list-group-item pr-1 pt-0': index == applicantEducation.length - 1
                }"
    >
      <div class="container-fluid pt-3">
        <div class="row">
          <div class="col-1 col-sm-1 col-md-1 pl-0">
            <img src="../assets/images/dummy.png" alt="" class="avatar-job">
          </div>
          <div class="col-8 col-sm-11 col-md-11 pr-0 pl-4-small">
            <div :class="{'pb-3 border-bottom-custom': index != applicantEducation.length - 1}">
              <span class="d-block custom-span small bold-custom">
                {{entry.university}}
              </span>
              <span class="d-block custom-span small">
                {{entry.faculty}}
              </span>
              <span class="d-block custom-span text-muted">
                <span class="small">{{entry.startDate | moment}}</span> <span class="small">- </span> 
                <span class="small" v-if="!entry.present">{{entry.endDate | moment}}</span>
                <span class="small" v-if="entry.present">Present</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import { educationCollection } from '@/firebase'
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  props: ['userId'],
  data() {
    return {
    }
  },
  computed: {
    ...mapState(['applicantEducation'])
  },
  methods: {
    createEducation(userId) {
      this.$store.dispatch('createEducation', {userId: this.userId})
    },
  },
  filters: {
    moment: function (date) {
      return moment.unix(date.seconds).format('MMM YYYY');
    }
  }
}
</script>

