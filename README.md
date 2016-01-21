## Parser/DB Importer to local mySQL database for Yapstone Processor Statements

### Install

#### Dependencies

Make sure you have `mysql` and `node.js` installed! 

#### Repo
````
$ git clone git@github.com/skilbjo/parser.git
$ cd parser
$ npm install
$ mysql.server start
````

### Parsers 

#### Vantiv

1. Place data in `data/Vantiv`

2. Change month variable

````
cd src/
vim Vantiv_Import.js
...
var 	MonthNumber 	= '06',  /* <-- increment up! */
...
:x!
````

3. Run the script

````
$ node Vantiv_Import.js
````

#### Paymentech to-do

- Try to find a non-aggregate file with merchant-level data (currently only supports the single aggregation level file)

#### Global Payments to-do

1. Place data in `data/GlobalPayments/csv`

### Maintenance // pushing dev DB to production server

#### Backup 

1. Create a backup from the development machine, either manually or automatically

	- manual: `mysqld -u root -p costs > costs.sql`
	- automatically: `cd automatation && ./backup.sh`

2. Connect to production server
	- smb: `open smb://000113-DT/Users/jskilbeck`
	- ssh: `ssh jskilbeck@0001113-DT`

3. Move the backup file from the development machine to the production server
	- smb: `mv Costs-27-Jul-2015.sql /Volumes/jskilbeck/Desktop/Costs.sql`
	- ssh: `/* to do */`
	- sftp: `/* to do */`
	- email: `mail.yapstone.com`

4. Restore the production server database from the backup file
	- windows: `mysql -u root -p costs < Desktop\Costs.sql`

If you get an `Acess is denied.` message, it is probably a corrupt `.sql` file, so try steps 3 and 4 again !


#### Tricks

If you get a `ER_MAX_PACKET_TOO_LARGE`,

````
$ mysql -u root
mysql> set global max_allowed_packet= 900*1024*1024;
Query OK, 0 rows affected
````

#### To Do

Change insert statements to be streaming:

````
var query = connection.query('SELECT * FROM posts');
query
  .on('error', function(err) {
    // Handle error, an 'end' event will be emitted after this as well
  })
  .on('fields', function(fields) {
    // the field packets for the rows to follow
  })
  .on('result', function(row) {
    // Pausing the connnection is useful if your processing involves I/O
    connection.pause();

    processRow(row, function() {
      connection.resume();
    });
  })
  .on('end', function() {
    // all rows have been received
  });
````

#### Start Databases

MySQL: `$ mysql.server start`
Postgres: `$ postgres -D /usr/local/var/postgres --fork`
Postgres 9.5: `$ postgres -D /usr/local/var/postgres9.5/ &`


