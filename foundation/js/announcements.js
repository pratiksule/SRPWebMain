/**
 * @file Manages all operations related to announcements.
 */

/**
 * Represents Announcement Controller class that can be used
 * to perform differnt operations related to announcements.
 * @class
 */
var AnnouncementController = function() {

    /**
     * Fetches announcements from repository & displays announcements
     * @function
     * @param count
     */
    this.DisplayAnnoucements = function(count) {
        var self = this;
        var xml = '';
        // Fetch Announcements
        $.ajax({
            type: "GET",
            url: "xml/announcements.xml",
            dataType: "xml",
            success: function(xml){
                self.AnnouncementRealizar(xml, count);
            },
            error: function(xhr, textStatus, errorThrown) {
                console.log("Error occured while fetching announcements: \n"+xhr.responseText);
                self.AnnouncementRealizar(xml);
            }
        });
    };

    /**
     * Fetches the annocunement template file.
     * Realizes the conversion of announcement template to actual announcement
     * @function
     * @param xml
     * @param count
     */
    this.AnnouncementRealizar = function(xml, count) {
        var self = this;
        var announcementsResult='';
        var announcementsCount = $(xml).find('announcement').length;
        if(count != null){
           announcementsCount = count;
        }
        if(count == 0) {
            self.ShowAnnouncements(announcementsResult);
        }
        // Get the template for announcements ...
        $.ajax({
            type: "GET",
            url: "templates/announcement-template.txt",
            success: function(templateText) {
                var temp='';
                for (i = 0; i < announcementsCount; i++) {
                    temp = templateText;
                    var node = $(xml).find('announcement').eq(i);
                    announcementsResult += temp.replace("$month",node.find("month").text()).replace("$date",node.find("date").text()).replace("$title",node.find("title").text()).replace("$description",node.find("description").text())
                }
                self.ShowAnnouncements(announcementsResult);
            },
            error: function(xhr, textStatus, errorThrown) {
                console.log("Error occured while fetching announcements template: \n"+xhr.responseText);
                self.ShowAnnouncements(announcementsResult);
            }
        });

    };

    /**
     * Attaches the announcement result obtained from repository
     * to the Announcements DOM.
     * @function
     * @param announcements
     */
    this.ShowAnnouncements = function(announcements) {
        // Displaying the announcements
        $('#announcements-main-alternate').fadeOut(100, function(){
            $('#announcements-main-alternate-placeholder').hide();
            if(announcements == null || announcements == ''){
                $('#announcements-loading').hide();
                $('#announcements-main-alternate').show();
                $('#announcements-main-alternate-placeholder').css('width','650px').show();
                $('#announcements-none').css('display','block');
            }
            else{
                $('#announcements-main-alternate').append(announcements).fadeIn(400);
            }
        });
    };
}
