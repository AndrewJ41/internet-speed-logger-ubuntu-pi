#!/bin/bash
export mongoAddr="localhost:27017"

echo "Beginning creation of mongoDB topology..."
echo "Connecting to mongo@"$mongoAddr  

# Create Mongo Topology
mongo $mongoAddr db-setup.js && echo "Finished creation of mongoDB topology!" || echo "Failed to complete mongoDB topology setup with error" && exit 1
