// let click = 0;
// let waitclick = 0;
// let n = 0;
// let notibefore;
// let message = 0;
// const checkinterval = setInterval(() => {
//     if(message == 0 ){
//         console.log('RunnRRRRR');
//         message = 1;
//     }
//     n += 1000;
//     if (n > 8000) {
//         if ($('#__layout > div > div > div.notify_container').css('display') == 'none') {
//             if (click == 1) {
//                 // console.log('click == 1');
//                 waitclick += 1000;
//                 if (waitclick > (40 * 1000)) {
//                     click = 0;
//                 }
//             } else {
//                 // console.log('click != 1');
//                 notibefore = $('#__layout > div > div > div.container > div.container_content > div.info > div.notification_container')
//                 $('#__layout > div > div > div.container > div.container_content > div.buttons > div').trigger('click');
//                 click = 1;
//                 waitclick = 0;
//             }
//         }
//     }
// }, 1000);
var btn1 = "<button id='start' style='margin: 5px;'>START</button>";
var btn2 = "<button id='stop' style='margin: 5px;'>STOP</button>";
// var btn2 = "<label style='margin: 5px;'></label>";
var span = "<span id='sts' style='margin: 5px;color:red;'></span>";
var linebreak = '<div style="width: 100%;"></div>';
var divtimerand = `<div style="">
<input id="timerand_min"type="number" min="0" value="0" onchange="document.getElementById('timerand_max').min=this.value;"/>
<label>MIN</label>
<input id="timerand_max"type="number" min="0" value="0"/>
<label>MAX </label>
<button id='timerand_set' style='margin: 5px;'>SET</button>
<button hidden id='timerand_get' style='margin: 5px;'>get</button>
 <label id="timerand_label">Time Random is <span></span>-<span></span> (Second)</label>
</div>`;
var objbtn = `<style>
#Chapkins {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    z-index: 1;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    justify-content: center;
    align-items: center;
    color: #a173cd;
    //background: rgba(0,0,0,.4);
}
#Chapkins > input {
    width:50px;
    border: 1px solid #a173cd;
    color: #a173cd;
    background: rgba(0,0,0,.4);
}
#Chapkins input[type=number]{
    width:50px;
    border: 1px solid #a173cd;
    color: #a173cd;
    background: rgba(0,0,0,.4);
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

</style>
<div id="Chapkins">${btn1}${btn2}${span}${linebreak}${divtimerand}</div>`;
var account_name;
$.when(
    $("body").append(objbtn),
    $.ready
).done(function (data) {
    // $('body').trigger('click');

    chrome.storage.local.get(["timerand"], function (result) {
        // console.log('Value currently is ', result);
        if (typeof result.timerand == undefined) {
            var timerand_min = 0;
            var timerand_max = 0;
            $('#timerand_label > span')[0].text(timerand_min);
            $('#timerand_label > span')[1].text(timerand_max);
        } else {
            var timerand_min = result.timerand.min;
            var timerand_max = result.timerand.max;
            $('#timerand_min').prop('min', timerand_min);
            $('#timerand_min').val(timerand_min);
            $('#timerand_max').prop('min', timerand_min);
            $('#timerand_max').val(timerand_max);
            $('#timerand_label > span:nth-child(1)').text(timerand_min);
            $('#timerand_label > span:nth-child(2)').text(timerand_max);
        }
    });
    $('#start').on('click', start)
    $('#stop').on('click', stop)
    $('#timerand_set').on('click', timerand_set)
    $('#timerand_get').on('click', timerand_get)
    timers.start = setInterval(() => {
        let container_content = $('body').find('div.container_content');
        if (container_content.length > 0) {
            $('#__layout > div > div > div.container > div.container_content').trigger('click');
            clearInterval(timers.start);
            setTimeout(() => {
                $('#start').trigger('click');
            }, 3000);

        }
    }, 500);
});

const timers = {};
let timecount = 1;
let action_transaction = 0;
let cpu;
let list_units = 0;
let timerand_umin = 0;
let timerand_umax = 0;
let cpulitmit = 96;
let timerand_on = 0;
let timerand_count = 0;
let n = 1;
const start = async () => {
    chrome.storage.local.get(["timerand"], function (result) {
        // console.log('Value currently is ', result.timerand.min);
        timerand_umin = result.timerand.min;
        timerand_umax = result.timerand.max;
        $('#timerand_label > span:nth-child(1)').text(timerand_umin);
        $('#timerand_label > span:nth-child(2)').text(timerand_umax);
    });
    $('#sts').text('Moomanow');
    console.log('start');
    timers.runner = setInterval(async () => {

        let mwm = parseInt(($('body').find('.money').text()).slice(0, -4));
        console.log("🚀 Money", mwm, 'MWM')
        let notify_container = $('#__layout > div > div > div.notify_container').css('display');
        if (notify_container == 'none') {
            $('#__layout > div > div > div.container > div.container_content > div.info > div.repair.info_button').trigger('click');
            console.log("div.repair.info_button")
            $('#__layout > div > div > div.container > div.shards_info > div > div > div.shards_count > div.tabs>div.tab').each((key, value) => {
                // console.log(key, value, $(value).text());
                // let tab = $(value);
                if (key == 1) {
                    $(value).trigger('click');
                    console.log("click: units")
                }
            })
        } else {
            let tab = $('#__layout > div > div > div.container > div.shards_info > div > div > div.shards_count > div > div.tab')[1];
            // console.log("🚀 ~ file: metal_click.js ~ line 87 ~ timers.runner=setInterval ~ tab", tab)
            if (!$(tab).hasClass('active_tab')) {
                $('#__layout > div > div > div.container > div.shards_info > div > div > div.shards_count > div.tabs>div.tab').each((key, value) => {
                    if (key == 1) {
                        $(value).trigger('click');
                        console.log("click: units")
                    }
                })
            } else {
                let account_name = ($('body').find('.console').text()).replace('MetalWarGame:console', '').replace('>', '').trim();
                let units_container = $('#__layout > div > div > div.container > div.shards_info > div > div > div.menu_container > div > div > div > div.units_container');
                let units_line = $(units_container).children('.units_line');
                if (list_units == 0) {

                    units_line.each(async (key, value) => {
                        list_units = 1;
                        console.log(key);
                        // let units_line = $(value).children('.units_line');
                        // // let units_line = $('#__layout > div > div > div.container > div.shards_info > div > div > div.menu_container > div > div > div > div.units_container > div.units_line');
                        // console.log(units_line);
                        let hp = parseInt($(value).find('.hp_text').text().split('/').shift());
                        let max_hp = parseInt($(value).find('.hp_text').text().split('/').pop());
                        console.log("🚀 HP:", hp, '🚀 HP.MAX:', max_hp)
                        let repair_price = parseInt($(value).find('.repair_price').text());
                        console.log("🚀 REPAIR.PRICE:", repair_price)
                        console.log("🚀 transaction:", action_transaction)
                        if (action_transaction == 0) {
                            if (hp <= 540) {
                                if (mwm - repair_price >= 0) {
                                    if (timerand_on == 0) {
                                        n = 1;
                                        let addtime = Math.floor(Math.random() * (timerand_umax + 1 - timerand_umin) + timerand_umin);
                                        setTimeout(() => {
                                            timerand_on = 1;
                                            console.log('Delay', n);
                                            n++;
                                        }, addtime * 1000);
                                    } else {
                                        let btn_repair = $(value).children().eq(2).children('.button')[0];
                                        let cpu_res = await fetch('https://wax.cryptolions.io/v2/state/get_account?account=' + account_name);
                                        if (cpu_res.ok) {
                                            let res = await cpu_res.json();
                                            cpu = parseFloat(res.account.cpu_limit.used / res.account.cpu_limit.max * 100);
                                            console.log("🚀 cpu:", cpu)
                                        }
                                        if (cpu < cpulitmit) {
                                            console.log("🚀 ~ btn_repair", btn_repair)
                                            $(btn_repair).trigger('click');
                                            console.log("click: repair", key)
                                            action_transaction = 1;
                                            setTimeout(() => {
                                                action_transaction = 0;
                                                timerand_on = 0;
                                            }, 20 * 1000);
                                        }
                                    }
                                } else {
                                    console.log('cant repair not enought MWM need : ', repair_price - mwm, 'MWM');
                                }
                            } else {
                                if (timerand_on == 0) {
                                    n = 1;
                                    let addtime = Math.floor(Math.random() * (timerand_umax + 1 - timerand_umin) + timerand_umin);
                                    setTimeout(() => {
                                        timerand_on = 1;
                                        console.log('Delay', n);
                                        n++;
                                    }, addtime * 1000);
                                } else {
                                    let btn_raid = $(value).children().eq(3).children('.button')[0];
                                    if ($(btn_raid).css("opacity") != 0.5) {
                                        let addtime = Math.floor(Math.random() * (timerand_umax + 1 - timerand_umin) + timerand_umin);
                                        sleep(addtime * 1000);
                                        let cpu_res = await fetch('https://wax.cryptolions.io/v2/state/get_account?account=' + account_name);
                                        if (cpu_res.ok) {
                                            let res = await cpu_res.json();
                                            cpu = parseFloat(res.account.cpu_limit.used / res.account.cpu_limit.max * 100);
                                            console.log("🚀 cpu:", cpu)
                                        }
                                        if (cpu < cpulitmit) {
                                            console.log("🚀 ~ btn_raid", btn_raid)
                                            $(btn_raid).trigger('click');
                                            console.log("click: raid", key)
                                            action_transaction = 1;
                                            setTimeout(() => {
                                                action_transaction = 0;
                                                timerand_on = 0;
                                            }, 20 * 1000);
                                        }
                                    }
                                }
                            }
                        } else {
                            console.log('transaction in progress WAIT PLS');
                        }
                    });
                    list_units = 0;
                }

            }

        }
        // console.log(timecount);
        // timecount++;
        // if (timecount > 5) {
        //     clearInterval(timers.runner);
        // }
    }, 1000);
}
const stop = async () => {
    $('#sts').text('stop');
    console.log('stop');
    clearInterval(timers.runner);
}


const timerand_set = async (timerand = {}) => {
    let min = $('#timerand_min').val();
    // console.log("🚀 ~ file: metal_click.js ~ line 217 ~ consttimerand_set= ~ min", min)
    let max = $('#timerand_max').val();
    // console.log("🚀 ~ file: metal_click.js ~ line 219 ~ consttimerand_set= ~ max", max)
    timerand = { 'timerand': { "min": min, "max": max } };
    chrome.storage.local.set(timerand, function () {
        // console.log('Value is set to ', timerand);
    });
}

const timerand_get = async () => {
    chrome.storage.local.get(["timerand"], function (result) {
        console.log('Value currently is ', result);
    });
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}