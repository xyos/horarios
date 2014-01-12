define(["../app"],function (templates) { "use strict"; templates.run(["$templateCache", function ($templateCache) {  'use strict';

  $templateCache.put('/static/partials/about.html',
    "<div class=\"container\">\r" +
    "\n" +
    "    <div class=\"row\">\r" +
    "\n" +
    "        <div class=\"col-md-12\">\r" +
    "\n" +
    "            Programado por: Jairo Suarez y Santiago Alonso P&eacute;rez Rubiano<br/>\r" +
    "\n" +
    "            Liberado bajo licencia <a href=\"http://opensource.org/licenses/MIT\">MIT</a><br/>\r" +
    "\n" +
    "            Puedes ver el c&oacute;digo fuente de la aplicaci&oacute;n en <a href=\"https://github.com/xyos/horarios\">GITHUB.</a><br/>\r" +
    "\n" +
    "            Puedes reportar problemas, colaborar con el desarrollo o seguirle la pista a las nuevas funcionalidades en\r" +
    "\n" +
    "            <a href=\"https://waffle.io/xyos/horarios\"> Waffle</a><br/>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('/static/partials/pager.html',
    "<div class=\"col-md-12\">\r" +
    "\n" +
    "    <ul class=\"pagination pagination-centered\">\r" +
    "\n" +
    "        <li ng-class=\"{disabled : currentPage == 0 }\">\r" +
    "\n" +
    "            <a a-disabled=\"currentPage == 0\" ng-click=\"currentPage=currentPage-1\">&laquo</a>\r" +
    "\n" +
    "        </li>\r" +
    "\n" +
    "        <li ng-repeat=\"page in range(numberOfPages())\"\r" +
    "\n" +
    "            ng-class=\"{active: (page == $parent.currentPage) }\">\r" +
    "\n" +
    "            <a ng-click=\"$parent.currentPage=page\">{{ page + 1 }}</a>\r" +
    "\n" +
    "        </li>\r" +
    "\n" +
    "        <li ng-class=\"{disabled : (currentPage >= items.length/pageSize - 1) }\">\r" +
    "\n" +
    "            <a a-disabled=\"currentPage >= items.length/pageSize - 1\" ng-click=\"currentPage=currentPage+1\">»</a>\r" +
    "\n" +
    "        </li>\r" +
    "\n" +
    "    </ul>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('/static/partials/schedules.detail.html',
    "<div class=\"panel panel-default\" ng-controller=\"ScheduleDetailCtrl\">\r" +
    "\n" +
    "    <div class=\"panel-heading\"><span> horario {{ schedule.index + 1 }} </span>\r" +
    "\n" +
    "        <a tooltip = \"descargar calendario\"><i ng-click=\"loadCalendar(schedule.index);\" class=\"fa fa-calendar\"></i> ics</a>\r" +
    "\n" +
    "        <button type=\"button\" class=\"btn btn-xs btn-primary pull-right\" ng-class=\"{'btn-danger': busySelect}\"\r" +
    "\n" +
    "                ng-model=\"busySelect\" btn-checkbox btn-checkbox-true=\"true\" btn-checkbox-false=\"false\">\r" +
    "\n" +
    "            Horas ocupadas <i class=\"fa fa-minus-circle\"></i>\r" +
    "\n" +
    "        </button>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <table class=\"table table-bordered table-condensed\" ng-show=\"!busySelect\">\r" +
    "\n" +
    "        <thead>\r" +
    "\n" +
    "        <tr class=\"text-center\">\r" +
    "\n" +
    "            <th class=\"text-center\">hora</th>\r" +
    "\n" +
    "            <th class=\"text-center\" ng-repeat=\"day in daysOfWeek\">{{ day }}</th>\r" +
    "\n" +
    "        </tr>\r" +
    "\n" +
    "        </thead>\r" +
    "\n" +
    "        <tbody>\r" +
    "\n" +
    "        <tr ng-repeat=\"row in schedule.rows\" ng-show=\"showRow($index)\">\r" +
    "\n" +
    "            <th>{{ hours[$index] }}</th>\r" +
    "\n" +
    "            <td ng-repeat=\"cell in row track by cell.id\"\r" +
    "\n" +
    "                ng-class=\"{ busy: busy[$parent.$index][$index] }\"\r" +
    "\n" +
    "                class=\"text-center {{ busySelect ? '' : cell.color }}\">\r" +
    "\n" +
    "                  <em>\r" +
    "\n" +
    "                      <span ng-show=\"busy[$parent.$index][$index]\"> Ocupado <i class=\"fa fa-minus-circle\"></i></span>\r" +
    "\n" +
    "                      <!-- TODO: cambiar esto cuando se autogeneren los horarios -->\r" +
    "\n" +
    "                      <span ng-show=\"!busy[$parent.$index][$index]\"\r" +
    "\n" +
    "                            tooltip=\"{{ cell.tooltip || 'ocupado' }}\">{{ cell.name }}</span>\r" +
    "\n" +
    "                  </em>\r" +
    "\n" +
    "            </td>\r" +
    "\n" +
    "        </tr>\r" +
    "\n" +
    "        </tbody>\r" +
    "\n" +
    "    </table>\r" +
    "\n" +
    "    <table class=\"table table-bordered table-condensed\" ng-show=\"busySelect\">\r" +
    "\n" +
    "        <thead>\r" +
    "\n" +
    "        <tr class=\"text-center\">\r" +
    "\n" +
    "            <th class=\"text-center\">hora</th>\r" +
    "\n" +
    "            <th class=\"text-center\" ng-repeat=\"day in daysOfWeek\">{{ day }}</th>\r" +
    "\n" +
    "        </tr>\r" +
    "\n" +
    "        </thead>\r" +
    "\n" +
    "        <tbody>\r" +
    "\n" +
    "        <tr ng-repeat=\"row in schedule.rows\" ng-show=\"showRow($index)\">\r" +
    "\n" +
    "            <th>{{ hours[$index] }}</th>\r" +
    "\n" +
    "            <td ng-repeat=\"cell in row track by cell.id\"\r" +
    "\n" +
    "                ng-class=\"{ busy: busy[$parent.$index][$index] }\"\r" +
    "\n" +
    "                class=\"text-center {{ busySelect ? '' : cell.color }}\"\r" +
    "\n" +
    "                ng-click=\"toggleRow($parent.$index, $index)\">\r" +
    "\n" +
    "                <span>\r" +
    "\n" +
    "                    <span ng-show=\"busy[$parent.$index][$index]\">Ocupado <i class=\"fa fa-minus-circle\"></i></span>\r" +
    "\n" +
    "                    <span ng-show=\"!busy[$parent.$index][$index]\">Libre <i class=\"fa fa-check\"></i></span>\r" +
    "\n" +
    "                </span>\r" +
    "\n" +
    "            </td>\r" +
    "\n" +
    "        </tr>\r" +
    "\n" +
    "        </tbody>\r" +
    "\n" +
    "    </table>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('/static/partials/schedules.html',
    "<div class=\"container\">\r" +
    "\n" +
    "    <div class=\"row\">\r" +
    "\n" +
    "        <div class=\"col-md-12\">\r" +
    "\n" +
    "            <div class=\"col-md-4\" ui-view=\"subjects\"></div>\r" +
    "\n" +
    "            <div class=\"col-md-8\">\r" +
    "\n" +
    "                <div class=\"row\" ui-view=\"detail\"></div>\r" +
    "\n" +
    "                <div class=\"row\" ui-view=\"list\"></div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('/static/partials/schedules.list.html',
    "<div class=\"row\" ng-controller=\"ScheduleListCtrl\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"row\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"col-md-12\">\r" +
    "\n" +
    "            <div class=\"col-sm-2 col-md-2\"\r" +
    "\n" +
    "                 ng-repeat=\"schedule in schedules | startFrom:currentPage*pageSize | limitTo:pageSize\">\r" +
    "\n" +
    "                <div ng-click=\"loadSchedule(schedule.index)\" class=\"thumbnail\">\r" +
    "\n" +
    "                    <img ng-src=\"{{ schedule.thumbnail()}}\" height=\"{{ height }}\" width=\"{{ width }}\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"caption\">\r" +
    "\n" +
    "                        <p><a class=\"btn {{ schedule.index === index ? 'btn-primary' : 'btn-default' }}\" role=\"button\">Horario\r" +
    "\n" +
    "                            {{ schedule.index + 1 }}</a></p>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"col-md-12\">\r" +
    "\n" +
    "        <l-pager ng-show=\"schedules.length > 1\" items=\"schedules\" page-size=\"6\" current-page=\"currentPage\" on-item-selection=\"update()\"></l-pager>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('/static/partials/subjects.html',
    "<div ng-controller=\"SubjectCtrl\">\r" +
    "\n" +
    "    <input placeholder=\"escriba el nombre de la materia\" typeahead-input-formatter=\"formatInput($model)\"\r" +
    "\n" +
    "           typeahead-min-length=\"3\" class=\"form-control\" type=\"text\"\r" +
    "\n" +
    "           typeahead-on-select='onSelect($item, $model, $label)' ng-model=\"result\" typeahead-wait-ms=\"500\"\r" +
    "\n" +
    "           typeahead=\"subject.name for subject in autocomplete($viewValue)\" typeahead-loading=\"isLoading\">\r" +
    "\n" +
    "    <hr>\r" +
    "\n" +
    "    <img src=\"static/img/loading.gif\" ng-show=\"!!isLoading\"/>\r" +
    "\n" +
    "    <div class=\"subject\" ng-repeat=\"subject in subjects\">\r" +
    "\n" +
    "        <div class=\"subject-header {{ subject.color }}\">\r" +
    "\n" +
    "            <div class=\"check\">\r" +
    "\n" +
    "                <input type=\"checkbox\"\r" +
    "\n" +
    "                       ng-model=\"subject.isChecked\"\r" +
    "\n" +
    "                       ng-checked=\"true\"\r" +
    "\n" +
    "                       ng-change=\"checkChange(subject.teachers,subject.isChecked)\">\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"name\"\r" +
    "\n" +
    "                 tooltip=\"Haga click para expandir\"\r" +
    "\n" +
    "                 class=\"btn btn-default\"\r" +
    "\n" +
    "                 ng-click=\"subject.toggle = !subject.toggle\"\r" +
    "\n" +
    "                 ng-init=\"subject.toggle=false\">\r" +
    "\n" +
    "                <b>{{ subject.name | humanize }}</b> {{ subject.code }}\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"close\">\r" +
    "\n" +
    "                <button class=\"close\" tooltip=\"Eliminar materia\" ng-click=\"removeSubject(subject.code)\"><i\r" +
    "\n" +
    "                        class=\"fa fa-times\"></i></button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"subject-body\" ng-animate=\"'animate'\" ng-show=\"subject.toggle\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"teacher\" ng-repeat=\"teacher in subject.teachers\">\r" +
    "\n" +
    "                <div class=\"teacher-header\">\r" +
    "\n" +
    "                    <div class=\"check\">\r" +
    "\n" +
    "                        <input type=\"checkbox\"\r" +
    "\n" +
    "                           ng-checked=\"true\"\r" +
    "\n" +
    "                           ng-model=\"teacher.isChecked\"\r" +
    "\n" +
    "                           ng-change=\"checkChange(teacher.groups,teacher.isChecked)\">\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"name\"  tooltip=\"Haga click para ver los grupos\" ng-click=\"teacher.toggle = !teacher.toggle\"\r" +
    "\n" +
    "                           ng-init=\"teacher.toggle=false\">\r" +
    "\n" +
    "                               {{ teacher.name | humanize }}\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"teacher-body\" ng-show=\"teacher.toggle\" ng-animate=\"'animate'\">\r" +
    "\n" +
    "                    <div class=\"group-heading\" ng-repeat=\"group in teacher.groups\">\r" +
    "\n" +
    "                        <input type=\"checkbox\" ng-checked=\"true\" ng-model=\"group.isChecked\"\r" +
    "\n" +
    "                               ng-change=\"changeGroup()\">\r" +
    "\n" +
    "                        <span>grupo {{ group.code }}</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"progress\">\r" +
    "\n" +
    "                            <div class=\"progress-bar progress-bar-warning\" role=\"progressbar\" aria-valuenow=\"30\"\r" +
    "\n" +
    "                                 aria-valuemin=\"0\" aria-valuemax=\"100\"\r" +
    "\n" +
    "                                 style=\"width: {{ 100*((group.totalShare - group.available)/group.totalShare)}}%\">\r" +
    "\n" +
    "                                {{ group.totalShare - group.available}}\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div class=\"progress-bar progress-bar-success\" role=\"progressbar\" aria-valuenow=\"30\"\r" +
    "\n" +
    "                                 aria-valuemin=\"0\" aria-valuemax=\"100\"\r" +
    "\n" +
    "                                 style=\"width: {{ 100*( group.available/group.totalShare)}}%\">\r" +
    "\n" +
    "                                {{ group.available }}\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );
 }]);});