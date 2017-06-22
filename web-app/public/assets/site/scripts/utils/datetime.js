var DateTime = (function(){
	'use strict';

	return {
		dayCount: dayCount,                                 // Đếm số ngày giữa 2 mốc thời gian
        monthCount: monthCount,                             // Đếm số tháng giữa 2 mốc thời gian
        dateBetween: dateBetween,                           // Kiểm tra ngày có thuộc giữ 2 mốc thời gian
        dateContain: dateContain,                           // Kiểm tra ngày có nằm trong mảng ngày
        // dateInfo: dateInfo,                                 // Lấy thông tin ngày (Thứ, ngày, tháng, năm...)
        // timestampToDate: timestampToDate,                   // Chuyển đổi timestamp sang Date()
        dateToTimestamp: dateToTimestamp,                   // Chuyển đổi Date() sang timestamp
        isoDateToDate: isoDateToDate,                       // Chuyển đổi ISODate sang Date()
        daysInMonth: daysInMonth,                           // Lấy số ngày của tháng
        getAge: getAge                                      // Lấy số tuổi
    };

    function dayCount(date1, date2) {
    	var oneDay = 1000 * 60 * 60 * 24;
    	return Math.round((date2.getTime() - date1.getTime()) / oneDay);
    }

    function monthCount(date1, date2) {
    	return (date1.getMonth()) - (date2.getMonth()) + (12 * (date1.getFullYear() - date2.getFullYear())) + 1;
    }

    function dateBetween(date, startDate, endDate) {
    	return date >= startDate && date <= endDate;
    }

    function dateContain(date, dateArray) {
    	var result = dateArray.filter(function(value){
    		return new Date(value).toDateString() === date.toDateString();
    	});
    	return result.length !== 0;
    }

    // function dateInfo(date, lang) {
    //     var lang = lang || 'en';
    //     var dateNameArr = [
    //     languageJs[lang].DT_SUNDAY,
    //     languageJs[lang].DT_MONDAY,
    //     languageJs[lang].DT_TUESDAY,
    //     languageJs[lang].DT_WEDNESDAY,
    //     languageJs[lang].DT_THURSDAY,
    //     languageJs[lang].DT_FRIDAY,
    //     languageJs[lang].DT_SATURDAY
    //     ];
    //     var monthNameArr = [
    //     languageJs[lang].DT_JAN,
    //     languageJs[lang].DT_JANUARY,
    //     languageJs[lang].DT_FEBRUARY,
    //     languageJs[lang].DT_MARCH,
    //     languageJs[lang].DT_APRIL,
    //     languageJs[lang].DT_MAY,
    //     languageJs[lang].DT_JUNE,
    //     languageJs[lang].DT_JULY,
    //     languageJs[lang].DT_AUGUST,
    //     languageJs[lang].DT_SEPTEMBER,
    //     languageJs[lang].DT_OCTOBER,
    //     languageJs[lang].DT_NOVEMBER,
    //     languageJs[lang].DT_DECEMBER
    //     ];
    //     var dayOfWeek = date.getDay();
    //     var day = date.getDate();
    //     var month = date.getMonth();
    //     var year = date.getFullYear();
    //     var hours = date.getHours();
    //     var minutes = date.getMinutes();
    //     var seconds = date.getSeconds();
    //     var dayName = dateNameArr[dayOfWeek];
    //     var monthName = monthNameArr[month];

    //     return {
    //         day: day,
    //         month: parseInt(month + 1),
    //         year: year,
    //         hours: hours,
    //         minutes: minutes,
    //         seconds: seconds,
    //         dateString: (day < 10 ? '0' + day : day) + '/' + (parseInt(month + 1) < 10 ? '0' + parseInt(month + 1) : parseInt(month + 1)) + '/' + year,
    //         timeString: (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes),
    //         dayName: dayName,
    //         monthName: monthName,
    //         dayCount: dayCount(date, new Date())
    //     }
    // }

    // function timestampToDate(timestamp){
    //     var date = new Date(timestamp * 1000);
    //     return dateInfo(date);
    // }

    function dateToTimestamp(date){
        return date.getTime() / 1000;
    }

    function isoDateToDate(isoString){
    	var dtstr = isoString;
    	dtstr = dtstr.replace(/\D/g,' ');
    	var arr = dtstr.split(' ');
    	arr[1]--;
    	var result = new Date(Date.UTC(arr[0],arr[1],arr[2],arr[3],arr[4],arr[5]));
    	return result;
    }

    function daysInMonth(month){
    	var date = new Date();
    	return new Date(date.getFullYear(), month, 0).getDate();
    }

    function getAge(birthday) {
    	var today = new Date();
    	var thisYear = 0;
    	if (today.getMonth() < birthday.getMonth()) {
    		thisYear = 1;
    	} else if ((today.getMonth() == birthday.getMonth()) && today.getDate() < birthday.getDate()) {
    		thisYear = 1;
    	}
    	var age = today.getFullYear() - birthday.getFullYear() - thisYear;
    	return age;
    }
})();