SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;


DROP TABLE IF EXISTS `branch`;
CREATE TABLE IF NOT EXISTS `branch` (
  `bid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `factory` int(11) NOT NULL,
  `location` varchar(250) NOT NULL,
  PRIMARY KEY (`bid`),
  KEY `branch_ibfk_1` (`factory`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=10 ;

INSERT INTO `branch` (`bid`, `name`, `factory`, `location`) VALUES
(1, 'Colombo Branch', 1, 'Colombo'),
(2, 'Branch 001', 1, 'Kaluthara'),
(4, 'Negombo Branch', 2, 'Negombo'),
(6, 'Puththalam Branch', 2, 'Puththalama'),
(8, 'Main Branch', 3, 'Rathmalana'),
(9, 'Head Office ', 4, 'Rathmalana');

DROP TABLE IF EXISTS `factory`;
CREATE TABLE IF NOT EXISTS `factory` (
  `fid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`fid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=11 ;

INSERT INTO `factory` (`fid`, `name`) VALUES
(1, 'ABC Factory'),
(2, 'Cocacola Factory'),
(3, 'Bata Shoe Factory'),
(4, 'Maliban Biscuits Factory');

DROP TABLE IF EXISTS `prodline`;
CREATE TABLE IF NOT EXISTS `prodline` (
  `pid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `section` int(11) NOT NULL,
  PRIMARY KEY (`pid`),
  KEY `section` (`section`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

INSERT INTO `prodline` (`pid`, `name`, `section`) VALUES
(1, 'Left Production Line', 1),
(2, 'Right Production Line', 1),
(3, 'Packing Line', 2),
(4, 'Production Line 1', 3),
(5, 'Production Line 2', 3);

DROP TABLE IF EXISTS `section`;
CREATE TABLE IF NOT EXISTS `section` (
  `sid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `branch` int(11) NOT NULL,
  PRIMARY KEY (`sid`),
  KEY `branch` (`branch`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=8 ;

INSERT INTO `section` (`sid`, `name`, `branch`) VALUES
(1, 'Filling Section', 1),
(2, 'Packing Section', 2),
(3, 'Cleaning Section', 6),
(4, 'Capping Section', 4),
(5, 'Labeling Section', 4),
(6, 'Sawing Section', 8),
(7, 'Molding Section', 8);


ALTER TABLE `branch`
  ADD CONSTRAINT `branch_ibfk_1` FOREIGN KEY (`factory`) REFERENCES `factory` (`fid`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `prodline`
  ADD CONSTRAINT `prodline_ibfk_1` FOREIGN KEY (`section`) REFERENCES `section` (`sid`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `section`
  ADD CONSTRAINT `section_ibfk_1` FOREIGN KEY (`branch`) REFERENCES `branch` (`bid`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
