<?php
// REQUIRED FILES
require_once('./inc/config.php');
require_once('./inc/databaseConn.php');
require_once('./inc/timeFunctions.php');
?>
<html>
	<head>
		<title><?= (!empty($TITLE)) ? $TITLE : "Schedule Maker" ?></title>
		
		<link href='./inc/global.css' rel='stylesheet' type='text/css' />
		<link href='./inc/bootstrap.min.css' rel='stylesheet' type='text/css' />
		<script type='text/javascript' src='./js/jquery.js'></script>
	</head>

	<body>
		<div class="topbar">
      <div class="topbar-inner">
        <div class="container">
          <a class="brand" href='index.php'>Schedule Maker</a>
          <ul class="nav">
            <li><a href='generate.php'>Build Schedules</a></li>
            <li><a href='browse.php'>Browse Courses</a></li>
            <li><a href='roulette.php'>Course Roulette</a></li>
          </ul>
        </div>
      </div>
		</div>
		<div class="container">
