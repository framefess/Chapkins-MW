var btn1 = "<button id='start' style='margin: 5px;'>START</button>";
var btn2 = "<button id='stop' style='margin: 5px;'>STOP</button>";
// var btn2 = "<label style='margin: 5px;'></label>";
var span = "<span id='sts' style='margin: 5px;color:red;'></span>";
var linebreak = '<div style="width: 100%;"></div>';
var divtimerand = `<div style="">
<input id="timerand_min"type="number" min="0" value="0" onchange="document.getElementById('timerand_max').min=this.value;"/>
<label>MIN</label>
<input id="timerand_max"type="number" min="0" value="0"/>
<label>MAX</label>
<input id="hp_min"type="number" min="0" value="0"/>
<label>HP</label>
<button hidden id='timerand_get' style='margin: 5px;'>get</button>
</div>`;
var btnset = `<button id='timerand_set' style='margin: 5px;'>SET</button>`;
var labelstatus = ` <label id="timerand_label">Time Random is <span></span>-<span></span> (Second)</br>
                    REPAIR IS <span></span> HP
</label>`;
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
<div id="Chapkins">
${btn1}${btn2}${span}${linebreak}
${divtimerand}${linebreak}
${btnset}${linebreak}
${labelstatus}
</div>`;

let account_name;
let timerand_umin = 0;
let timerand_umax = 0;
let hp_min = 0;
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
            hp_min = 0;
            $('#timerand_label > span:nth-child(1)').text(timerand_min);
            $('#timerand_label > span:nth-child(2)').text(timerand_max);
            $('#timerand_label > span:nth-child(4)').text(hp_min);
        } else {
            var timerand_min = parseInt(result.timerand.min);
            var timerand_max = parseInt(result.timerand.max);
            hp_min = parseInt(result.timerand.hp_min);
            $('#timerand_min').prop('min', timerand_min);
            $('#timerand_min').val(timerand_min);
            $('#timerand_max').prop('min', timerand_min);
            $('#timerand_max').val(timerand_max);
            $('#hp_min').val(hp_min);
            $('#timerand_label > span:nth-child(1)').text(timerand_min);
            $('#timerand_label > span:nth-child(2)').text(timerand_max);
            $('#timerand_label > span:nth-child(4)').text(hp_min);
        }
    });
    $('#start').on('click', start)
    $('#stop').on('click', stop)
    $('#timerand_set').on('click', timerand_set)
    $('#timerand_get').on('click', timerand_get)
    timers.start = setInterval(() => {
        let container_content = $('body').find('div.container_content');
        if (container_content.length > 0) {
            $('#__layout > div > div > div.container > div.container_content > div.info > div.notification_container').trigger('click');
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
let cpulitmit = 96;
let timerand_on = 0;
let timerand_count;
let timerand_firstset = 0;
let n = 1;
let mwm;
let apii = 0;
// "https://wax.pink.gg", "https://api.waxsweden.org",
const waxapi = ["https://api.wax.alohaeos.com", "https://wax.pink.gg", "https://api.waxsweden.org", "https://wax.greymass.com", "https://wax.dapplica.io", "https://wax.cryptolions.io"];
const start = async () => {

    chrome.storage.local.get(["timerand"], function (result) {
        // console.log('Value currently is ', result.timerand.min);
        timerand_umin = parseInt(result.timerand.min);
        timerand_umax = parseInt(result.timerand.max);
        hp_min = parseInt(result.timerand.hp_min);
        $('#timerand_label > span:nth-child(1)').text(timerand_umin);
        $('#timerand_label > span:nth-child(2)').text(timerand_umax);
        $('#timerand_label > span:nth-child(4)').text(hp_min);
    });
    $('#sts').text('Moomanow');
    console.log('start');
    timers.runner = setInterval(async () => {
        account_name = ($('body').find('.console').text()).replace('MetalWarGame:console', '').replace('>', '').trim();
        mwm = parseInt(($('body').find('.money').text()).slice(0, -4));
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

                let units_container = $('#__layout > div > div > div.container > div.shards_info > div > div > div.menu_container > div > div > div > div.units_container');
                let units_line = $(units_container).children('.units_line');
                if (action_transaction == 0) {
                    if ($(units_line).length > 0) {
                        let unit = $(units_line)[list_units];
                        console.log(unit);
                        let hp = parseInt($(unit).find('.hp_text').text().split('/').shift());
                        let max_hp = parseInt($(unit).find('.hp_text').text().split('/').pop());
                        console.log("🚀 HP:", hp, '🚀 HP.MAX:', max_hp)
                        let repair_price = parseInt($(unit).find('.repair_price').text());
                        console.log("🚀 REPAIR.PRICE:", repair_price)
                        console.log("🚀 transaction:", action_transaction)
                        let btn_raid = $(unit).children().eq(3).children('.button')[0];
                        let btn_repair = $(unit).children().eq(2).children('.button')[0];
                        if (hp <= hp_min) {
                            if (mwm - repair_price >= 0) {
                                action_transaction = 1;
                                let addtime = Math.floor(Math.random() * (timerand_umax + 1 - timerand_umin) + timerand_umin);
                                timerand_count = setInterval(() => {
                                    console.log('Repair Click Delay:', n, 'Addtime', addtime);
                                    n++;
                                    // console.log('n', n, 'addtime', addtime);
                                    if (n >= addtime) {
                                        clearInterval(timerand_count)
                                        n = 1;
                                        // timerand_on = 1;
                                    }
                                }, 1000);
                                setTimeout(() => {
                                    console.log(waxapi[apii]);
                                    try {
                                        fetch(waxapi[apii] + '/v2/state/get_account?account=' + account_name)
                                            .then((e) => {
                                                if (!e.ok) {
                                                    action_transaction = 0;
                                                    n = 1;
                                                    // throw new Error('Network response was not ok');
                                                    apii += 1;
                                                    if (apii >= waxapi.length) {
                                                        apii = 0;
                                                    }
                                                    console.log("error");
                                                    return false;
                                                } else {
                                                    return e.json();
                                                }
                                            }).then((res) => {
                                                if (res != false) {
                                                    console.log(res);
                                                    cpu = parseFloat(res.account.cpu_limit.used / res.account.cpu_limit.max * 100);
                                                    console.log("🚀 cpu:", cpu)
                                                    if (cpu < cpulitmit) {
                                                        console.log("🚀 ~ btn_repair", btn_repair)
                                                        $(btn_repair).trigger('click');
                                                        console.log("click: repair", list_units)
                                                        setTimeout(() => {
                                                            action_transaction = 0;
                                                            n = 1;
                                                            // timerand_on = 0;
                                                            // timerand_firstset = 0;
                                                        }, 20 * 1000);
                                                        // return false;
                                                    } else {
                                                        console.log("🚀 cant click cuz cpu > limit", cpu)
                                                        action_transaction = 0;
                                                        n = 1;
                                                    }
                                                }
                                            });
                                    } catch (error) {
                                        console.log("error");
                                        // throw new Error('Network response was not ok');
                                        action_transaction = 0;
                                        n = 1;
                                        apii += 1;
                                        if (apii >= waxapi.length) {
                                            apii = 0;
                                        }
                                    }

                                }, addtime * 1000);

                            } else {
                                console.log('cant repair not enought MWM need : ', repair_price - mwm, 'MWM');
                                list_units += 1;
                            }

                        } else if ($(btn_raid).css("opacity") != 0.5) {
                            action_transaction = 1;
                            let addtime = Math.floor(Math.random() * (parseInt(timerand_umax) + 1 - parseInt(timerand_umin)) + parseInt(timerand_umin));
                            timerand_count = setInterval(() => {
                                console.log('Mine/Raid Click Delay:', n, 'Addtime', addtime);
                                n++;

                                if (n >= addtime) {
                                    clearInterval(timerand_count);
                                    // timerand_on = 1;
                                    n = 1;
                                }
                            }, 1000);
                            setTimeout(() => {
                                console.log(waxapi[apii]);
                                try {
                                    fetch(waxapi[apii] + '/v2/state/get_account?account=' + account_name, { mode: "no-cors" })
                                        .then((e) => {
                                            console.log(e);
                                            if (!e.ok) {
                                                action_transaction = 0;
                                                n = 1;
                                                console.log(apii);
                                                console.log(waxapi.length);
                                                apii += 1;
                                                if (apii >= waxapi.length) {
                                                    apii = 0;
                                                }
                                                // throw new Error('Network response was not ok');
                                                return false;
                                            } else {
                                                return e.json();
                                            }
                                        }).then((res) => {
                                            if (res != false) {
                                                console.log(res);
                                                cpu = parseFloat(res.account.cpu_limit.used / res.account.cpu_limit.max * 100);
                                                console.log("🚀 cpu:", cpu)
                                                if (cpu < cpulitmit) {
                                                    console.log("🚀 ~ btn_raid", btn_raid)
                                                    $(btn_raid).trigger('click');
                                                    console.log("click: raid", list_units)
                                                    setTimeout(() => {
                                                        action_transaction = 0;
                                                        // timerand_on = 0;
                                                        n = 1;
                                                        // timerand_firstset = 0;
                                                    }, 20 * 1000);
                                                } else {
                                                    console.log("🚀 cant click cuz cpu > limit", cpu)
                                                    action_transaction = 0;
                                                    n = 1;
                                                }
                                            }

                                        });
                                } catch (error) {
                                    // throw new Error('Network response was not ok');
                                    console.log("error");
                                    action_transaction = 0;
                                    n = 1;
                                    apii += 1;
                                    if (apii >= waxapi.length) {
                                        apii = 0;
                                    }
                                }
                            }, addtime * 1000);

                        } else {
                            list_units += 1;
                        }

                        if (list_units >= $(units_line).length) {
                            list_units = 0;
                        }

                    }

                } else {
                    console.log('transaction in progress WAIT PLS');
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
    clearInterval(timerand_count);
    action_transaction = 0;
    timerand_on = 0;
    // n = 1;
    timerand_firstset = 0;
}


const timerand_set = async (timerand = {}) => {
    let min = $('#timerand_min').val();
    // console.log("🚀 ~ file: metal_click.js ~ line 217 ~ consttimerand_set= ~ min", min)
    let max = $('#timerand_max').val();
    hp_min = $('#hp_min').val();
    // console.log("🚀 ~ file: metal_click.js ~ line 219 ~ consttimerand_set= ~ max", max)
    timerand = { 'timerand': { "min": min, "max": max, "hp_min": hp_min } };
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