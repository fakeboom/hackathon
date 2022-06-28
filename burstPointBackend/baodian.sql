DROP TABLE IF EXISTS `gameinfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gameinfo` (
  `gameid` bigint NOT NULL DEFAULT '0',
  `burstvalue` bigint NOT NULL DEFAULT '0',
  `password` varchar(256) NOT NULL DEFAULT '',
  `isend` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`gameid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='part=gameid';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accountinfo`
--

LOCK TABLES `gameinfo` WRITE;

UNLOCK TABLES;

--
-- Table structure for table `billingmap`
--

DROP TABLE IF EXISTS `betinfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `betinfo` (
  `gameid` bigint NOT NULL DEFAULT '0',
  `amount` bigint NOT NULL DEFAULT '0',
  `address` varchar(256) NOT NULL DEFAULT '',
  `burstvalue` bigint NOT NULL DEFAULT '0',
  `success` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`gameid`, `address`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='part=betinfo';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billingmap`
--

LOCK TABLES `betinfo` WRITE;

UNLOCK TABLES;
