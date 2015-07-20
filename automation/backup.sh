#!/bin/bash

# Database credentials
user="root"
password=""
host="localhost"
db_name="Costs"

# Other options
backup_path="/Users/jskilbeck/Code/Node/mysql/db_backup"
date=$(date +"%d-%b-%Y")

# Set file permissions
umask 177

# Create backup
mysqldump --user=$user --password=$password --host=$host $db_name > $backup_path/$db_name-$date.sql

# Delete old backups
# find $backup_path/* -name *.sql -mtime +45 exec rm {} \;
