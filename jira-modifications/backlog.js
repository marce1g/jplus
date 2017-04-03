if (typeof JPlus.Backlog == 'undefined') {
    JPlus.Backlog = {};
}

JPlus.Backlog.ExtraPlanningStyling = function (options) {
    $(".js-issue").each(function (index, element) {
        var issue = $(element);
        if (!(issue).hasClass('jplus-issue')) {
            var extraContent = issue.find("span.ghx-extra-field-content");
            extraContent.addClass("aui-label");
            extraContent.parent().removeClass("ghx-extra-field");

            var ghxEnd = issue.find("span.ghx-end");
            extraContent.prependTo(ghxEnd); // move our extra fields

            var ghxEndDiv = issue.find("div.ghx-end");  // move epic link and version inside our extra fields items
            ghxEndDiv.children("span.aui-label").each(function (index, element) {
                $(element).prependTo(ghxEnd);
            });

            var extraFields = issue.find('.ghx-plan-extra-fields');
            extraFields.parent().append(ghxEnd);
            extraFields.hide();
            issue.addClass('jplus-issue');
        }
    });
    if (options.hideNoneItems) {
        $("span.ghx-extra-field-content:contains(None), span.ghx-extra-field-content:contains(none)").hide();
    }
    options.styling.forEach(function (element) {
        $('span.ghx-extra-field-content:contains(' + element.name + ')').css({
            "background-color": element.backroundColor,
            color: element.fontColor
        });
    }, this);
};

$(document).on('jplus-backlog-is-loaded', function () {
    if (GH && GH.BacklogView) {
        JPlus.Override.BacklogView = {};
        JPlus.Override.PlanDragAndDrop = {};

        JPlus.Override.BacklogView.draw = GH.BacklogView.draw;
        JPlus.Override.PlanDragAndDrop.issueUpdateHandler = GH.PlanDragAndDrop.issueUpdateHandler;
        JPlus.Override.PlanDragAndDrop.sprintRankIssues = GH.PlanDragAndDrop.sprintRankIssues;

        JPlus.Extend.BacklogView = {};
        JPlus.Extend.BacklogView.draw = function () {
            JPlus.log('BacklogView.draw was overriden');
            JPlus.log(JPlus.Options.Customization('extraStyling'));
            JPlus.Backlog.ExtraPlanningStyling(JPlus.Options.Customization('extraStyling'));
        }
        JPlus.Extend.PlanDragAndDrop = {};
        JPlus.Extend.PlanDragAndDrop.issueUpdateHandler = function () {
            JPlus.log('PlanDragAndDrop.issueUpdateHandler was overriden');
            JPlus.log(JPlus.Options.Customization('extraStyling'));
            JPlus.Backlog.ExtraPlanningStyling();
        }
        JPlus.Extend.PlanDragAndDrop.sprintRankIssues = function () {
            JPlus.log('PlanDragAndDrop.sprintRankIssues was overriden');
            JPlus.log(JPlus.Options.Customization('extraStyling'));
            JPlus.Backlog.ExtraPlanningStyling();
        }

        GH.BacklogView.draw = function () {
            JPlus.Override.BacklogView.draw();
            JPlus.Extend.BacklogView.draw();
        }
        GH.PlanDragAndDrop.issueUpdateHandler = function (b, h) {
            JPlus.Override.PlanDragAndDrop.issueUpdateHandler(b, h);
            JPlus.Extend.PlanDragAndDrop.issueUpdateHandler();
        }
        GH.PlanDragAndDrop.sprintRankIssues = function (c, f, b, e) {
            var result = JPlus.Override.PlanDragAndDrop.sprintRankIssues(c, f, b, e);
            JPlus.Extend.PlanDragAndDrop.sprintRankIssues();
            return result;
        }
    }
});