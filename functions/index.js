const functions = require('firebase-functions');
const admin = require('firebase-admin');

let Promise = require('promise');

const cors = require('cors')({ origin: true });
const auth = require('basic-auth');
const request = require('request');
const algoliasearch = require('algoliasearch');

admin.initializeApp();
const db = admin.firestore();

exports.addApplicantToAlgolia = functions.firestore.document('applicants/{documentId}')
.onCreate((event, context)  => {
  const data = {
    objectID: context.params.documentId,
    photo: event.data().photo,
    position: event.data().position,
    firstname: event.data().firstname, 
    lastname: event.data().lastname,
    company: event.data().company,
    address: event.data().address,
    city: event.data().city,
    country: event.data().country
   };

  return addToAlgolia(data, 'applicants')
   .then(res => console.log('Success: Applicant add to algolia.', res))
   .catch(err => console.log('Error: Applicant add to algolia', err));
});

exports.editApplicantOnAlgolia = functions.firestore.document('applicants/{documentId}')
.onUpdate((event,context) => {
  const data = {
    objectID: context.params.documentId,
    photo: event.after.data().photo,
    position: event.after.data().position,
    firstname: event.after.data().firstname, 
    lastname: event.after.data().lastname,
    company: event.after.data().company,
    address: event.after.data().address,
    city: event.after.data().city,
    country: event.after.data().country
   };

  return editOnAlgolia(data, 'applicants')
   .then(res => console.log('Success: Applicant edit on algolia', res))
   .catch(err => console.log('Success: Applicant edit on algolia', err));
});

exports.removeApplicantFromAlgolia = functions.firestore.document('applicants/{documentId}')
.onDelete((event, context) => {
  const objectID = context.params.documentId;
  return removeFromAlgolia(objectID, 'applicants')
   .then(res => console.log('Success: Applicant remove from algolia', res))
   .catch(err => console.log('Success: Applicant remove from algolia', err));
})

function addToAlgolia(object, indexName) {
  const ALGOLIA_ID = functions.config().algolia.app_id;
  const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;
  const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
  const index = client.initIndex(indexName);
return new Promise((resolve, reject) => {
  index.saveObject(object)
  .then(res => { console.log('res GOOD', res); resolve(res) })
  .catch(err => { console.log('err BAD', err); reject(err) });
 });
}

function editOnAlgolia(object, indexName) {
  const ALGOLIA_ID = functions.config().algolia.app_id;
  const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;
  const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
  const index = client.initIndex(indexName);
return new Promise((resolve, reject) => {
  index.saveObject(object)
  .then(res => { console.log('res GOOD', res); resolve(res) })
  .catch(err => { console.log('err BAD', err); reject(err) });
 });
}

function removeFromAlgolia(objectID, indexName) {
  const ALGOLIA_ID = functions.config().algolia.app_id;
  const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;
  const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
  const index = client.initIndex(indexName);

  return new Promise((resolve, reject) => {
    index.deleteObject(objectID)
    .then(res => { console.log('res GOOD', res); resolve(res) })
    .catch(err => { console.log('err BAD', err); reject(err) });
   });
}