-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema Costs
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema Costs
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `Costs` DEFAULT CHARACTER SET utf8 ;
USE `Costs` ;

-- -----------------------------------------------------
-- Table `Costs`.`GlobalPayments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Costs`.`GlobalPayments` (
  `idGlobalPayments` INT(11) NOT NULL AUTO_INCREMENT,
  `Month` DATE NOT NULL,
  `Txn_Count` VARCHAR(45) NOT NULL,
  `Currency` VARCHAR(45) NOT NULL,
  `Txn_Amount` VARCHAR(45) NOT NULL,
  `Network` VARCHAR(45) NOT NULL,
  `Region` VARCHAR(45) NOT NULL,
  `Geographical_Location` VARCHAR(60) NOT NULL,
  `Card_Type` VARCHAR(45) NOT NULL,
  `Interchange` FLOAT NOT NULL,
  `Assessments` FLOAT NOT NULL,
  `Service_Charge` FLOAT NOT NULL,
  `Total_Fees` FLOAT NOT NULL,
  PRIMARY KEY (`idGlobalPayments`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
