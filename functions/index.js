// this the firebase functions setup code
const functions = require('firebase-functions');
const admin = require('firebase-admin');
let Promise = require('promise');
const cors = require('cors')({ origin: true });
const auth = require('basic-auth');
const request = require('request');
const algoliasearch = require('algoliasearch');
admin.initializeApp();
const db = admin.firestore();

// listen for creating a piece of equipment in Firestore
exports.addApplicantToAlgolia = functions.firestore.document('applicants/{documentId}')
.onCreate((event, context)  => {
console.log('ADD APPLICANT EVENT IS', event);
const active = event.data().active === true ? "true" : "false"
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
 .then(res => console.log('SUCCESS ALGOLIA applicant ADD', res))
 .catch(err => console.log('ERROR ALGOLIA applicant ADD', err));
});

// listen for editing a piece of equipment in Firestore
/*
exports.editApplicantToAlgolia = functions.firestore.document('applicants/{document}')
.onUpdate(event => {
console.log('edit event', event.data.data())
const active = event.data.data().active === true ? "true" : "false"
const data = {
  firstname: event.data.data().firstname, 
  lastname: event.data.data().lastname,
  company: event.data.data().company,
  address: event.data.data().address,
  city: event.data.data().city,
  country: event.data.data().country
 };


console.log('DATA in is', data)
return editToAlgolia(data, 'applicant')
 .then(res => console.log('SUCCESS ALGOLIA applicant EDIT', res))
 .catch(err => console.log('ERROR ALGOLIA applicant EDIT', err));
});

// listen for a delete of a piece of equipment in Firestore
exports.removeApplicantFromAlgolia = functions.firestore.document('applicants/{document}')
.onDelete(event => {
 const objectID = event.params.document;
 return removeFromAlgolia(objectID, 'applicant')
 .then(res => console.log('SUCCESS ALGOLIA equipment ADD', res))
 .catch(err => console.log('ERROR ALGOLIA equipment ADD', err));
})

*/

// helper functions for create, edit and delete in Firestore to replicate this in Algolia
function addToAlgolia(object, indexName) {
 console.log('GETS IN addToAlgolia')
 console.log('object', object)
 console.log('indexName', indexName)
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

/*

function editToAlgolia(object, indexName) {
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
*/