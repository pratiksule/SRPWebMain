/**
* @file Manages all operations related to announcements.
*/

/**
* Represents Announcement Controller class that can be used
* to perform differnt operations related to announcements.
* @class
*/
var AnnouncementController = function(maxNumberOfAnnouncementsToShow) {

    /**
    * Represents max number of announcements to show.
    * @var
    */
    this.maxNumberOfAnnouncementsToShow = maxNumberOfAnnouncementsToShow;

    /**
    * Entry point wrapper function to display announcements.
    * @function
    */
    this.DisplayAnnouncements = function() {
        // Workflow:
        // 1. Fetch Announcements.
        // 2. Fetch announcements display template and realize with announcement details.
        // 3. Render html on page.
        var self = this;
        self.FetchAnnouncements(self, self.AnnouncementsRealizar);
    };

    /**
    * Entry point wrapper function to display announcements on home page.
    * @function
    */
    this.DisplayAnnouncementsHome = function() {
        // Workflow:
        // 1. Fetch Announcements.
        // 2. Fetch announcements home display template and realize with announcement details.
        // 3. Render html on page.
        var self = this;
        self.FetchAnnouncements(self, self.AnnouncementsHomeRealizar);
    };

    /**
    * Fetches announcements from repository & displays announcements
    * @function
    * @param count
    */
    this.FetchAnnouncements = function(self, callback) {
        var xml = '';
        // Fetch Announcements
        $.ajax({
            type: "GET",
            url: "models/announcements.xml",
            dataType: "xml",
            success: function(xml){
                callback(self, xml);
            },
            error: function(xhr, textStatus, errorThrown) {
                console.log("Error occured while fetching announcements: \n"+xhr.responseText);
                callback(self, xml);
            }
        });
    };

    /**
    * Fetches the annocunement template file.
    * Realizes the announcement template with announcement details.
    * @function
    * @param self
    * @param announcementsXML
    */
    this.AnnouncementsRealizar = function(self, announcementsXML) {
        var announcementsResult='';
        var announcementsCount = $(announcementsXML).find('announcement').length;
        if (!isNaN(self.maxNumberOfAnnouncementsToShow)) {
            announcementsCount = self.maxNumberOfAnnouncementsToShow;
        }
        // Get the template for announcements ...
        $.ajax({
            type: "GET",
            url: "templates/announcement-template.txt",
            success: function(templateText) {
                var temp='';
                for (i = 0; i < announcementsCount; i++) {
                    temp = templateText;
                    // Have to use javascript's getElementsByTagName instead of .find(key).text() because text method only returns
                    // the nodes text value as opposed to inner html.
                    var node = announcementsXML.getElementsByTagName("announcement")[i];
                    announcementsResult += temp.replace("$month", node.getElementsByTagName("month")[0].innerHTML)
                                                 .replace("$date", node.getElementsByTagName("date")[0].innerHTML)
                                                 .replace("$title", node.getElementsByTagName("title")[0].innerHTML)
                                                 .replace("$description", node.getElementsByTagName("description")[0].innerHTML);
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
    * Fetches the annocunement-home template file.
    * Realizes the announcement-home template with announcement details.
    * @function
    * @param self
    * @param announcementsXML
    */
    this.AnnouncementsHomeRealizar = function(self, announcementsXML) {
        var announcementsResult='';
        var announcementsCount = $(announcementsXML).find('announcement').length;
        if (isNaN(announcementsCount)) {
            self.ShowAnnouncementsHome(announcementsResult);
        }
        if (announcementsCount > self.maxNumberOfAnnouncementsToShow) {
            announcementsCount = self.maxNumberOfAnnouncementsToShow;
        }
        // Get the template for announcements ...
        $.ajax({
            type: "GET",
            url: "templates/announcement-home-template.txt",
            success: function(templateText) {
                var temp='';
                for (i = 0; i < announcementsCount; i++) {
                    temp = templateText;
                    // Have to use javascript's getElementsByTagName instead of .find(key).text() because text method only returns
                    // the nodes text value as opposed to inner html.
                    var node = announcementsXML.getElementsByTagName("announcement")[i];
                    var title = node.getElementsByTagName("title")[0].innerHTML;
                    // Magic number 87 calculated based on the needed space in the div to show announcement title.
                    if (title.length > 87) {
                        title = title.substring(0, 86).concat(" ...");
                    }
                    announcementsResult += temp.replace("$month",node.getElementsByTagName("month")[0].innerHTML)
                                                 .replace("$date",node.getElementsByTagName("date")[0].innerHTML)
                                                 .replace("$year",node.getElementsByTagName("year")[0].innerHTML)
                                                 .replace("$title", title);
                }
                self.ShowAnnouncementsHome(announcementsResult);
            },
            error: function(xhr, textStatus, errorThrown) {
                console.log("Error occured while fetching announcements template: \n"+xhr.responseText);
                self.ShowAnnouncementsHome(announcementsResult);
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

    /**
    * Attaches the announcement result obtained from repository
    * to the Announcements home DOM.
    * @function
    * @param announcements
    */
    this.ShowAnnouncementsHome = function(announcements) {
        // Displaying the announcements
        $('#announcements-home-item-main-alternate').fadeOut(100, function(){
            $('#announcements-home-item-main-alternate-placeholder').hide();
            if(announcements == null || announcements == '') {
                $('#announcements-home-item-loading').hide();
                $('#announcements-home-item-none').css('display','block');
                $('#announcements-home-item-main-alternate-placeholder').show();
                $('#announcements-home-item-main-alternate').show();
            }
            else{
                $('announcements-home-item-loading-container').hide();
                $('#announcements-home-footer').show();
                $('#announcements-home-item-main-alternate').prepend(announcements).fadeIn(400);
            }
        });
    };
}
