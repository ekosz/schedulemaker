<?php
////////////////////////////////////////////////////////////////////////////
// SCHEDULE MAKER
//
// @author	Ben Russell (benrr101@csh.rit.edu)
//
// @file	index.php
// @descrip	Index page for schedule maker. Displays a static home page with
//			links to everything.
////////////////////////////////////////////////////////////////////////////

// If the link is to ?s=yadayada Redirect to the schedule page
if(isset($_GET['s'])) {
	require_once("./inc/config.php");
	header("Location: {$HTTPROOTADDRESS}schedule.php?mode=old&id={$_GET['s']}");
	die();
} 

require "./inc/header.inc";
?>
<div class="hero-unit" style="margin-top: 3em;">
  <h1>Schedule Maker</h1>
  <div class="row" style="padding-top: 2em;">
    <div class="span3"><a class="btn primary" href='generate.php'>Make a Schedule</a></div>
    <div class="span3"><a class="btn primary" href='browse.php'>Browse Courses</a></div>
    <div class="span3"><a class="btn primary" href='roulette.php'>Course Roulette</a></div>
  </div>
</div>
<h2>Project Progress</h2>
<ul>
	<li>Index Page/Styling - <span class='label warning'>Partial</span></li>
	<li>Schedule Form - <span class='label success'>COMPLETE (08-12-11)</span></li>
	<li>Schedule Generator - <span class='label success'>COMPLETE (09-01-11)</span></li>
	<li>Course Roulette - <span class='label success'>COMPLETE (08-06-11)</span></li>
	<li>Cronjob Status - Not complete</li>
	<li>AJAX Integration - <span class='label success'>COMPLETE</span></li>
	<li>Courses DB - <span class='label success'>COMPLETE (08-03-11)</span></li>
	<li>Saved Schedule Lookup - <span class='label success'>COMPLETE (10-07-11)</span></li>
	<li>Saved Schedule Cleaner - <span class='label success'>COMPLETE (10-07-11)</span></li>
	<li>Schedule Output - <span class='label success'>COMPLETE (09-17-11)</span></li>
	<li>Social Media Sharing - <span class='label success'>COMPLETE (09-17-11)</span></li>
	<li>iCal Exporting - <span class='label warning'>Partial</span></li>
	<li>Browse Courses - <span class='label success'>COMPLETE (10-08-11)</span></li>
	<li>Scraper Migration - <span class='label success'>COMPLETE (10-13-11)</li>
	<li>Migrator: Courses - <span class='label success'>COMPLETE (08-03-11)</span></li>
	<li>Migrator: Saves Schedules - <span class='label success'>COMPLETE (08-04-11)</span></li>
</ul>
<? require "./inc/footer.inc"; ?>
