# appmgmt
Demo web app for applicant management created using vuejs and firebase.

## Firebase structure
Firebase realtime db has 5 collections:

```
applicants  
|- firstname (String)  
|- lastname (String)  
|- photo (String)  
|- address (String)  
|- city (String)  
|- country (String)  
|- city (String)  
|- company (String)  
|- position (String)  
|- createdOn (Timestamp)
```

```
education  
|- userId (String)  
|- university (String)  
|- faculty (String)  
|- startDate (Timestamp)  
|- endDate (Timestamp)  
|- present (Boolean)  
|- createdOn (Timestamp)
```

```
experience  
|- userId (String)  
|- company (String)  
|- position (String)  
|- location (String)  
|- photo (String)  
|- startDate (Timestamp)  
|- endDate (Timestamp)  
|- present (Boolean)  
|- createdOn (Timestamp)
```

```
messages  
|- message (String)  
|- senderId (String)  
|- receiverId (String)  
|- refByUser (String)  
|- createdOn (Timestamp)
```

* Note: refByUser: Added redundant field so app doesn't need to use where query 2x   (senderId == userId || receiverId == userId) times when fetching messages because firebase doesn't support OR like clause. When we need to fetch user messages we simply fetch by refByUser (It doesn't matter who sent the message: admin or user).


``` 
|- email (String)  
|- firstname (String)  
|- latname (String)  
|- photo (String)
```
* Note: Holds admin information. Documents id are identical to UUID in authentication.

## Search 
Search is implemented using algolia search-as-a-service. Using firebase cloud functions, triggers are set up in the backend to listen for changes on applicant collection (onCreate, onUpdate and onDelete) to replicate data to algolia service using their API. 

As you type in search bar app is querying algolia service and returning applicants matching search criteria.

Note: Web app is currently using trial on algolia (14 days from 08.06.2020).

## Auth 
Authentication is created by using firebase auth service.

## Database rules & indexes
Simple database rules are implemented so only authenticated user (Admin) can write to database.
```
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read;
      allow write: if request.auth.uid != null
    }
  }
}
```
Compound indexes created:
```
experience
userId Ascending createdOn Descending

education
userId Ascending createdOn Descending

messages
refByUser Ascending createdOn Ascending
```
## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
