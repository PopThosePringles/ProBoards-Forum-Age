"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Forum_Age = function () {
	function Forum_Age() {
		_classCallCheck(this, Forum_Age);
	}

	_createClass(Forum_Age, null, [{
		key: "init",
		value: function init() {
			this.PLUGIN_ID = "pixeldepth_forum_age";

			this.date = {};
			this.age = "";
			this.image = "";
			this.text = "{years} Year{years_plural}, {months} Month{months_plural}, and {days} Day{days_plural}";
			this.title = "Forum Age";
			this.show_in_title = false;
			this.use_element = false;
			this.main_page_only = false;
			this.route = proboards.data("route").name;

			this.setup();

			$(this.ready.bind(this));
		}
	}, {
		key: "ready",
		value: function ready() {
			if (!this.main_page_only || this.main_page_only && this.route == "home") {
				if (this.has_date()) {
					this.workout_age();
					this.display_age();
				}
			}
		}
	}, {
		key: "setup",
		value: function setup() {
			var plugin = pb.plugin.get(this.PLUGIN_ID);

			if (plugin && plugin.settings) {
				var settings = plugin.settings;

				this.image = plugin.images.agestat;

				this.use_element = settings.use_element && settings.use_element == "1" ? true : false;

				this.date.day = parseInt(settings.day, 10);
				this.date.month = parseInt(settings.month, 10);
				this.date.year = parseInt(settings.year, 10);

				if (settings.icon && settings.icon.length) {
					this.image = settings.icon;
				}

				if (settings.text && settings.text.length) {
					this.text = settings.text;
				}

				if (settings.title && settings.title.length) {
					this.title = settings.title;
				}

				if (settings.show_in_title == "1") {
					this.show_in_title = true;
				}

				this.main_page_only = settings.main_page_only && settings.main_page_only == "1" ? true : this.main_page_only;
			}
		}
	}, {
		key: "has_date",
		value: function has_date() {
			if (this.date.day && this.date.month && this.date.year) {
				return true;
			}

			return false;
		}
	}, {
		key: "workout_age",
		value: function workout_age() {
			var now = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
			var then = new Date(this.date.year, this.date.month - 1, this.date.day);
			var diff = now.getTime() - then.getTime();

			var years = now.getFullYear() - then.getFullYear();
			var months = now.getMonth() - then.getMonth();
			var days = now.getDate() - then.getDate();

			var days_in_month = [31, now.getFullYear() % 4 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
			var date_obj = {};

			while (true) {
				date_obj = {};
				date_obj.years = years;
				date_obj.years_plural = years != 1 ? "s" : "";

				if (months < 0) {
					years -= 1;
					months += 12;
					continue;
				}

				date_obj.months = months || "0";
				date_obj.months_plural = months != 1 ? "s" : "";

				if (days < 0) {
					months -= 1;
					days += days_in_month[(11 + now.getMonth()) % 12];
					continue;
				}

				date_obj.days = days || "0";
				date_obj.days_plural = days != 1 ? "s" : "";
				break;
			}

			date_obj.years = date_obj.years || "0";

			var the_age = this.text;

			while (this.text.match(/\{(\w+)\}/i)) {
				var m = RegExp.$1;
				var rep = typeof date_obj[m] != "undefined" && date_obj[m].toString().length ? date_obj[m] : "";

				this.text = this.text.replace(new RegExp("{" + m + "}", "ig"), rep);
			}

			this.age = this.text;
		}
	}, {
		key: "display_age",
		value: function display_age() {
			if (this.use_element) {
				$(".forum-age").text(this.title + ": " + this.age);
			} else if (this.show_in_title) {
				var title = $(".container.stats div.title-bar");

				title.append("<h2 style='float: right'>" + this.title + ": " + this.age + "</h2><br style='clear: both' />");
			} else {
				var table = $(".container.stats div.content > table:last");
				var last = table.find("tr.last");
				var clone = last.clone().removeClass("last");

				clone.find("td.icon img").attr({
					src: this.image,
					title: "Forum Age",
					alt: "Forum Age"
				});

				if (clone.find("> td").length == 2) {
					clone.find("> td:last").remove();
					clone.find("> td").attr("colspan", "2");
				}

				clone.find("td.info table").empty().append("<tr><th>" + this.title + "</th></tr><tr><td>" + this.age + "</td></tr>");

				table.append(clone);
			}
		}
	}]);

	return Forum_Age;
}();


Forum_Age.init();