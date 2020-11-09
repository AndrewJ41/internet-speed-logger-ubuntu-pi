// DB Init script for creating mongo infrastruction
// v.0.1.0
//
// Switch to use the new DB Name
db = db.getSiblingDB('speedtest')

// Create the collection for speedtest to write to
db.createCollection('speedtest')

// Print the created db and collection to console
print("Using DB:",db.getName())
print("Collections in DB:",db.getCollectionNames())

// Create speedtest user on the newly created db and log to console
db.createUser( { user: 'speedtest', pwd: 'speedtest', roles: [] } )
