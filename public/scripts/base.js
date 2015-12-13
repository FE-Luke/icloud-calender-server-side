/**
 * Created by Zhichao Liu on 11/23/2015.
 */
/*js中和数据类型对应的函数*/
/*Number() String() Boolean() Function() Object() Array()*/
window.onload = function () {
    var timeline = function () {
        var nowTime = new Date();
        var nowPos = nowTime.getHours()*60+nowTime.getMinutes();
        var h = nowTime.getHours()<10?'0'+nowTime.getHours():nowTime.getHours();
        var m = nowTime.getMinutes()<10?'0'+nowTime.getMinutes():nowTime.getMinutes();
        document.getElementById('tl').style.top = nowPos-5+'px';
        document.getElementById('sj').innerHTML = h + ":" + m;
    };
    var timerId = setInterval(timeline,60000);
    document.getElementsByTagName('body')[0].style.height = innerHeight+'px';
    document.getElementById('event').style.lineHeight = document.getElementById('event').offsetHeight-10+'px';

    var date = new Date();
    date = new Date(date.getFullYear(),date.getMonth(),date.getDate());
    var MonthDay = [31,28,31,30,31,30,31,31,30,31,30,31];
    var Weekday = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
    var calendarBlock = document.querySelectorAll('#calendar-table li');
    var shangyige;

    var ajax = function (obj) {
        var req = new XMLHttpRequest();
        req.open('get',obj.url);
        req.send();
        req.onreadystatechange = function () {
            if(this.readyState == this.DONE && this.status == 200){
                obj.onsuccess(this.response);
            }
        }
    };

    var showImg = function (fname) {
        document.getElementById('img').style.background = 'url(/photos/'+fname+')';
        document.getElementById('showimg').style.display = 'block';
        setTimeout(function () {
            document.getElementById('showimg').style.opacity = '1';
        },1);
    };
    document.getElementById('close').onclick = function () {
        document.getElementById('showimg').style.opacity = '0';
        setTimeout(function () {
            document.getElementById('showimg').style.display = 'none';
        },200);
    };
    var addClass = function(el,s){
        var tmp;
        if(el.hasAttribute('class')){
            tmp = el.getAttribute('class').split(' ');
        }else{
            el.setAttribute('class',s);
            return;
        }
        var dict = {};
        for(var i = 0 ; i < tmp.length ; i++){
            dict[tmp[i]] = true;
        }
        if(!dict[s]){el.setAttribute('class',el.getAttribute('class')+' '+s);}
    };
    var removeClass = function(el,s){
        var tmp;
        if(el.hasAttribute('class')){
            tmp = el.getAttribute('class').split(' ');
        }else{
            return;
        }
        var dict = {};
        for(var i = 0 ; i < tmp.length ; i++){
            dict[tmp[i]] = true;
        }
        delete dict[s];
        var ns = '';
        for(var name in dict){
            ns+=' '+name;
        }
        el.setAttribute('class',ns);
    };

    var isRunNian = function (year) {
        if(year % 4 == 0 && year % 100 != 0 || year % 400 ==0){
            return true;
        }
        return false;
    };
    var date2string = function () {
        return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
    }
    var onChangeDate = function () {
        ajax({
            url:'http://localhost/showImg?timeAttr='+date2string(),
            onsuccess:function(response){
                var img = document.querySelectorAll('#event img');
                var event = document.getElementById('event');

                event.innerHTML = '';
                if(response!='no data'){
                    var res = JSON.parse(response);
                    var title = document.createElement('div');
                    var album = document.createElement('ul');
                    for(i=0;i<res.length;i++){
                        var view = document.createElement('li');
                        view.style.background='url(./photos/'+res[i]+')';
                        view.fname = res[i];
                        view.onclick = function () {
                            showImg(this.fname);
                        };
                        album.appendChild(view);
                    }
                    album.setAttribute('id','album');
                    title.setAttribute('id','photo-title');
                    title.innerHTML = res.length + '张照片';
                    event.appendChild(title);
                    event.appendChild(album);
                    event.style.lineHeight = '40px';
                }else{
                    event.innerHTML = '无照片';
                    event.style.lineHeight = event.offsetHeight-10+'px';
                }
            }
        });

        var tmpNow = new Date();
        if(tmpNow.getFullYear()==date.getFullYear()&&tmpNow.getMonth()==date.getMonth()&&tmpNow.getDate()==date.getDate()){
            document.getElementById('today').style.color = '#ccc';
        }else{
            document.getElementById('today').style.color = '#ff3b30';
        }
        if(date.getDay()==6||date.getDay()==0){
            document.getElementById('main-right').style.backgroundColor = '#fafafa';
        }else{
            document.getElementById('main-right').style.backgroundColor = '#fff';
        }
        if(shangyige){
            removeClass(shangyige,'now');
        }
        var now = date.getDate();
        var el = document.getElementById('d-'+ now);
        addClass(el,'now');
        shangyige = el;
        var titleDate = document.getElementById('title-date');
        var calendarDate = document.getElementById('riqi');
        var dateDetail = document.getElementById('riqi-detail');
        var rightWeekday = document.getElementById('right-weekday');
        var dateString = date.getFullYear() + '年' + ((date.getMonth()+1<10)?'0'+(date.getMonth()+1):(date.getMonth()+1)) + '月' + ((date.getDate()<10)?'0'+date.getDate():date.getDate()) +'日'+Weekday[date.getDay()];
        rightWeekday.innerHTML = dateString.slice(-3);
        titleDate.innerHTML = dateString.slice(0,-3);
        calendarDate.innerHTML = date.getDate();
        dateDetail.innerHTML = dateString;
    };
    var previousDay = function () {
        var currentYear = date.getFullYear() , currentMonth = date.getMonth() , currentDate = date.getDate();
        var targetYear , targetMonth , targetDate;
        targetDate = currentDate - 1;
        if(targetDate == 0){
            targetYear = currentYear;
            targetMonth = currentMonth - 1;
            if(targetMonth == -1){
                targetYear = currentYear - 1;
                targetMonth = 11;
            }
            if(targetMonth == 1 && isRunNian(targetYear)){
                    MonthDay[1]==29;
            }
            targetDate = MonthDay[targetMonth];
        }else{
            targetMonth = currentMonth;
            targetYear = currentYear;
        }
        date = new Date(targetYear,targetMonth,targetDate);
    };
    var nextDay = function () {
        var currentYear = date.getFullYear() , currentMonth = date.getMonth() , currentDate = date.getDate();
        var targetYear , targetMonth , targetDate;
        targetDate = currentDate + 1 ;
        if(currentMonth == 1 && isRunNian(currentYear)){
            MonthDay[1]=29;
        }
        if(targetDate > MonthDay[currentMonth]){
            targetYear = currentYear;
            targetMonth = currentMonth+1;
            if(targetMonth > 11){
                targetYear = currentYear +1;
                targetMonth = 0;
            }
            targetDate = 1;
        }else{
            targetYear = currentYear;
            targetMonth = currentMonth;
        }
        date = new Date(targetYear,targetMonth,targetDate);
    };
    document.getElementById('dateSelector').onclick = function (e) {
        if(e.target == this){return;}
        if(e.target.getAttribute('class')=='left'){previousDay();drawCalendar();onChangeDate();}
        if(e.target.getAttribute('class')=='right'){nextDay();drawCalendar();onChangeDate();}
    };
    document.getElementsByTagName('body')[0].onmousedown = function (e) {
        e.preventDefault();
    };

    var drawCalendar = function () {
        shangyige = null;
        var i = 0;
        /*画上一月日期*/
        var tmpDate = date.getDate();
        date.setDate(1);
        var week = date.getDay();
        date.setDate(tmpDate);
        var L = week == 0? week = 6: week -= 1;
        var prevMonthDay = (date.getMonth()-1==-1)?31:MonthDay[date.getMonth()-1];
        /*画上月日期*/
        for(;i<L;i++){
            calendarBlock[i].removeAttribute('id');
            removeClass(calendarBlock[i],'hasP');
            removeClass(calendarBlock[i],'passed');
            removeClass(calendarBlock[i],'now');
            calendarBlock[i].innerHTML = prevMonthDay - (L - i - 1);
            calendarBlock[i].setAttribute('pr','true');
            addClass(calendarBlock[i],'passed');
        }
        /*画当月日期*/
        for(;i<MonthDay[date.getMonth()]+L;i++){
            removeClass(calendarBlock[i],'hasP');
            removeClass(calendarBlock[i],'passed');
            removeClass(calendarBlock[i],'now');
            if(i-L+1 == date.getDate()){
                addClass(calendarBlock[i],'now');
            }
            calendarBlock[i].innerHTML = i-L+1;

            (function (i) {
                return ajax({
                    url:'http://localhost/showImg?timeAttr='+date2string().slice(0,-2)+(i-L+1),
                    onsuccess: function (response) {
                        if(response!='no data'){
                            addClass(calendarBlock[i],'hasP');
                        }
                    }
                });
            })(i);

            calendarBlock[i].setAttribute('id','d-' + (i-L+1));
        }
        /*画下一月日期*/
        var d = i;
        for(;i<42;i++){
            calendarBlock[i].removeAttribute('id');
            removeClass(calendarBlock[i],'hasP');
            removeClass(calendarBlock[i],'passed');
            removeClass(calendarBlock[i],'now');
            addClass(calendarBlock[i],'passed');
            calendarBlock[i].setAttribute('nx','true');
            calendarBlock[i].innerHTML = i-d+1;
        }
        if(42-d > 7){
            for(var k=0;k<calendarBlock.length;k++){
                calendarBlock[k].style.height = '20%';
            }
        }else{
            for(var k=0;k<calendarBlock.length;k++){
                calendarBlock[k].style.height = '16.6%';
            }
        }
    };

    for(var i = 0 ; i<calendarBlock.length;i++){
        calendarBlock[i].onclick = function () {
            var a = date.getFullYear();
            var b = date.getMonth();
            if(this.hasAttribute('id')){
                date.setDate(this.innerHTML);
            }else if(this.hasAttribute('pr')){
                var z = Number(this.innerHTML);
                var y = b-1;
                var x = a;
                date = new Date(x,y,z);
                drawCalendar();
            }else if(this.hasAttribute('nx')){
                var z = Number(this.innerHTML);
                var y = b+1;
                var x = a;
                if(y == 1 && isRunNian(x)){
                    MonthDay[1]=29;
                }
                date = new Date(x,y,z);
                drawCalendar();
            }
            onChangeDate();
        }
    }

    document.getElementById('today').onclick = function () {
        var nowDate = new Date();
        var y = nowDate.getFullYear();
        var m = nowDate.getMonth();
        var d = nowDate.getDate();
        date = new Date(y,m,d);
        drawCalendar();
        onChangeDate();
        this.style.color = '#ccc';
    };

    drawCalendar();
    onChangeDate();
    timeline();
};
