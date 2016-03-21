# Udacity Neighbourhoud Map Project 
Project 5 in Front-End Web Development NanoDegree.

### Run
- Open up index.html in Chrome.

### Functionality
- Click on a marker in the menu or on the map to open up its info window.
- The info window contains a title, description, website link (when available), streetview image, Yelp review (if loaded).
- Typing in the filter field will select all applicable markers. 
- If only one marker is selected it will open up its info window.
- Clicking on a marker will clear the filter and select the clicked marker.
- Clicking the clear button will also clear the filter. 

### Test
- Used host file to block: api.yelp.com and maps.googleapis.com .
- Also used g_testFailures.testGeocodeFailure = true to test geocode failure.

### Limitations/Bugs
- Only tested on Chrome.
- Only tested on Desktop.
- Usually not all yelp reviews are returned (average only 3 out of 5).
- Not sure what callback cb should be used for, if I take out references to it in the ajax call, the ajax call fails. 

### References
- Code for Yelp business reviews largely taken from: https://github.com/levbrie/mighty_marks/blob/master/yelp-business-sample.html, although it was reworked to be an object that could be re-used. 

### Ignore
- Please ignore the file NMP_TODO.txt. It is just my personal TODO list for the project.