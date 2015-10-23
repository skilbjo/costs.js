-- MySQL dump 10.13  Distrib 5.6.25, for osx10.10 (x86_64)
--
-- Host: localhost    Database: Costs
-- ------------------------------------------------------
-- Server version	5.6.25

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `GlobalPayments`
--

DROP TABLE IF EXISTS `GlobalPayments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `GlobalPayments` (
  `idGlobalPayments` int(11) NOT NULL AUTO_INCREMENT,
  `Month` date NOT NULL,
  `Txn_Count` varchar(45) NOT NULL,
  `Currency` varchar(45) NOT NULL,
  `Txn_Amount` varchar(45) NOT NULL,
  `Network` varchar(45) NOT NULL,
  `Region` varchar(45) NOT NULL,
  `Geographical_Location` varchar(60) NOT NULL,
  `Card_Type` varchar(45) NOT NULL,
  `Interchange` float NOT NULL,
  `Assessments` float NOT NULL,
  `Service_Charge` float NOT NULL,
  `Total_Fees` float NOT NULL,
  PRIMARY KEY (`idGlobalPayments`)
) ENGINE=InnoDB AUTO_INCREMENT=97691 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Homeaway`
--

DROP TABLE IF EXISTS `Homeaway`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Homeaway` (
  `idHomeaway` int(11) NOT NULL AUTO_INCREMENT,
  `Month` date NOT NULL,
  `Fee_Description` varchar(45) NOT NULL,
  `Transaction_Type` varchar(45) NOT NULL,
  `Qualification_Code` varchar(60) NOT NULL,
  `Card_Type` varchar(45) NOT NULL,
  `Network` varchar(45) NOT NULL,
  `Txn_Count` varchar(45) NOT NULL,
  `Txn_Amount` varchar(45) NOT NULL,
  `Interchange` varchar(45) NOT NULL,
  PRIMARY KEY (`idHomeaway`)
) ENGINE=InnoDB AUTO_INCREMENT=8832 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Paymentech`
--

DROP TABLE IF EXISTS `Paymentech`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Paymentech` (
  `idPaymentech` int(11) NOT NULL AUTO_INCREMENT,
  `Month` date NOT NULL,
  `Network` varchar(45) NOT NULL,
  `Qualification_Code` varchar(60) NOT NULL,
  `Transaction_Type` varchar(45) NOT NULL,
  `Issuer_Type` varchar(45) NOT NULL,
  `Card_Type` varchar(45) NOT NULL,
  `Txn_Count` int(11) NOT NULL,
  `Txn_Amount` decimal(48,2) NOT NULL,
  `Interchange` decimal(48,2) NOT NULL,
  PRIMARY KEY (`idPaymentech`)
) ENGINE=InnoDB AUTO_INCREMENT=9185 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Vantiv`
--

DROP TABLE IF EXISTS `Vantiv`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Vantiv` (
  `idVantiv` int(11) NOT NULL AUTO_INCREMENT,
  `Month` date DEFAULT NULL,
  `Merchant_Id` bigint(15) DEFAULT NULL,
  `Merchant_Descriptor` varchar(45) DEFAULT NULL,
  `Network` varchar(45) DEFAULT NULL,
  `Qualification_Code` varchar(45) DEFAULT NULL,
  `Transaction_Type` varchar(45) DEFAULT NULL,
  `Issuer_Type` varchar(45) DEFAULT NULL,
  `Card_Type` varchar(45) DEFAULT NULL,
  `Txn_Count` int(11) DEFAULT NULL,
  `Txn_Amount` decimal(48,2) DEFAULT NULL,
  `Interchange` decimal(48,2) DEFAULT NULL,
  PRIMARY KEY (`idVantiv`)
) ENGINE=InnoDB AUTO_INCREMENT=30285 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-08-03 11:07:40
