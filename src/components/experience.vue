<template>
  <ul class="list-group list-group-flush rounded-top-custom list-border-custom">
    <li class="list-group-item">
      <span class="small custom-heading">Experience</span>
    </li>
    <li v-if="!applicantExperience.length" class="list-group-item">
      <span class="text-muted font-weight-light small">No experience added.</span>
    </li>
    <li class="list-group-item">
      <button @click="createExperience()" class="btn btn-light btn-sm">
        Add dummy experience 
      </button>
    </li>
    <li v-for="(entry, index) in applicantExperience" 
        :key="entry.id"
        :class="{'list-group-item pr-1 border-bottom-0 pb-0 pt-0': index != applicantExperience.length - 1,
                 'list-group-item pr-1 pt-0': index == applicantExperience.length - 1
                }"
    >
      <div class="container-fluid pt-3">
        <div class="row">
          <div class="col-1 col-sm-1 col-md-1 pl-0">
            <img src="../assets/images/dummy.png" alt="" class="avatar-job">
          </div>
          <div class="col-8 col-sm-11 col-md-11 pr-0 pl-4-small">
            <div :class="{'pb-3 border-bottom-custom': index != applicantExperience.length - 1}">
              <span class="d-block custom-span small bold-custom">
                {{entry.position}}
              </span>
              <span class="d-block custom-span small">
                {{entry.company}}
              </span>
              <span class="d-block custom-span text-muted">
                <span class="small">{{entry.startDate | moment}}</span> <span class="small">- </span> 
                <span class="small" v-if="!entry.present">{{entry.endDate | moment}}</span>
                <span class="small" v-if="entry.present">Present</span>
                &middot; 
                <span class="small">{{ dateDiff(entry.startDate, entry.endDate, entry.present) }}</span>
              </span>
              <span class="d-block custom-span text-muted">
                <span class="small">{{entry.location}}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import { experienceCollection } from '@/firebase'
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  props: ['userId'],
  data() {
    return {
    }
  },
  computed: {
    ...mapState(['applicantExperience'])
  },
  methods: {
    createExperience(userId) {
      this.$store.dispatch('createExperience', {userId: this.userId})
    },
    dateDiff(start, end, present){
      start = moment.unix(start.seconds)

      if(present)
        end =  moment(new Date())
      else
        end = moment.unix(end.seconds)

      let dd = moment.duration(end.diff(start));
      let ret = ''

      if(dd.years() > 0){
        if(dd.years() % 10 == 1)
          ret += dd.years() + ' year '
        else 
          ret += dd.years() + ' years '
      }

      if(dd.months() > 0){
        if(dd.months() % 10 == 1)
          ret += dd.months() + ' month '
        else 
          ret += dd.months() + ' months '
      }

      if(dd.months() < 1 && dd.years() < 1)
        ret = 'less than 1 month'

      return ret
    }
  },
  filters: {
    moment: function (date) {
      return moment.unix(date.seconds).format('MMM YYYY');
    }
  }
}
</script>

