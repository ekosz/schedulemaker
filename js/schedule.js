////////////////////////////////////////////////////////////////////////////
// SCHEDULE BUILDER JAVASCRIPT FUNCTIONS
//
// @author	Ben Russell (benrr101@csh.rit.edu)
//
// @file	js/schedule.js
// @descrip	Functions for building a schedule in a fancy way
////////////////////////////////////////////////////////////////////////////

// GLOBAL VARS
var curPage;			// The current page of results being displayed
var endday;				// The ending day for the schedule
var endtime;			// The ending time for the schedule
var pages;				// The number of pages 
var schedHeight;		// Height of the schedule
var SCHEDPERPAGE = 3;	// The number of schedules per page
var schedules;			// jSON object of schedules that was retreived via AJAX
var schedWidth;			// Width of the schedule
var serialForm;			// The serialized form so we can tell if there has been 
						// any changes to the form
var startday;			// The starting day for the schedule
var starttime;			// The starting time for the schedule


// We NEED to make any ajax a synchronous call
$.ajaxSetup({async: false});

// If session data for a roulette course was stored, load it and delete it
$(document).ready(function() {
	if(sessionStorage.getItem("rouletteCourse") != null) {
		// Show the course in the list
		courseOnFocus(document.getElementById("courses1"));
		$("#courses1").val(sessionStorage.getItem("rouletteCourse"));
		getCourseOptions(document.getElementById("courses1"));

		// Delete the data from the session data
		sessionStorage.removeItem("rouletteCourse");
	}
	});

// @TODO: save the schedule data between page loads?

function addCourse() {
	// First things first. Grab the schedulCourses div and the last row
	scheduleCourses = document.getElementById('scheduleCourses');
	lastRow = document.getElementById('courseRow' + scheduleCourses.children.length);

	// Build a new course
	courseNum = document.getElementsByClassName('course').length + 1;

	newCourse = document.createElement("div");
	newCourse.className = "course";
	
	newHeader = document.createElement("h3");
	newHeader.innerHTML = "Course " + courseNum;
	newCourse.appendChild(newHeader);
	
	newInput = document.createElement("input");
	newInput.setAttribute("id", 'courses' + courseNum);
	newInput.setAttribute("type", 'text');
	newInput.setAttribute("name", 'courses' + courseNum);
	newInput.setAttribute("maxlength", '11');
	newInput.setAttribute('onFocus', 'courseOnFocus(this);');
	newInput.setAttribute('onBlur', 'getCourseOptions(this);');
	newInput.setAttribute('value', 'XXXX-XXX-XX');
	newCourse.appendChild(newInput);
	
	newOptions = document.createElement("div");
	newOptions.className = "courseOpts";
	newCourse.appendChild(newOptions);

	// If there are less than 4 children in this row, we can just add
	if(lastRow.children.length < 4) {
		lastRow.appendChild(newCourse);
	} else {
		// Well shit. We've gotta add a new row.
		newRow = document.createElement("div");
		newRow.id = 'courseRow' + (scheduleCourses.children.length + 1);
		newRow.className = "courseRow";
		newRow.appendChild(newCourse);
		scheduleCourses.appendChild(newRow);
	}

	// Increment our hidden field of number of courses
	document.getElementById("courseCount").value = courseNum;
}

function addItem() {
	// First things first. Grab the table to add the row to
	nonCourses = document.getElementById('nonCourses');

	// Which nonCourse item will this be?
	nonCourseCount = parseInt(document.getElementById('nonCourseCount').value) + 1;
	document.getElementById('nonCourseCount').value = nonCourseCount;
	
	// Get the times from the ajax. I don't really like this, but it's 
	// better than umpteen million lines of code.
	var timeDropDownStart;
	var timeDropDownEnd;
	$.post("./js/scheduleAjax.php", {'action': 'getTimeField', 'name': 'nonCourseStartTime' + nonCourseCount, 'default': 720}, function(data) {
		// Parse the data, error check, then dump to the vars
		try {		
			jsonResult = eval(data);
		} catch(e) {
			alert("An error occurred: the resulting jSON is malformed.");
			return;
		}

		if(jsonResult.error != undefined && jsonResult.error != null) {
			alert("An error occurred: " + jsonResult.msg);
		} else {
			timeDropDownStart = jsonResult.code;
		}
	});
	timeDropDownEnd = timeDropDownStart.replace("nonCourseStartTime" + nonCourseCount, "nonCourseEndTime" + nonCourseCount);	// Replace the field name

	// Build the new row
	newRow = document.createElement("tr");
	newRow.innerHTML = "<td><input name='nonCourseTitle" + nonCourseCount + "[]' type='text'></td>";
	newRow.innerHTML += "<td>" + timeDropDownStart + "</td>";
	newRow.innerHTML += "<td>" + timeDropDownEnd + "</td>";
	newRow.innerHTML += "<td><input name='nonCourseDays" + nonCourseCount + "[]' value='Sun' type='checkbox'></td>";
	newRow.innerHTML += "<td><input name='nonCourseDays" + nonCourseCount + "[]' value='Mon' type='checkbox'></td>";
	newRow.innerHTML += "<td><input name='nonCourseDays" + nonCourseCount + "[]' value='Tue' type='checkbox'></td>";
	newRow.innerHTML += "<td><input name='nonCourseDays" + nonCourseCount + "[]' value='Wed' type='checkbox'></td>";
	newRow.innerHTML += "<td><input name='nonCourseDays" + nonCourseCount + "[]' value='Thu' type='checkbox'></td>";
	newRow.innerHTML += "<td><input name='nonCourseDays" + nonCourseCount + "[]' value='Fri' type='checkbox'></td>";
	newRow.innerHTML += "<td><input name='nonCourseDays" + nonCourseCount + "[]' value='Sat' type='checkbox'></td>";

	// Add the new row
	nonCourses.appendChild(newRow);
}

function addTime() {
	// Grab the table to add the new row to
	noCourses = document.getElementById('noCourses');

	// Grab the next index for the noCourse times
	noCourseCount = parseInt(document.getElementById('noCourseCount').value) + 1;
	document.getElementById('noCourseCount').value = noCourseCount;
	
	// Get times from the ajax.
	var timeDropDownStart;
	var timeDropDownEnd;
	$.post("./js/scheduleAjax.php", {'action': 'getTimeField', 'name': 'noCourseStartTime' + noCourseCount, 'default': 720}, function(data) {
		// Parse the data, error check, then dump to the vars
		try {		
			jsonResult = eval(data);
		} catch(e) {
			alert("An error occurred: the resulting jSON is malformed.");
			return;
		}

		if(jsonResult.error != undefined && jsonResult.error != null) {
			alert("An error occurred: " + jsonResult.msg);
		} else {
			timeDropDownStart = jsonResult.code;
		}
	});
	timeDropDownEnd = timeDropDownStart.replace("noCourseStartTime" + noCourseCount, "noCourseEndTime" + noCourseCount);	// Replace the field name

	// Build the new Row
	newRow = document.createElement("tr");
	newRow.innerHTML = "<td>" + timeDropDownStart + "</td>";
	newRow.innerHTML += "<td>" + timeDropDownEnd + "</td>";
	newRow.innerHTML += "<td><input name='noCourseDays" + noCourseCount + "[]' value='Sun' type='checkbox'></td>";
	newRow.innerHTML += "<td><input name='noCourseDays" + noCourseCount + "[]' value='Mon' type='checkbox'></td>";
	newRow.innerHTML += "<td><input name='noCourseDays" + noCourseCount + "[]' value='Tue' type='checkbox'></td>";
	newRow.innerHTML += "<td><input name='noCourseDays" + noCourseCount + "[]' value='Wed' type='checkbox'></td>";
	newRow.innerHTML += "<td><input name='noCourseDays" + noCourseCount + "[]' value='Thu' type='checkbox'></td>";
	newRow.innerHTML += "<td><input name='noCourseDays" + noCourseCount + "[]' value='Fri' type='checkbox'></td>";
	newRow.innerHTML += "<td><input name='noCourseDays" + noCourseCount + "[]' value='Sat' type='checkbox'></td>";

	// Add the new row
	noCourses.appendChild(newRow);
}

function collapseErrors() {
	// Grab the errorDiv and slide up everything
	$('#errorContents').slideUp('slow');
	
	// Edit the control for hiding/showing
	$('#errorControl').val("Expand");
	$('#errorControl').attr("onClick", "expandErrors();");
}

function collapseForm() {
	// Scroll up to the top of the page (a workaround for tiny screens)
	$("html, body").animate({ scrollTop: 0 }, "fast");


	// Grab the schedule form div and slide it up
	$('.scheduleForm').each(function(k, v) {
		$(v).slideUp('slow');
	});

	// Add a control for expanding re-expanding the form
	control = $("<div>");
	control.attr("id", "formControl");
	control.addClass("scheduleForm");
	control.addClass("subheader");
	
	header = $("<h2>");
	header.html("Schedule Parameters");
	control.append(header);
	
	button = $("<input>");
	button.attr("type", "button");
	button.attr("value", "Expand");
	button.attr("onClick", "expandForm();");
	control.append(button);

	control.insertBefore(".scheduleForm:first");
}

function courseOnFocus(field) {
	// Clear the value and change the text-color back to black
	if($(field).val() == "XXXX-XXX-XX") {
		$(field).val("");
	}
	$(field).css("color", "black");
}

function drawCourse(parent, course, startDay, endDay, startTime, endTime) {
	// If the course is online OR there aren't any times set, don't even bother
	if(course.online || course.times == undefined) {
		return;
	}

	// Draw the time divs of the course
	for(t = 0; t < course.times.length; t++) {
		// Skip times that aren't part of the displayed days
		if(course.times[t].day < startDay || course.times[t].day > endDay) {
			continue;
		}

		// Skip times that aren't part of the displayed hours
		if(course.times[t].start < startTime || course.times[t].start > endTime || course.times[t].end > endTime) {
			continue;
		}

		// Add a div for the time
		timeDiv = $("<div>").addClass("day" + (course.times[t].day - startDay));
		
		// Calculate the height
		timeHeight = parseInt(course.times[t].end) - parseInt(course.times[t].start);
		timeHeight = timeHeight / 30;
		timeHeight = Math.ceil(timeHeight);
		timeHeight = (timeHeight * 20) - 1;

		// Calculate the top offset
		timeTop = parseInt(course.times[t].start) - startTime;
		timeTop = timeTop / 30;
		timeTop = Math.floor(timeTop);
		timeTop = timeTop * 20;
		timeTop += 20;					// Offset for the header

		// Apply the styles
		timeDiv.css("height", timeHeight + "px");
		timeDiv.css("top", timeTop + "px");

		// Add the course information
		timeDiv.html("<h4>" + course.title + "<h4>");
		if(course.courseNum != "non") {
			timeDiv.html(timeDiv.html() + course.courseNum + "<br />");
			if(timeHeight > 40) { 
				timeDiv.html(timeDiv.html() + course.instructor + "<br />");
				timeDiv.html(timeDiv.html() + course.times[t].bldg + "-" + course.times[t].room);
			}
		}
		
		// Add the time to the schedule
		timeDiv.appendTo(parent);
	}
}

function drawPage(pageNum, print) {
	// Clear out the currently displayed schedules
	$(".scheduleWrapper").each(function(k,v) {
		$(v).remove();
		});

	// Calculate the subset of schedules to display
	startIndex = pageNum * SCHEDPERPAGE;
	endIndex   = startIndex + SCHEDPERPAGE;
	if(endIndex >= schedules.length) { endIndex = schedules.length; }

	schedSubset = schedules.slice(startIndex, endIndex);

	// Draw the new schedules
	for(s = 0; s < schedSubset.length; s++) {
		// Create a div for the entire schedule
		sched = $("<div class='schedule'>");
		grid = $("<img src='img/grid.png'>");
		sched.css("height", schedHeight + "px");
		sched.css("width", schedWidth + "px");
		sched.append(grid);

		// Add the headers to the schedules
		drawScheduleHeaders(sched, startday, endday, starttime, endtime);

		// Iterate over each course and draw them
		var onlineCourses = new Array();
		for(c = 0; c < schedSubset[s].length; c++) {
			drawCourse(sched, schedSubset[s][c], startday, endday, starttime, endtime);

			// If we found an online course
			if(schedSubset[s][c].online) {
				onlineCourses.push(schedSubset[s][c].courseNum);
			}
		}
		
		// Calculate the id of the schedule (should be unique)
		schedId = s + startIndex;

		// Wrap the schedule in a non-hidden overflow
		nohidesched = $("<div>").attr("id", "sched" + schedId)
								.addClass("scheduleWrapper")
								.css("height", schedHeight + "px")
								.css("width", schedWidth + "px");
		sched.appendTo(nohidesched);
		
		// If we have onlineCourses then show a little notice
		if(onlineCourses.length) {
			var onlineWarning = $("<div>").addClass("schedUrl")
						.html("Notice: This schedule contains online courses ");
			for(ol = 0; ol < onlineCourses.length; ol++) {
				onlineWarning.html(onlineWarning.html() + " " + onlineCourses[ol]);
			}
			onlineWarning.appendTo(nohidesched);
		}

		if(!print) {
		// Create a control box
		schedControl = $("<div>").addClass("scheduleControl");
		saveForm = $("<form>").attr("action", "schedule.php")
						.attr("method", "POST")
						.appendTo(schedControl);
		saveInput = $("<input>").attr("type", "hidden")
						.attr("name", "schedule")
						.val(JSON.stringify(schedSubset[s]))
						.appendTo(saveForm);
		urlInput = $("<input>").attr("type", "hidden")
						.attr("name", "url")
						.val("none")
						.appendTo(saveForm);
		schedInput = $("<input>").attr("type", "hidden")
						.attr("name", "scheduleif")
						.val("sched" + schedId)
						.appendTo(saveForm); 
		printButton = $("<input type='button' value='Print Schedule'>")
						.click(function(obj) { printSchedule($(this)); })
						.appendTo(saveForm);
		saveButton = $("<input type='button' value='Save Schedule'>")
						.click(function(obj) { saveSchedule($(this)); })
						.appendTo(saveForm);
		downButton = $("<input type='button' value='Download iCal'>")
						.click(function(obj) { icalSchedule($(this)); })
						.attr("disabled", "disabled")
						.appendTo(saveForm);
		faceButton = $("<button type='button'>")
						.html("<img src='img/share_facebook.png' /> Share Facebook")
						.click(function(obj) { shareFacebook($(this)); })
						.appendTo(saveForm);
		googButton = $("<button type='button'>")
						.html("<img src='img/share_google.png' /> Share Google+")
						.click(function(obj) { shareGoogle($(this)); })
						.appendTo(saveForm);
		twitButton = $("<button type='button'>")
						.html("<img src='img/share_twitter.png' /> Share Twitter")
						.click(function() { shareTwitter($(this)); })
						.appendTo(saveForm);
		schedControl.appendTo(nohidesched);
		}

		// Add the schedule to the schedules
		if($(".schedulePagination").length) {
			$(nohidesched).insertBefore($(".schedulePagination").last());
		} else {
			$('#schedules').append(nohidesched);
		}
	}
}

function drawScheduleHeaders(parent, startDay, endDay, startTime, endTime) {
	// Draw the days of the week
	// It falls through the cases until the end day is reached. Pretty snazzy!
	switch(startDay) {
		case 0:
			day = $("<div>").addClass("weekday")
							.addClass("day0")	// Will be skipped if start day > 0
							.html("Sunday")
							.appendTo(parent);
			if(endDay == 0) { break; }
		case 1:
			day = $("<div>").addClass("weekday")
							.addClass("day" + String(1 - startDay))
							.html("Monday")
							.appendTo(parent);
			if(endDay == 1) { break; }
		case 2:
			day = $("<div>").addClass("weekday")
							.addClass("day" + String(2 - startDay))
							.html("Tuesday")
							.appendTo(parent);
			if(endDay == 2) { break; }
		case 3:
			day = $("<div>").addClass("weekday")
							.addClass("day" + String(3 - startDay))
							.html("Wednesday")
							.appendTo(parent);
			if(endDay == 3) { break; }
		case 4:
			day = $("<div>").addClass("weekday")
							.addClass("day" + String(4 - startDay))
							.html("Thursday")
							.appendTo(parent);
			if(endDay == 4) { break; }
		case 5:
			day = $("<div>").addClass("weekday")
							.addClass("day" + String(5 - startDay))
							.html("Friday")
							.appendTo(parent);
			if(endDay == 5) { break; }
		case 6:
			day = $("<div>").addClass("weekday")
							.addClass("day" + String(6 - startDay))
							.html("Saturday")
							.appendTo(parent);
			if(endDay == 6) { break; }
		break;
	}

	// Draw all the times of the day
	// We do this with a for loop
	for(time = startTime; time < endTime; time += 30) {
		// Calculate the label
		hourLabel = Math.floor(time / 60);
		if(hourLabel > 12) { hourLabel -= 12; }
		else if(hourLabel == 0) { hourLabel = 12; }

		minuteLabel = time % 60;
		if(minuteLabel == 0) { minuteLabel = "00"; }

		if(time >= 720) { ap = "pm"; } else { ap = "am"; }

		timeLabel = String(hourLabel) + ':' + String(minuteLabel) + " " + ap;
		
		// Draw the time Div
		timediv = $("<div>").addClass("daytime")
							.css("top", ((Math.floor((time - startTime) / 30) * 20) + 20) + "px")
							.html(timeLabel)
							.appendTo(parent);
	}
}

function expandErrors() {
	// Unhide all the error Div
	$('#errorContents').slideDown('slow');

	// Change the control for hiding/showing
	$('#errorControl').val("Collapse");
	$('#errorControl').attr("onClick", "collapseErrors();");
}

function expandForm() {
	// Hide and delete the control
	$('#formControl').fadeOut();
	$('#formControl').remove();

	// Unhide all the form divs
	$('.scheduleForm').each(function(k, v) {
		$(v).slideDown('slow');
	});
}

function getCourseOptions(field) {
	// If it's blank, then set the value back to the default and do nothing
	if($(field).val() == "") {
		$(field).val("XXXX-XXX-XX");
		$(field).css("color", "grey");
		$(field.parentNode.children[2]).slideUp();
		$(field.parentNode.children[2]).html("");
		return;
	}

	// It wasn't blank! Let's send it to the ajaxHandler
	$.post("./js/scheduleAjax.php", {'action': 'getCourseOpts', 'course': $(field).val(), 'quarter': $('#quarter').val()} , function(data) {		
		try {		
		// Grab the course options (results) div
		courseOpts = field.parentNode.children[2];

		// Process the resulting code
		jsonResult = eval(data);
		} catch(e) {
			$(courseOpts).html("<span style='text-align:center'>An Error Occurred!</span>");
			$(courseOpts).addClass("courseOptsError");
			$(courseOpts).slideDown();
			return;
		}

		if(jsonResult.error != null && jsonResult.error != undefined) {
			// Bomb out on an error
			$(courseOpts).html("<span style='text-align:center'>" + jsonResult.msg + "</span>");
			$(courseOpts).addClass("courseOptsError");
			$(courseOpts).slideDown();
			return;
		} else {
			// Process the list of courses and output it as a table
			htmll = "<table class='courseOptsTable'>";
			for(i = 0; i < jsonResult.length; i++) {
				// Add a row
				// Note: field.id will look like course#
				htmll += "<tr><td>";
				htmll += "<input type='checkbox' name='" + field.id + "Opt[]' value='" + jsonResult[i] + "' checked='checked' />";
				htmll += "</td><td>";
				htmll += jsonResult[i];
				htmll += "</td></tr>";
			}
			htmll += "</table>";
			
			// Add the table to the courseOpts div and show it
			$(courseOpts).removeClass();
			$(courseOpts).html(htmll);
			$(courseOpts).slideDown();
		}
	});
}

function getNextPage() {
	// If we're at the last page, hide the next button and quit
	if(curPage + 1 == pages) {
		$(".nextbutton").each(function(k,v) {
			$(v).hide();
			});
		return;
	}

	// Now we need to draw the next set of schedules
	drawPage(curPage + 1, false);

	// Set the current page number and hide the next button if need be, show prev button
	curPage++;
	$(".curpage").each(function(k,v) {
		$(v).html(curPage + 1);
		});
	if(curPage + 1 == pages) {
		$(".nextbutton").each(function(k,v) {
			$(v).hide();
			});
	}
	$(".prevbutton").each(function(k,v) {
		$(v).show();
		});

	// Scroll up to the top of the page
	$("html, body").animate({ scrollTop: 0 }, "fast");
}

function getPrevPage() {
	// If we're at the first page, hide the previous button and quit
	if(curPage == 0) {
		$(".prevbutton").each(function(k,v) {
			$(v).hide();
			});
		return;
	}

	// Draw the previous set of schedules
	drawPage(curPage - 1, false);

	// Set the current page number, hide previous button if needed, show next button
	curPage--;
	$(".curpage").each(function(k,v) {
		$(v).html(curPage + 1);
		});
	if(curPage == 0) {
		$(".prevbutton").each(function(k,v) {
			$(v).hide();
			});
	}
	$(".nextbutton").each(function(k,v) {
		$(v).show();
		});

	// Scroll up to the top of the page
	$("html, body").animate({ scrollTop: 0 }, "fast");
}

function getScheduleUrl(button) {
	// Do we already have a url stored?
	urlInput = $(button.parent().children()[1]);
	if(urlInput.val() == "none") {
		// Grab the field for the json
		jsonObj = $(button.parent().children()[0]).val();
		jsonModified = {
				"startday":	 $("#scheduleStartDay").val(),
				"endday":    $("#scheduleEndDay").val(),
				"starttime": $("#scheduleStart").val(),
				"endtime":   $("#scheduleEnd").val(),
				"schedule":  eval(jsonObj)
				};
		// We don't have a url already, so get one!
		$.post("./js/scheduleAjax.php", {action: "saveSchedule", data: JSON.stringify(jsonModified)}, function(data) {
			// Error checking
			if(data.error != null && data.error != undefined) {
				errorDiv = $("<div class='saveError'>").html("<b>Fatal Error: </b>" + data.msg);
				$('#schedules').insertBefore($(scheduleId));
				return false;
			}
			
			// Store the url
			savedUrl = data.url;
			urlInput.val(savedUrl);

			return urlInput;
		});
		
		// Should be asynch. So this SHOULD be ok.
		return urlInput.val();
	} else {
		// We already have a url, so return it
		return urlInput.val();
	}
}

function icalSchedule(button) {
	// Grab the schedule's form
	form = button.parent();
	
	// Add an input field for the mode
	$("<input type='hidden' name='mode' value='ical'/>").appendTo(form);
	
	// Submit it!
	form.submit();
}

function printSchedule(button) {
	// We need a schedule json object
	jsonobj = eval($(button.parent().children()[0]).val());
	json = {
		courses: [jsonobj],
		startTime: starttime,
		endTime: endtime,
		startDay: startday,
		endDay: endday
		};

	// Store the schedule in local storage
	window.sessionStorage.setItem("scheduleJson", JSON.stringify(json));

	// Open up a new window
	window.prin=window.prin||{};
	var D=schedWidth + 40, A=450, C=screen.height, B=screen.width, H=Math.round((B/2)-(D/2)), G=0;
	window.prin.prinWin=window.open(
		"schedule.php?mode=print",
		"",
		'left='+H+',top='+G+',width='+D+',height='+A+',personalbar=0,toolbar=0,scrollbars=1,resizable=1'
		);
}


function saveSchedule(button) {
	// We need a schedule url
	url = getScheduleUrl(button);

	// Error checking
	if(!url) { alert("SHIT BROKE SON."); }

	// Grab the schedule we're adding this to
	schedule = $("#" + $(button.parent().children()[2]).val());

	urldiv = $("<div>").addClass("schedUrl")
				.html(
					"<p>This schedule can be accessed at: <a href='" + url + "'>" + url + "</a></p>"
					+ "<p class='disclaimer'>This schedule will be removed after 3 months of inactivity</p>"
				)
				.css("width", schedule.css("width"))
				.insertBefore(schedule)
				.slideDown();
}
	
function shareFacebook(button) {
	// We need a schedule url
	url = getScheduleUrl(button);
	
	// Error checking
	if(!url) { alert("SHIT BROKE FACEBOOK SON."); }

	// Run the code.
	window.faceb=window.faceb||{};
	var D=550, A=450, C=screen.height, B=screen.width, H=Math.round((B/2)-(D/2)),G=0;
	window.faceb.shareWin=window.open(
		'http://www.facebook.com/sharer.php?u=' + escape(url),
		'',
		'left='+H+',top='+G+',width='+D+',height='+A+',personalbar=0,toolbar=0,scrollbars=1,resizable=1'
		);
}

function shareGoogle(button) {
	// We need a schedule url
	url = getScheduleUrl(button);
	
	// Error checking
	if(!url) { alert("SHIT BROKE GOOGLE+ SON."); }

	// Run the code.
	window.googl=window.googl||{};
	var D=550, A=450, C=screen.height, B=screen.width, H=Math.round((B/2)-(D/2)),G=0;
	window.googl.shareWin=window.open(
		'https://m.google.com/app/plus/x/?v=compose&content=My%20Class%20Schedule%20' + escape(url),
		'',
		'left='+H+',top='+G+',width='+D+',height='+A+',personalbar=0,toolbar=0,scrollbars=1,resizable=1'
		);
}

function shareTwitter(button) {
	// We need a schedule url
	url = getScheduleUrl(button);
	
	// Error checking
	if(!url) { alert("SHIT BROKE TWITTER SON."); }

	// Run the code
	window.twttr=window.twttr||{};
	var D=550,A=450,C=screen.height,B=screen.width,H=Math.round((B/2)-(D/2)),G=0;
	if(C<A){
		G=Math.round((C/2)-(A/2))
	}
	window.twttr.shareWin=window.open(
		'http://twitter.com/share?url=' + escape(url) + "&text=My%20Class%20Schedule",
		'',
		'left='+H+',top='+G+',width='+D+',height='+A+',personalbar=0,toolbar=0,scrollbars=1,resizable=1'
		);
}

function showSchedules() {
	// Hide the form and show the expand bar
	collapseForm();

	// Serialize the form and store it if it changed
	if(serialForm != $('#scheduleForm').serialize()) {
		serialForm = $('#scheduleForm').serialize();
		
		// Clear out the schedules and errors
		$("#schedules > :not(:first-child)").remove();

		// Now we need to submit all the data to the ajax caller
		$.post("./js/scheduleAjax.php", $('#scheduleForm').serialize(), function(data) {
			// If there was a single, non-recoverable error, show it and die
			if(data.error != null && data.error != undefined) {
				$("<div>").attr("id", "errorDiv")
						.addClass("scheduleError")
						.html("<b>Fatal Error: </b>" + data.msg)
						.appendTo($("#schedules"));
				$("#schedules").slideDown();
				return;
			}

			// Store the data for pagination later
			schedules = data.schedules;
			
			// How many pages of schedules are there
			pages = Math.ceil(schedules.length / SCHEDPERPAGE);
			curPage = 0;

			// Generate a subset of the schedules for display
			data.schedules = schedules.slice(0, SCHEDPERPAGE);

			// If there are no matching schedules, display an error
			if(data.schedules == undefined || data.schedules == null || data.schedules.length == 0) {
				errorDiv = $("<div id='errorDiv' class='scheduleError' styhle='text-align:center'>").html("There are no matching schedules!");
				$('#schedules').append(errorDiv);
				return;
			}

			// If there were recoverable errors, show them
			// NOTE: the php side determines whether to send errors based on verbose value
			if(data.errors != null && data.errors != undefined) {
				errorDiv = $("<div id='errorDiv' class='scheduleWarning'>");
				errorHTML = "<div class='subheader'><h3>Schedule Generator Warnings</h3><input id='errorControl' type='button' value='Collapse' onClick='collapseErrors();' /></div>";
				errorHTML += "<div id='errorContents'>";
				for(i = 0; i < data.errors.length; i++) {
					errorHTML += data.errors[i].msg + "<br />";
				}
				errorHTML += "</div>";
				errorDiv.html(errorHTML);
				$('#schedules').append(errorDiv);
			}

			// Grab the advanced options for the schedule
			startday  = parseInt($("#scheduleStartDay").val());
			endday    = parseInt($("#scheduleEndDay").val());
			starttime = parseInt($("#scheduleStart").val());
			endtime   = parseInt($("#scheduleEnd").val());

			// Determine the height and width of the schedule based on start/end time/day
			schedHeight = (Math.floor((endtime - starttime) / 30) * 20) + 20;
			schedWidth  = ((endday - startday) * 100) + 200;		// +200 b/c we always show at least ONE day

			// Now we draw the schedules
			drawPage(0, false);

			// Add next/previous page controls
			pagination = $("<div>").addClass("schedulePagination");
			pageinfo = schedules.length + " Schedules Generated (Page <span class='curpage'>" + (curPage + 1) + "</span> of " + pages + ")";
			pagination.html(pageinfo);
			if(pages > 1) {
				prev = $("<input>").attr("type", "button")
							.attr("value", "<- Previous")
							.attr("onClick", "getPrevPage();")
							.addClass("prevbutton")
							.css("display", "none");
				next = $("<input>").attr("type", "button")
							.attr("value", "Next ->")
							.attr("onClick", "getNextPage();")
							.addClass("nextbutton");
				pagination.append(prev);
				pagination.append(next);
			}
			pagination.insertAfter('#matchingSchedules');
			pagination2 = pagination.clone();
			pagination2.appendTo('#schedules');

			// Unhide the schedules page
			$('#schedules').slideDown();
		});
	}
}
