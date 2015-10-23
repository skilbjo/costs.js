echo Attempting to gnu unzip the costs.sql.gz file
 
izarce costs.sql.gz
 
echo Attempting to backup mysql
 
mysql -u root -proot costs < Costs-04-Aug-2015.sql
