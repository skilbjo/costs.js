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
~~~~
var 	MonthNumber 	= '06',  /* <-- increment up! */
~~~~
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


