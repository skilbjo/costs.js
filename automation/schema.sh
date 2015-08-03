#!/bin/bash

# Database credentials
user="root"
password=""
host="localhost"
db_name="Costs"

# Other options
schema_path="/Users/jskilbeck/Code/Node/costsjs/src/1. Schema/SQL Schema"
date=$(date +"%d-%b-%Y")

# Set file permissions
umask 177

# Create backup
mysqldump -d --user=$user --password=$password --host=$host $db_name > "$schema_path"/$db_name-$date.sql

# Delete old backups
# find $schema_path/* -name *.sql -mtime +45 exec rm {} \;

