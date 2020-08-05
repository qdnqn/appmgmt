<template>
  <ul class="list-group list-group-flush rounded-top-custom list-border-custom">
    <li class="list-group-item p-1 small">
      <span class="small custom-heading">{{firstname}} {{ lastname }}</span> &middot; 
      <a @click="createMessage('admin')" class="a-custom small">Send as admin</a> &middot;  
      <a @click="createMessage('user')" class="a-custom small">Send as user</a>
    </li>
    <li class="list-group-item p-0">
      <ul id="chat_ul" class="list-group list-group-flush rounded-0 border-0 fixed-height-chat" 
          v-chat-scroll="{smooth: true}"
    >
        <li v-if="!applicantMessages.length" class="list-group-item p-1 border-0">
          <div class="container-fluid pt-1">
            <div class="row">
              <div class="col-12 col-sm-12 col-md-12 text-center">
                <div class="pb-3 small">
                  <span class="d-block custom-span small bold-custom">
                    No messages found.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </li>
        <li v-for="message in applicantMessagesComputed" :key="message.id" class="list-group-item p-1 border-0">
          <div class="date-breaker small" v-if="message.dateShow">
            <span class="date-breaker-text small text-uppercase text-muted">
              {{message.createdOn | moment }}
            </span>
          </div>
          <div class="container-fluid pt-1">
            <div class="row">
              <div class="col-1 col-sm-1 col-md-1 pl-0" v-if="message.senderId == 0">
                <img src="../assets/images/dummy.png" alt="" class="avatar-chat rounded-circle">
              </div>
              <div class="col-1 col-sm-1 col-md-1 pl-0" v-if="message.senderId != 0">
                <img :src="photo" alt="" class="avatar-chat rounded-circle">
              </div>
              <div class="col-8 col-sm-11 col-md-11 pr-0 pl-4-small">
                <div class="pb-3 small">
                  <span class="d-block custom-span small bold-custom" v-if="message.senderId == userId">
                    {{firstname}} {{ lastname }} &middot; {{ message.createdOn | momentHour }}
                  </span>
                  <span class="d-block custom-span small bold-custom" v-if="message.senderId != userId">
                    Admin &middot; {{ message.createdOn | momentHour }}
                  </span>
                  <span class="d-block custom-span small">
                    {{ message.message }} 
                  </span> 
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
import { messageCollection } from '@/firebase'
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  props: ['userId','firstname','lastname', 'photo'],
  data() {
    return {
    }
  },
  computed: {
    ...mapState(['applicantMessages']),
    applicantMessagesComputed: function(){
      let group = {};
      let i;

      let messages = this.applicantMessages;

      for(i in messages){
        if(typeof group[messages[i].dateGroup] == 'undefined'){
          group[messages[i].dateGroup] = true;
          messages[i].dateShow = true;
        } else {
          messages[i].dateShow = false;
        }
      }

      return messages;
    }
  },
  methods: {
    createMessage(sender) {
      let message = {};

      if(sender == 'admin'){
        message.senderId = 0;
        message.receiverId = this.userId
        message.refByUser = this.userId
      } else {
        message.senderId = this.userId
        message.receiverId = 0
        message.refByUser = this.userId
      }

      this.$store.dispatch('createMessage', message)
    }
  },
  updated: function () {
    this.$nextTick(function () {
      var objDiv = document.getElementById("chat_ul");
      objDiv.scrollTop = objDiv.scrollHeight;
    })
  },
  filters: {
    moment: function (date) {
      return moment.unix(date.seconds).format('MMM DD, YYYY');
    },
    momentHour: function (date) {
      return moment.unix(date.seconds).format('HH:mm');
    }
  }
}
</script>

