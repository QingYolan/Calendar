var ULS = document.getElementById("selectDate").getElementsByTagName("ul");
var CALS = document.getElementsByClassName("cal-change");
var PREVS = document.getElementsByClassName("btn-prev");
var NEXTS = document.getElementsByClassName("btn-next");

var OBJ_MIN_Date = new Date(calendarData.MIN_Date);
var MIN_Y = OBJ_MIN_Date.getFullYear();
var MIN_M = OBJ_MIN_Date.getMonth();
var MIN_D = OBJ_MIN_Date.getDate();
var MAX_Y = new Date(calendarData.MAX_Date).getFullYear();

/**
 * 初始化
 * @param  {[type]} SY [最小年份]
 * @param  {[type]} EY [最大年份]
 */
function init(SY, EY) {
	
	SY = SY < MIN_Y ? MIN_Y : SY;
	EY = EY > MAX_Y ? MAX_Y : EY;
	for (var i = SY; i <= EY; i++) {
		var LI_Y = document.createElement("li");
		var Text_Y = document.createTextNode(i + "年");
		LI_Y.appendChild(Text_Y);
		LI_Y.setAttribute("value", i);
		ULS[0].appendChild(LI_Y);
	}
	for (var i = 1; i <= 12; i++) {
		var LI_M = document.createElement("li");
		var Text_M = document.createTextNode(i + "月");
		LI_M.appendChild(Text_M);
		LI_M.setAttribute("value", i);
		ULS[2].appendChild(LI_M);
	}
	for (var i = 0; i < calendarData.Y_Holidays.length; i++) {
		var LI_H = document.createElement("li");
		var Text_H = document.createTextNode(calendarData.Y_Holidays[i].n);
		LI_H.appendChild(Text_H);
		LI_H.setAttribute("sd", calendarData.Y_Holidays[i].e);
		ULS[1].appendChild(LI_H);
	}

	generateCalendar(new Date().getFullYear(), (new Date().getMonth() + 1));
	toDay(new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate());
    
	//年、月、节假日选择框监听事件
	for (var i = 0; i < ULS.length; i++) {
		(function() {
			var j = i;
			ULS[j].addEventListener("click", function(e) {
				e = window.event || e;
				var target = e.target || e.srcElement;
				CALS[j].innerHTML = target.innerHTML;
				if (j != 1) {
					CALS[j].setAttribute("value", target.getAttribute("value"));
					generateCalendar(parseInt(CALS[0].getAttribute("value")), parseInt(CALS[2].getAttribute("value")));
				} else {
					generateCalendar(2016, (new Date(target.getAttribute("sd")).getMonth() + 1));
				}
			});
		})()
	}

	//上一年|月
	for (var i = 0; i < PREVS.length; i++) {
		(function() {
			var j = i;
			PREVS[j].addEventListener("click", function() {
				var nextSibling = PREVS[j].parentNode.getElementsByClassName("cal-change")[0];
				var to = parseInt(nextSibling.getAttribute("value")) - 1;
				if (j == 0) {
					to = to < SY ? SY : to;
					nextSibling.innerHTML = to + "年";
				} else {
					to = to < 1 ? 1 : to;
					nextSibling.innerHTML = to + "月";
				}
				nextSibling.setAttribute("value", to);
				generateCalendar(parseInt(CALS[0].getAttribute("value")), parseInt(CALS[2].getAttribute("value")));
			});
		})()
	}

	//下一年|月
	for (var i = 0; i < NEXTS.length; i++) {
		(function() {
			var j = i;
			NEXTS[j].addEventListener("click", function() {
				var prevSibling = NEXTS[j].parentNode.getElementsByClassName("cal-change")[0];
				var to = parseInt(prevSibling.getAttribute("value")) + 1;
				if (j == 0) {
					to = to > EY ? EY : to;
					prevSibling.innerHTML = to + "年";
				} else {
					to = to > 12 ? 12 : to;
					prevSibling.innerHTML = to + "月";
				}
				prevSibling.setAttribute("value", to);
				generateCalendar(parseInt(CALS[0].getAttribute("value")), parseInt(CALS[2].getAttribute("value")));
			});
		})()
	}

	//切换到某一日
	document.getElementsByTagName("ol")[0].onclick = function(e) {
		e = window.event || e;
		var tg = e.target || e.srcElement;
		var target = tg.nodeName == "DIV" ? tg.parentNode : tg;
		var date = target.getAttribute("date");
		toDay(date);
		var childLis = this.childNodes;
		for (var i = 0; i < childLis.length; i++) {
			removeClass(childLis[i], "on");
		}
		addClass(target, "on");
	}

	//返回今天
	document.getElementsByClassName("btn-today")[0].onclick = function() {
		var d = new Date();
		generateCalendar(d.getFullYear(), d.getMonth() + 1);
		toDay(d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate());
	}
}

//年、月、节假日选择框 toggle
function toggle(event, index) {
	if (index >= 3) {
		for (var i = 0; i < 3; i++) {
			ULS[i].style.display = "none";
		}
	} else
		ULS[index].style.display == "block" ? ULS[index].style.display = "none" : ULS[index].style.display = "block";
	event.stopPropagation ? event.stopPropagation() : window.event.cancelBubble = true;
}


function generateCalendar(year, month) {
	var speclist = document.getElementsByClassName("speclist")[0];
	speclist.innerHTML = "";
	calendarData.solarMonths[1] = isLeapYear(year) ? 29 : 28;

	var t_days = calendarData.solarMonths[month - 1]; //本月天数
	var s_day = year + "/" + month + "/" + 1; //每月第一天
	var e_day = year + "/" + month + "/" + t_days; //每月最后一天
	var l_month = month - 1 < 1 ? 12 : month - 1; //上一个月
	var l_year = l_month == 12 ? year - 1 : year; //上一个月的年份
	var n_month = month + 1 > 12 ? 1 : month + 1; //下一个月
	var n_year = n_month == 1 ? year + 1 : year; //下一个月的年份
	var l_days = (new Date(s_day).getDay()) == 0 ? 6 : (new Date(s_day).getDay()) - 1; //显示的上月天数
	var n_days = 42 - t_days - l_days; //显示的下月天数
	var array_date = []; //显示的日期数组

	for (var i = l_days; i > 0; i--) {
		var day = calendarData.solarMonths[l_month - 1] - i + 1;
		var spec_date = l_year + "/" + l_month + "/" + day;
		array_date.push(spec_date);
	}
	for (var i = 1; i <= t_days; i++) {
		var spec_date = year + "/" + month + "/" + i;
		array_date.push(spec_date);
	}
	for (var i = 1; i <= n_days; i++) {
		var spec_date = n_year + "/" + n_month + "/" + i;
		array_date.push(spec_date);
	}

	var firstT = getSolarTerm(year, month * 2 - 1); //该年该月第一个节气
	var secondT = getSolarTerm(year, month * 2); //该年该月第二个节气
	var thirdT = getSolarTerm(n_year, n_month * 2 - 1); //下一个月第一个气节

	var weekFs = []; //该年按照几月第几个星期几计算的节假日日期数组
	for (var j = 0; j < calendarData.weekFestivals.length; j++) {
		var wd = new Date(year + "-" + calendarData.weekFestivals[j].m + "-" + 1).getDay(); //该月第一天是星期几
		wd = wd == 0 ? 7 : wd;
		var needD = 7 * (calendarData.weekFestivals[j].w - 1) + calendarData.weekFestivals[j].d - wd +
			(wd <= calendarData.weekFestivals[j].d ? 1 : 8);
		weekFs.push(year + "/" + calendarData.weekFestivals[j].m + "/" + needD);
	}

	//依次生成日期格子
	for (var i = 0; i < array_date.length; i++) {
		var spec_date = array_date[i];

		var solar_date = new Date(spec_date);
		var solarD = solar_date.getDate();
		var solarM = solar_date.getMonth() + 1;

		var lunar = toLunar(spec_date); //得到对应的农历信息

		var DLi = document.createElement("li");
		var div_classify = document.createElement("div");
		var div_solar = document.createElement("div");
		var div_lunar = document.createElement("div");
		addClass(div_lunar, "lunar");
		addClass(div_solar, "solar");
		addClass(div_classify, "work");

		if (solarM == l_month)
			addClass(DLi, "lastMonth");
		else if (solarM == n_month)
			addClass(DLi, "nextMonth");

		if (new Date().toDateString() == solar_date.toDateString()) {
			addClass(DLi, "now");
		}

		div_solar.innerHTML = solarD; //公历日

		if (spec_date == firstT) {
			addClass(DLi, "solarTerm");
			div_lunar.innerHTML = calendarData.solarTerms[month * 2 - 2]; //该月第一个节气
		} else if (spec_date == secondT) {
			addClass(DLi, "solarTerm");
			div_lunar.innerHTML = calendarData.solarTerms[month * 2 - 1]; //该月第二个节气
		} else if (spec_date == thirdT) {
			addClass(DLi, "solarTerm");
			div_lunar.innerHTML = calendarData.solarTerms[n_month * 2 - 2]; //下个月第一个节气
		} else if (lunar["isF"] == 1) {
			addClass(DLi, "lunarfestival");
			div_lunar.innerHTML = lunar["lunarName"]; //农历节日
		} else if (getSolarFestival(solarM, solarD)) {
			addClass(DLi, "solarfestival");
			div_lunar.innerHTML = getSolarFestival(solarM, solarD); //公历节日
		} else {
			div_lunar.innerHTML = lunar["lunarName"]; //农历日
		}

		//判断是否为假日
		for (var j = 0; j < calendarData.Y_Holidays.length; j++) {
			if (spec_date == calendarData.Y_Holidays[j].s || spec_date == calendarData.Y_Holidays[j].e ||
				(solar_date > new Date(calendarData.Y_Holidays[j].s)) && (solar_date < new Date(calendarData.Y_Holidays[j].e))) {
				removeClass(div_classify, "work");
				addClass(div_classify, "relax");
				div_classify.innerHTML = "休";
			}
		}

		for (var j = 0; j < weekFs.length; j++) {
			if (weekFs[j] == spec_date) {
				addClass(DLi, "solarfestival");
				div_lunar.innerHTML = calendarData.weekFestivals[j].n;
			}
		}

		DLi.appendChild(div_classify);
		DLi.appendChild(div_solar);
		DLi.appendChild(div_lunar);
		DLi.setAttribute("date", spec_date);
		speclist.appendChild(DLi);
	}
}

//切换到指定日期
function toDay(date) {
	var obj = new Date(date);
	var y = obj.getFullYear();
	var m = obj.getMonth() + 1;
	var d = obj.getDate();
	var w = obj.getDay();
	var l = toLunar(date);
	document.getElementById("span_day").innerHTML = y + "年" + m + "月" + d + "日";
	document.getElementById("span_week").innerHTML = "星期" + calendarData.weekName[w];
	document.getElementById("span_lunar").innerHTML = "农历" + l["lunarDate"];
}

//返回指定日期是哪个农历节假日,都不是则不返回
function getLunarFestival(lm, ld) {
	for (var i = 0; i < calendarData.lunarFestivals.length; i++) {
		if (lm == calendarData.lunarFestivals[i].m && ld == calendarData.lunarFestivals[i].d)
			return calendarData.lunarFestivals[i].n;
	}


}

//返回指定日期是哪个公历节假日,都不是则不返回
function getSolarFestival(sm, sd) {
	for (var i = 0; i < calendarData.solarFestivals.length; i++) {
		if (sm == calendarData.solarFestivals[i].m && sd == calendarData.solarFestivals[i].d)
			return calendarData.solarFestivals[i].n;
	}
}


//公历转换为农历
function toLunar(solarDate) {

	var obj_solar_date = new Date(solarDate);
	var solarY = obj_solar_date.getFullYear();
	var solarM = obj_solar_date.getMonth();
	var solarD = obj_solar_date.getDate();
	if ((solarY == MIN_Y && solarM == MIN_M && solarD < MIN_D) || solarY < MIN_Y || solarY > MAX_Y)
		return false;

	var itv_days = (Date.UTC(solarY, solarM, solarD) - Date.UTC(MIN_Y, MIN_M, MIN_D)) / 86400000;
	var i;
	for (i = MIN_Y; i <= MAX_Y && itv_days > 0; i++) itv_days -= getLunarDays(i);
	if (itv_days < 0) {
		itv_days += getLunarDays(--i);
	}
	var lunarY = i;
	var lunarM;
	var lunarD;
	var isLeap = 0; //是否是闰月
	var lunarMonths = getLunarMonths(lunarY);

	for (var j = 0; j < lunarMonths.length; j++) {

		if (itv_days < lunarMonths[j].c) {
			if (j > 0 && lunarMonths[j - 1].m == lunarM) {
				isLeap = 1;
			}
			lunarM = lunarMonths[j].m;
			lunarD = itv_days + 1;

			break;
		}
		itv_days -= lunarMonths[j].c;
	}

	var lunarName = "";
	var isFestival = 0;
	var dLabel = (lunarD == 20 ? "二十" : lunarD == 30 ? "三十" : calendarData.lunarLabels[Math.ceil(lunarD / 10)] + calendarData.lunarNames[lunarD % 10 == 0 ? 9 : lunarD % 10 - 1]);
	if (lunarD == 1 && isLeap == 1)
		lunarName = "闰" + calendarData.lunarMN[lunarM - 1] + (lunarMonths[lunarM].c == 30 ? "大" : "小");
	else if (lunarD == 1 && isLeap == 0)
		lunarName = calendarData.lunarMN[lunarM - 1] + (lunarMonths[lunarM - 1].c == 30 ? "大" : "小");
	else {
		lunarName = dLabel;
	}
	var lunarDate = (isLeap == 1 ? "闰" : "") + calendarData.lunarMN[lunarM - 1] + dLabel;
	if (getLunarFestival(lunarM, lunarD)) {
		lunarName = getLunarFestival(lunarM, lunarD);
		isFestival = 1;
	}
	return {
		"lunarDate": lunarDate,
		"lunarName": lunarName,
		"isF": isFestival
	};
}

//返回农历某年的天数
function getLunarDays(year) {
	var sum = 0;
	var months = getLunarMonths(year);
	for (var i = 0; i < months.length; i++)
		sum += months[i].c;
	return sum;
}

//返回农历某年每个月的天数数组
function getLunarMonths(year) {
	var months = [];
	for (var i = 0x8000, j = 1; i > 0x8; i = i >> 1, j++) {
		months.push({
			"m": j,
			"c": (calendarData.lunardatas[year - 1900] & i ? 30 : 29)
		});
		if (j == getLunarLeapMonth(year).m)
			months.push({
				"m": j,
				"c": getLunarLeapMonth(year).c
			});
	}
	return months;
}

//返回农历某年的闰月月份及天数
function getLunarLeapMonth(year) {
	var leapInfo = {
		m: 0,
		c: 0
	};
	leapInfo.m = calendarData.lunardatas[year - 1900] & 0xf;
	leapInfo.c = leapInfo.m ? (calendarData.lunardatas[year - 1900] & 0x10000 ? 30 : 29) : 0;
	return leapInfo;
}

//判断闰年
function isLeapYear(year) {
	if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0)
		return true;
	return false;
}


//返回某年第index个气节的公历日期
function getSolarTerm(year, index) {
	var td = calendarData.solarTermIndex[Math.floor((year - 1900) / 4)];
	var mod = (year - 1900) % 4;
	var i = (td >> (32 - 8 * (mod + 1))) ^ (mod == 0 ? 0x0 : (td >> (32 - 8 * mod)) << 8); //该年的节气分布种类序号

	var cl = calendarData.solarTermClassify[index <= 12 ? i * 2 : i * 2 + 1];
	var j = index <= 12 ? index : index - 12;
	var offset = (cl >> (24 - 2 * j)) ^ (cl == 1 ? 0x0 : (cl >> (24 - 2 * (j - 1)) << 2)); //该年对应index的节气的偏移天数

	var termD = calendarData.solarTermBase[index - 1] + offset;
	var termM = Math.ceil(index / 2);

	return year + "/" + termM + "/" + termD;
}

/* 对象css类的操作；start */
function hasClass(obj, classname) {
	return obj.className.match(new RegExp('(\\s|^)' + classname + '(\\s|$)'));
}

function addClass(obj, classname) {
	if (!hasClass(obj, classname))
		obj.className += " " + classname;
}

function removeClass(obj, classname) {
	if (hasClass(obj, classname))
		obj.className = obj.className.replace(new RegExp('(\\s|^)' + classname + '(\\s|$)'), ' ');
}
/* 对象css类的操作；end */