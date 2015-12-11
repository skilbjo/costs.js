#!/bin/bash

# Database credentials
db_name="costs"

# Other options
backup_path="/Users/jskilbeck/Code/Node/costsjs/db_backup/postgres"
date=$(date +"%d-%b-%Y")
sql_file=$db_name
gnu_file=$sql_file.gz
username="skilbjo"
server="finance"
server_path="/home/skilbjo/code/sql/costsjs/postgres"

# Set file permissions
umask 177

# Create backup
pg_dump -c -U $username $db_name > $backup_path/$db_name-$date.sql

# Delete old backups
# find . -name "$backup_path/*.sql" -mtime +45 exec rm {} \;

# GNU Zip Global
cp $backup_path/$db_name-$date.sql $backup_path/$sql_file
gzip -c $backup_path/$sql_file > $backup_path/$gnu_file

# SSH transfer
cat $backup_path/$gnu_file | ssh $username@$server "cat > $server_path/$gnu_file"

# GNU unZip
ssh $username@$server "gzip -df $server_path/$gnu_file"

# psql load
ssh $username@$server "psql -U $username $db_name < $server_path/$sql_file"


