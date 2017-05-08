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
    * Entry point wrapper function to display faculty members.
    * @function
    */
    this.DisplayFaculty = function() {
        // Workflow:
        // 1. Fetch faculty members.
        // 2. Fetch profile display template and realize with faculty details.
        // 3. Render html on page.
        var self = this;
        self.FetchFaculty();
    };

    /**
    * Fetches faculty members from repository & displays them
    * @function
    * @param count
    */
    this.FetchFaculty = function() {
        var self = this;
        var xml = '';
        // Fetch Faculty Members
        $.ajax({
            type: "GET",
            url: "models/faculty.xml",
            dataType: "xml",
            success: function(xml){
                self.RealizeFacultyProfiles(xml);
            },
            error: function(xhr, textStatus, errorThrown) {
                console.log("Error occured while fetching faculty: \n"+xhr.responseText);
                self.RealizeFacultyProfiles(xml);
            }
        });
    };

    /**
    * Fetches the faculty-display template file.
    * Fills the faculty-display template with faculty member details.
    * @function
    * @param facultyMembersXML
    */
    this.RealizeFacultyProfiles = function(facultyMembersXML) {
        var self = this;
        var facultyMemebersResult='';
        var facultyMemeberCount = $(facultyMembersXML).find('profile').length;
        // Get the template for faculty ...
        $.ajax({
            type: "GET",
            url: "templates/faculty-template.txt",
            success: function(templateText) {
                var temp='';
                for (i = 0; i < facultyMemeberCount; i++) {
                    temp = templateText;
                    // Have to use javascript's getElementsByTagName instead of .find(key).text() because text method only returns
                    // the nodes text value as opposed to inner html.
                    var node = facultyMembersXML.getElementsByTagName("profile")[i];
                    facultyMemebersResult += temp.replace("$name",node.getElementsByTagName("name")[0].innerHTML)
                                                 .replace("$designation",node.getElementsByTagName("designation")[0].innerHTML)
                                                 .replace("$photo",node.getElementsByTagName("photo")[0].innerHTML)
                                                 .replace("$profileID",i);
                }
                self.ShowFaculty(facultyMemebersResult);
            },
            error: function(xhr, textStatus, errorThrown) {
                console.log("Error occured while fetching faculty-display template: \n"+xhr.responseText);
                self.ShowFaculty(facultyMemebersResult);
            }
        });

    };

    /**
    * Attaches the faculty members result obtained from repository
    * to the faculty DOM.
    * @function
    * @param facultyMembers
    */
    this.ShowFaculty = function(facultyMembers) {
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
