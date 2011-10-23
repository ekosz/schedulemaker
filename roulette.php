<?php
////////////////////////////////////////////////////////////////////////////
// SCHEDULE MAKER
//
// @author	Ben Russell (benrr101@csh.rit.edu)
//
// @file	roulette.php
// @descrip	Course roulette -- specify a few things to refine the course list
//			then spin the wheel! Get a totally random course each time!
////////////////////////////////////////////////////////////////////////////

require "./inc/header.inc";
?>
<script type='text/javascript' src='./js/roulette.js'></script>

<div class="page-header">
  <h1>Course Roulette</h1>
</div>
<div class="row">
  <div class="span4">
    <h2>Refine the course list</h2>
  </div>
  <div class="span12">
    <form id='restrictions' name='restrictions' action='roulette.php' method='POST'>
      <input type='hidden' name='action' value='rouletteSpin' />

      <div class="clearfix">
        <label for='quarter'>Quarter*:</label>
        <div class='input'><?= getQuarterField('quarter', $CURRENT_QUARTER) ?></div>
      </div>
      <div class="clearfix">
        <label for='school'>College:</label>
        <div class='input'><?= getCollegeField('school', null, true) ?></div>
        <label for='department'>Department:</label>
        <div class='input'><?= getDepartmentField('department', null, true) ?></div>
      </div>
      <div class="clearfix">
        <label for='level'>Level:</label>
        <div class='input'>
          <select name='level'>
            <option value='any'>Any Level</option>
            <option value='beg'>Introductory (0 - 300)</option>
            <option value='int'>Intermediate (300 - 600)</option>
            <option value='grad'>Graduate (>600)</option>
          </select>
        </div>
      </div>
      <div class="clearfix">
        <label for='credits'>Credit Hours:</label>
        <div class='input'><input type='text' name='credits' size='3' maxlength='2' /></div>
      </div>
      <div class="clearfix">
        <label for='professor'>Professor:</label>
        <div class='input'><input type='text' name='professor' /></div>
      </div>
      <div class="clearfix">
        <label for='days'>Days:</label>
        <div class='input'>
          <table style='font-size:12px; width:100%; border-collapse:collapse'>
            <tr style="border-bottom:solid 1px grey;"><td><input type='checkbox' name='daysAny' value='any' onChange='toggleDaysAny(this)' /></td><td colspan='3'>Any Day</td></tr>
            <tr>
              <td><input id='mon' type='checkbox' name='days[]' value='Mon' /></td><td>Monday</td>
              <td><input id='tue' type='checkbox' name='days[]' value='Tue' /></td><td>Tuesday</td>
            </tr><tr>
              <td><input id='wed' type='checkbox' name='days[]' value='Wed' /></td><td>Wednesday</td>
              <td><input id='hur' type='checkbox' name='days[]' value='Thur' /></td><td>Thursday</td>
            </tr><tr>
              <td><input id='fri' type='checkbox' name='days[]' value='Fri' /></td><td>Friday</td>
              <td><input id='sat' type='checkbox' name='days[]' value='Sat' /></td><td>Saturday</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="clearfix">
        <label for='times'>Times:</label>
        <div class='input'>
          <table style='font-size:12px; width:100%; border-collapse:collapse'>
            <tr style='border-bottom:solid 1px grey'><td><input type='checkbox' name='timesAny' value='any' onChange='toggleTimesAny(this)' /></td><td>Any Time</td></tr>
            <tr><td><input id='morn' type='checkbox' name='times[]' value='morn' /></td><td>Morning (8am - noon)</td></tr>
            <tr><td><input id='aftn' type='checkbox' name='times[]' value='aftn' /></td><td>Afternoon (noon - 5pm)</td></tr>
            <tr><td><input id='even' type='checkbox' name='times[]' value='even' /></td><td>Morning (after 5pm)</td></tr>
          </table>
        </div>
      </div>
      <div class="clearfix"><span style='font-size:10px'>* denotes required fields</span></div>
    <div id='rouletteImg'>BIG IMAGE GOES HERE</div>
    <div id='rouletteCourse'></div>
    <div id='rouletteSpin'>
        <input id='spinButton' type='button' value="Spin The Wheel" onClick='spinRoulette();' />
        <noscript><input id='spinButton' type='submit' value="Spin The Wheel" /></noscript>
    </div>
    </form>
  </div>
</div>

<? require "./inc/footer.inc"; ?>
