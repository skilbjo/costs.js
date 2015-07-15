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

### Vantiv to-do

- ParseInt on Txn_Amount (doesn't work for millions)
- ParseInt on Interchange
- Add checker to determine if *Division Summary* or *Chain Summary*
- if Checker for Summary lines is true, ignore import line

### Paymentech to-do

- Try to find a non-aggregate file with merchant-level data (currently only supports the single aggregation level file)

### Global Payments to-do

- Not a damn thing! It's done.