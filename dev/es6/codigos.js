'use strict';

new GitHubCalendar(".calendar", "pepobj", {summary_text: "", global_stats: false, responsive : true});

if(location.href.indexOf('roberthuaman.com') === -1 && location.href.indexOf('http://localhost:') === -1)
{
    location.href = 'https://roberthuaman.com/';
}