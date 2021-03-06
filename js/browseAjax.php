<?php
////////////////////////////////////////////////////////////////////////////
// BROWSE AJAX CALLS
//
// @author	Ben Russell (benrr101@csh.rit.edu)
//
// @file	js/browseAjax.php
// @descrip	Provides standalone JSON object retreival for the course 
//			browsing page
////////////////////////////////////////////////////////////////////////////

// REQUIRED FILES //////////////////////////////////////////////////////////
require_once "../inc/config.php";
require_once "../inc/databaseConn.php";
require_once "../inc/timeFunctions.php";

// POST PROCESSING /////////////////////////////////////////////////////////
foreach($_POST as $key => $value) {
	$_POST[$key] = mysql_real_escape_string($value);
}

// MAIN EXECUTION //////////////////////////////////////////////////////////
if(empty($_POST['action'])) {
	die(json_encode(array("error" => "argument", "msg" => "You must provide an action")));
}

// Switch on the action
switch($_POST['action']) {
	case "getCourses":
		// Query for the courses in this department

		// Verify that we have department to get courses for and a quarter
		if(empty($_POST['department'])) {
			die(json_encode(array("error" => "argument", "msg" => "You must provide a department")));
		} elseif(empty($_POST['quarter'])) {
			die(json_encode(array("error" => "argument", "msg" => "You must provide a quarter")));
		}

		// Do the query
		$query = "SELECT title, department, course, description, id FROM courses WHERE department = {$_POST['department']} AND quarter = {$_POST['quarter']} ORDER BY course";
		$result = mysql_query($query);
		if(!$result) {
			die(json_encode(array("error" => "mysql", "msg" => mysql_error())));
		}

		// Collect the courses and turn it into a json
		$courses = array();
		while($course = mysql_fetch_assoc($result)) {
			$courses[] = $course;
		}

		echo json_encode(array("courses" => $courses));

		break;

	case "getDepartments":
		// Query for the departments of the school
		
		// Verify that we have a school to get departments for
		if(empty($_POST['school'])) {
			die(json_encode(array("error" => "argument", "msg" => "You must provide a school")));
		}

		// Do the query
		$query = "SELECT title, id FROM departments WHERE school = {$_POST['school']} ORDER BY id";
		$result = mysql_query($query);
		if(!$result) {
			die(json_encode(array("error" => "mysql", "msg" => mysql_error())));
		}

		// Collect the departments and turn it into a json
		$departments = array();
		while($department = mysql_fetch_assoc($result)) {
			$departments[] = $department;
		}

		echo json_encode(array("departments" => $departments));

		break;

	case "getSections":
		// Query for the sections and times of a given course
		
		// Verify that we have a course to get sections for
		if(empty($_POST['course'])) {
			die(json_encode(array("error" => "argument", "msg" => "You must provide a course")));
		}

		// Do the query
		$query = "SELECT c.title, c.course, c.department, s.section, s.instructor, s.id, s.type, s.maxenroll, s.curenroll FROM sections AS s, courses AS c";
		$query .= " WHERE s.course = c.id AND s.course = {$_POST['course']} ORDER BY c.course, s.section";
		$sectionResult = mysql_query($query);
		if(!$sectionResult) {
			die(json_encode(array("error" => "mysql", "msg" => mysql_error())));
		}
		
		// Collect the sections and their times, modify the section inline
		$sections = array();
		while($section = mysql_fetch_assoc($sectionResult)) {
			$section['times'] = array();

			// If it's online, don't bother looking up the times
			if($section['type'] == "O") {
				$section['online'] = true;
				$sections[] = $section;
				continue;
			}

			$query = "SELECT day, start, end, building, room FROM times WHERE times.section = {$section['id']} ORDER BY day, start";
			$timeResult = mysql_query($query);
			if(!$timeResult) {
				die(json_encode(array("error" => "mysql", "msg" => mysql_error())));
			}

			while($time = mysql_fetch_assoc($timeResult)) {
				$time['start'] = translateTime($time['start']);
				$time['end']   = translateTime($time['end']);
				$time['day']   = translateDay($time['day']);
				$section['times'][] = $time;
			}	

			$sections[] = $section;
		}

		// Spit out the json
		echo json_encode(array("sections" => $sections));
		break;
}
