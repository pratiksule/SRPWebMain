/**
* @file Manages all operations related to faculty.
*/

/**
* Represents Faculty Controller class that can be used
* to perform differnt operations related to faculty.
* @class
*/
var FacultyController = function() {

    /**
    * Fetches faculty members from repository & displays them
    * @function
    * @param count
    */
    this.DisplayFacultyMembers = function() {
        var self = this;
        var xml = '';
        // Fetch Faculty Members
        $.ajax({
            type: "GET",
            url: "xml/faculty.xml",
            dataType: "xml",
            success: function(xml){
                self.FacultyProfileDisplayRealizar(xml);
            },
            error: function(xhr, textStatus, errorThrown) {
                console.log("Error occured while fetching faculty: \n"+xhr.responseText);
                self.FacultyProfileDisplayRealizar(xml);
            }
        });
    };

    /**
    * Fetches the faculty-display template file.
    * Fills the faculty-display template with faculty member details.
    * @function
    * @param xml
    */
    this.FacultyProfileDisplayRealizar = function(xml) {
        var self = this;
        var facultyMemebersResult='';
        var facultyMemeberCount = $(xml).find('profile').length;
        // Get the template for faculty ...
        $.ajax({
            type: "GET",
            url: "templates/faculty-display-template.txt",
            success: function(templateText) {
                var temp='';
                for (i = 0; i < facultyMemeberCount; i++) {
                    temp = templateText;
                    var node = $(xml).find('profile').eq(i);
                    facultyMemebersResult += temp.replace("$name",node.find("name").text()).replace("$title",node.find("title").text()).replace("$image",node.find("image").text())
                }
                self.ShowFacultyMembers(facultyMemebersResult);
            },
            error: function(xhr, textStatus, errorThrown) {
                console.log("Error occured while fetching faculty-display template: \n"+xhr.responseText);
                self.ShowFacultyMembers(facultyMemebersResult);
            }
        });

    };

    /**
    * Attaches the faculty members result obtained from repository
    * to the faculty DOM.
    * @function
    * @param facultyMembers
    */
    this.ShowFacultyMembers = function(facultyMembers) {
        // Displaying the faculty members
        $('#faculty-main-alternate').fadeOut(100, function(){
            $('#faculty-main-alternate-placeholder').hide();
            if(facultyMembers == null || facultyMembers == ''){
                $('#faculty-loading').hide();
                $('#faculty-main-alternate').show();
                $('#faculty-main-alternate-placeholder').css('width','650px').show();
                $('#faculty-none').css('display','block');
            }
            else{
                $('#faculty-main-alternate').append(facultyMembers).fadeIn(400);
            }
        });
    };
}
