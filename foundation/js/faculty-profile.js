/**
* @file Manages all operations related to faculty profile.
*/

/**
* Represents FacultyProfile Controller class that can be used
* to perform differnt operations related to faculty.
* @class
*/
var FacultyProfileController = function(id) {

    /**
    * Represents unique profile identifier
    * @var
    */
    this.id = id;

    /**
    * Entry point wrapper function to display faculty member profile.
    * @function
    */
    this.DisplayFacultyProfile = function() {
        // Workflow:
        // 1. Fetch faculty members.
        // 2. Fetch profile display template and realize with faculty details.
        // 3. Render html on page.
        var self = this;
        if(isNaN(self.id)) {
            self.ShowFacultyProfile(null);
        }
        self.FetchFaculty();
    };

    /**
    * Fetches faculty members from repository.
    * @function
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
                self.RealizeFacultyProfile(xml);
            },
            error: function(xhr, textStatus, errorThrown) {
                console.log("Error occured while fetching faculty: \n"+xhr.responseText);
                self.RealizeFacultyProfile(xml);
            }
        });
    };

    /**
    * Fetches the faculty-display template file.
    * Fills the faculty-display template with faculty member details.
    * @function
    * @param facultyMembersXML
    */
    this.RealizeFacultyProfile = function(facultyMembersXML) {
        var self = this;
        if (facultyMembersXML == '' || facultyMembersXML == null || typeof facultyMembersXML == undefined){
            return facultyMembersXML;
        }
        var facultyMemebersResult='';
        // Get the template for faculty ...
        $.ajax({
            type: "GET",
            url: "templates/faculty-profile-template.txt",
            success: function(templateText) {
                // Have to use javascript's getElementsByTagName instead of .find(key).text() because text method only returns
                // the nodes text value as opposed to inner html.
                var node = facultyMembersXML.getElementsByTagName("profile")[self.id];
                if(node === undefined) {
                    self.ShowFacultyProfile(null);
                }
                facultyMemebersResult += templateText.replace("$name",node.getElementsByTagName("name")[0].innerHTML)
                                             .replace("$designation",node.getElementsByTagName("designation")[0].innerHTML)
                                             .replace("$email",node.getElementsByTagName("email")[0].innerHTML)
                                             .replace("$photo",node.getElementsByTagName("photo")[0].innerHTML)
                                             .replace("$description",node.getElementsByTagName("description")[0].innerHTML);
                self.ShowFacultyProfile(facultyMemebersResult);
            },
            error: function(xhr, textStatus, errorThrown) {
                console.log("Error occured while fetching faculty-display template: \n"+xhr.responseText);
                self.ShowFacultyProfile(facultyMemebersResult);
            }
        });

    };

    /**
    * Attaches the faculty members result obtained from repository
    * to the faculty DOM.
    * @function
    * @param facultyProfile
    */
    this.ShowFacultyProfile = function(facultyProfile) {
        // Displaying the faculty members
        $('#faculty-profile-main-alternate').fadeOut(100, function(){
            $('#faculty-profile-main-alternate-placeholder').hide();
            if(facultyProfile == null || facultyProfile == ''){
                $('#faculty-profile-loading').hide();
                $('#faculty-profile-main-alternate').show();
                $('#faculty-profile-main-alternate-placeholder').css('width','650px').show();
                $('#faculty-profile-none').css('display','block');
            }
            else {
                $('#faculty-profile-main-alternate').append(facultyProfile).fadeIn(400);
            }
        });
    };
}
