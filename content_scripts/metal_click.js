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
var objbtn = `<div style='position: relative;
display: flex;
z-index: 1;
margin-left: auto;
margin-right: auto;
text-align: center;
justify-content: center;
align-items: center;'>${btn1}${btn2}${span}</div>`;
var account_name;
$.when(
    $("body").append(objbtn),
    $.ready
).done(function (data) {
    // $('body').trigger('click');
    $('#start').on('click', start)
    $('#stop').on('click', stop)
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
const start = async () => {
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
                            if (hp == 0) {
                                if (mwm - repair_price >= 0) {
                                    let btn_repair = $(value).children().eq(2).children('.button.raid')[0];
                                    console.log("🚀 ~ btn_repair", btn_repair)
                                    $(btn_repair).trigger('click');
                                    console.log("click: repair", key)
                                    action_transaction = 1;
                                    setTimeout(() => {
                                        action_transaction = 0;
                                    }, 20 * 1000);
                                } else {
                                    console.log('cant repair not enought MWM need : ', repair_price - mwm, 'MWM');
                                }
                            } else {
                                let btn_raid = $(value).children().eq(3).children('.button.raid')[0];
                                if ($(btn_raid).css("opacity") != 0.5) {
                                    let cpu_res = await fetch('https://wax.cryptolions.io/v2/state/get_account?account=' + account_name);
                                    if (cpu_res.ok) {
                                        let res = await cpu_res.json();
                                        cpu = parseFloat(res.account.cpu_limit.used / res.account.cpu_limit.max * 100);
                                        console.log("🚀 cpu:", cpu)
                                    }
                                    if (cpu < 96) {
                                        console.log("🚀 ~ btn_raid", btn_raid)
                                        $(btn_raid).trigger('click');
                                        console.log("click: raid", key)
                                        action_transaction = 1;
                                        setTimeout(() => {
                                            action_transaction = 0;
                                        }, 20 * 1000);
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

