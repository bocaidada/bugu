new Vue({
    el:'#root',
    data:{
        // 用户信息
        // initData:{
        //     totalSlk:'--',
        //     moneyValue:'--',
        //     totalPower:'--',
        // },
        initData:{},
        // 登录状态
        isLogin:false,
        // 挖矿中状态
        minState:false,
        // 挖矿状态
        jewelState:false,
        chargeSwitch:true,
        // 钻石左右位置去重集合
        leftPosition:[],
        topPosition:[],
        othersGet:{},
        // 倒计时背景
        bgWith:'',
        count_down:'',
        // 倒计时总时间
        allTime:'7200',
        // 钻石收取位置
        jewelLeft:'',
        jewelTop:'',
        // 用户钻石数量以及换算钱数
        juwNumTotal:'',
        moneyNumTotal:'',
        // 钻石数据
        jewelData:[],
        //倒计时时间函数Y
        timerTask:'',
        //坐标轴X坐标
        getChartDates:{},
        dateTime:['9-01','9-02','9-03','9-04','9-05','9-06'],
        //坐标轴Y坐标
        dailySlk:[100,30,60,180,100,80],
        //公告
        noticeCon:'世界上除了相互喜欢 其他的喜欢都是伤害 愿余下岁月燃梦祝歌 愿所有伤痛焚诗祭酒',
        // 提现提示
        toExchangeFlag:false,
        //新手引导
        noviceFlag:true,
        noviceBoxFlag:true,
        totalSlkFlag:0,
        moneyImgFlag:0,
        taskImgFlag:0,
        goodImgFlag:1,
        noviceNum:'1'
    },
    created: function() {
        this.getUserData();
        this.getData();
        // this.getLoginState();
        this.getChartData ()
    },
    mounted: function () {
        // this.reload();
    },
    watch: {
        
    },
    methods: {
        init () {
            this.juwNumTotal = this.initData.totalSlk;
            this.moneyNumTotal = this.initData.moneyValue;
            this.runNum('juwNum','0.00000',this.initData.totalSlk,'5');
            this.runNum('money','0.00',this.initData.moneyValue,'2')
        },
        reload () {
            var _this = this;
            window.JanesiBridge.commonNativeCallJS = function (res) {
                console.log(res);
                if (res.action == 'reloaded') {
                    _this.getLoginState();
                }
            }
        },
        //判断是否需要新手引导
        noviceGuide () {
            var _this= this;
            window.JanesiBridge.callNativeWithCallBack('shouldShowGuide',{
                "position":'SLK'
            },function(res){
                console.log(res);
                if(res.show == '1'){
                    _this.noviceFlag = true;
                }
                _this.getData();
            })
        },
        // 判断是否登录
        getLoginState () {
            var _this= this;
            window.JanesiBridge.callNativeWithCallBack('getUserInfo',{},function(res){
                //callback 通知原生返回回调，获取登陆与否的状态,将状态存到loginState
                console.log(res);
                _this.jewelData = [];
                _this.topPosition = [];
                _this.leftPosition = [];
                if(res.loginState == '0'){
                    _this.minState = false;
                    _this.handShow = false;
                    _this.jewelState = false;
                    _this.isLogin = true;
                    _this.initData = {
                        avator:"../img/Group 17@2x.png",
                        nickName:"登录查看",
                        totalPower:"0",
                        totalSlk:"0"
                    };
                }else{
                    _this.isLogin = false;
                    _this.minState = false;
                    _this.getUserData();
                    _this.noviceGuide();
                }
            });
        },
        // 获取用户信息
        getUserData () {
            var _this= this;
            window.JanesiApi.reqUrl = 'http://10.10.10.81:8803';
            JanesiApi.sendApi('/app/soulian/slk/slk_info', 'post', {
                userId:'1336'
            }, function (res) {
                console.log(res);
                _this.initData = res.result;
                // _this.initData = {
                //     totalSlk:'--',
                //     moneyValue:'--',
                //     totalPower:'--'
                // }
                _this.init();
            })
        },
        //累计挖矿量以及曲线图
        getChartData () {
            var _this= this;
            window.JanesiApi.reqUrl = 'http://10.10.10.81:8803';
            JanesiApi.sendApi('/app/soulian/slk/daily_slk', 'post', {
            }, function (res) {
                console.log(res);
                _this.getChartDates = res.result;
                //挖矿总量最多显示九位，当末尾为.截取掉
                if(_this.getChartDates.totalSlk.length > '10'){
                    _this.getChartDates.totalSlk = _this.getChartDates.totalSlk.substr(0,10);
                    if(_this.getChartDates.totalSlk.slice(9) == '.'){
                        _this.getChartDates.totalSlk = _this.getChartDates.totalSlk.substr(0,9);
                    }
                }
                //绘制每日挖矿曲线
                initLine('SLKecharts', _this.getChartDates.dateTime, _this.getChartDates.dailySlk);
            })
        },
        // 钻石位置去重
        checkPosition (lefts, tops) {
            for(var i = 0; i < this.topPosition.length; i++) {
                if(Math.abs(this.topPosition[i] - tops) < 53 && Math.abs(this.leftPosition[i] - lefts) < 55) {
                    return true;
                }
            }
        },
        // 钻石位置去重
        de_weight (val) {
            var minBack = document.querySelector('.minBox');
            for (var i=0;i<val;i++){
                var lefts, tops;
                do {
                    lefts = (minBack.offsetWidth - 42) * Math.random();
                    tops = (minBack.offsetHeight - 55) * Math.random();
                } while (this.checkPosition(lefts, tops));
                this.leftPosition.push(lefts);
                this.topPosition.push(tops);
            }
        },
        //获取钻石数据
        getData () {
            var _this= this;
            window.JanesiApi.reqUrl = 'http://10.10.10.81:8803';
            JanesiApi.sendApi('/app/soulian/slk/mining_info', 'post', {
                userId:'1336',
                appVersion:'1.0.0'
            }, function (res) {
                console.log(res.result);
                if(res.result.completeSlk.length == '0'){
                    // window.JanesiBridge.callNative('miningComplete',{});
                    _this.jewelState = false;
                    if(_this.timerTask){
                        clearInterval(_this.timerTask);
                    }
                    _this.time(res.result.residueTime);
                    _this.minState = true
                }else{
                    _this.chargeSwitch = true;
                    _this.jewelState = true;
                    _this.jewelData = res.result.completeSlk;
                    console.log(_this.jewelData)
                    _this.de_weight(_this.jewelData.length);
                }
            })
        },
        // 点击收取钻石
        click (param,index) {
            var _this = this;
            if(_this.chargeSwitch){
                _this.chargeSwitch = !_this.chargeSwitch;
                $("#jewel"+index).animate({
                    top: '-320'+'px',
                }, '600', function() {
                    // window.JanesiApi.reqUrl = 'http://10.10.10.81:8803';
                    // JanesiApi.sendApi('/app/soulian/slk/collect', 'post', {
                    //     userId:'1336',
                    //     slkId :param.id
                    // }, function (res) {
                    //     console.log(res)
                    // });
                    document.getElementById('music').play();
                    _this.initData.totalSlk = _this.juwNumTotal;
                    _this.initData.moneyValue = _this.moneyNumTotal;
                    _this.juwNumTotal = (parseFloat(_this.initData.totalSlk) + parseFloat(param.slkNum)).toFixed(5);
                    _this.moneyNumTotal = (parseFloat(_this.juwNumTotal) * _this.initData.rate).toFixed(2);
                    _this.runNum('juwNum',_this.initData.totalSlk,_this.juwNumTotal,'5');
                    _this.runNum('money',_this.initData.moneyValue,_this.moneyNumTotal,'2');
                    _this.jewelData = _this.jewelData.filter(function(item,indexs,array){
                        //元素值，元素的索引，原数组。
                        return (indexs != index);
                    });
                    _this.leftPosition = _this.leftPosition.filter(function(item,indexs,array){
                        return (indexs != index);
                    });
                    _this.topPosition = _this.topPosition.filter(function(item,indexs,array){
                        return (indexs != index);
                    });
                    if(_this.jewelData.length == '0'){
                        _this.getData ()
                    }
                });
                    _this.chargeSwitch = !_this.chargeSwitch;

            }
        },
        //页面跳转
        linkTo (params) {
            if(params == 'novice'){
                if(this.noviceNum == '1'){
                    this.goodImgFlag = 0;
                    this.totalSlkFlag = 1;
                    this.noviceNum = '2';
                }else if(this.noviceNum == '2') {
                    this.totalSlkFlag = 0;
                    this.taskImgFlag = 1;
                    this.noviceNum = '3';
                }else if(this.noviceNum == '3') {
                    this.taskImgFlag = 0;
                    this.moneyImgFlag = 1;
                    this.noviceNum = '4';
                }else{
                    this.noviceBoxFlag = false
                }
                return
            }
            if(params == 'toExchangeTip') {
                this.toExchangeFlag = false;
                return
            }
            if(params == 'toExchange') {
                this.toExchangeFlag = true;
                return
            }

            // 未登录状态点击算力跳转登录页面
            if(this.isLogin){
                if(params == 'task') {
                    params = 'toLogin';
                }
            }
            //数据埋点
            // this.exposure('click',params);
            //打开H5页面与打开原生页面
            if(params == 'toLogin'){
                window.JanesiBridge.callNative('open',{page: params});
            }else{
                if(params == 'sugar'){
                    window.JanesiBridge.callNative('open',{url: this.api+this.pageUrl[params]});
                }else{
                    window.JanesiBridge.callNative('open',{url: this.api+this.pageUrl[params],data:{needFullScreen:'1'}});
                }
            }
            // alert(params)
        },
        // 数字滚动动画
        runNum (el, start, end, some) {
            var options = {
                useEasing: true,
                useGrouping: true,
                separator: ',',
                decimal: '.',
            }
            var demo = new CountUp(el, start, end, some, 1.5, options);
            demo.start()
        },
        //  开采倒计时
        time (param) {
            this.timeInit(param);
            var _this = this;
            var totalTime = parseInt(param);
            this.timerTask = setInterval(function () {
                totalTime -= 1;
                if(totalTime == '0') {
                    clearInterval(this.timerTask);
                    _this.minState = false;
                    _this.getData()
                }else{
                    _this.timeInit(totalTime)
                }
            }, 1000)
        },
        //初始化倒计时状态
        timeInit (param) {
            var totalTime = parseInt(param);
            this.bgWith = ((parseInt(this.allTime)-totalTime)/parseInt(this.allTime)*100).toFixed(2)+'%';
            var hour = '0' + Math.floor(totalTime / (60 * 60)) + ':';
            param = totalTime % (60 * 60);
            var minute = Math.floor(param / 60) < 10 ? '0' + Math.floor(param / 60) : Math.floor(param / 60);
            param = totalTime % 60;
            var second = param < 10 ? '0' + param : param;
            this.count_down = hour + minute + ':' + second
        }
    }
})
