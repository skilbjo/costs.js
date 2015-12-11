-- No Primary Key
create table vantiv (
	Month date,
	Merchant_Id varchar(45),
	Merchant_Descriptor varchar(45),
	Network varchar(45),
	Qualification_Code varchar(45),
	Transaction_Type varchar(45),
	Issuer_Type varchar(45),
	Card_Type varchar(45),
	Txn_Count integer,
	Txn_Amount decimal(48,2),
	Interchange decimal(48,2)
);
create table GlobalPayments (
	Month date,
	Region varchar(45),
	Currency varchar(45),
	Network varchar(45),
	Qualification_Code varchar(45),
	Transaction_Type varchar(45),
	Card_Type varchar(45),
	Txn_Count integer,
	Txn_Amount decimal(48,2),
	Interchange decimal(48,2),
	Assessments decimal(48,2),
	Service_Charge decimal(48,2),
	Total_Fees decimal(48,2)
);
create table Mids (
	PlatformId integer,
	Vertical varchar(45),
	ParentAccountId varchar(45),
	ParentName varchar(95),
	Processor varchar(45),
	ProcessorMid varchar(45)
);

-- Primary Key
create table Vantiv (
	id serial primary key,
	Month date,
	Merchant_Id varchar(45),
	Merchant_Descriptor varchar(45),
	Network varchar(45),
	Qualification_Code varchar(45),
	Transaction_Type varchar(45),
	Issuer_Type varchar(45),
	Card_Type varchar(45),
	Txn_Count integer,
	Txn_Amount decimal(48,2),
	Interchange decimal(48,2)
);
create table GlobalPayments (
	id serial primary key,
	Month date,
	Region varchar(45),
	Currency varchar(45),
	Network varchar(45),
	Qualification_Code varchar(45),
	Transaction_Type varchar(45),
	Card_Type varchar(45),
	Txn_Count integer,
	Txn_Amount decimal(48,2),
	Interchange decimal(48,2),
	Assessments decimal(48,2),
	Service_Charge decimal(48,2),
	Total_Fees decimal(48,2)
);
create table Mids (
	id serial primary key,
	Platform integer,
	Vertical varchar(45),
	ParentAccountId varchar(45),
	ParentName varchar(45),
	Processor varchar(45),
	ProcessorMid varchar(45)
);





