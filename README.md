# appmgmt
Demo web app for applicant management created using vuejs and firebase.

## Firebase structure
Firebase realtime db has 5 collections:

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

education
|- userId (String)
|- university (String)
|- faculty (String)
|- startDate (Timestamp)
|- endDate (Timestamp)
|- present (Boolean)
|- createdOn (Timestamp)

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

messages
|- message (String)
|- senderId (String)
|- receiverId (String)
|- refByUser (String)
|- createdOn (Timestamp)

users
|- email (String)
|- firstname (String)
|- latname (String)
|- photo (String)

## Search 
Search is implemented using algolia search-as-a-service. Using firebase cloud functions, triggers are set up in the backend to listen for changes on applicant collection (onCreate, onUpdate and onDelete) to replicate data to algolia service using their API. 

As you type in search bar app is querying algolia service and returning applicants matching search criteria.

## Auth 
Authentication is created by using firebase auth service.

## Database rules
Simple database rules are implemented so only authenticated user (Admin) can query database.

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
