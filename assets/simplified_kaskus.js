function save_smiley_localStorageSK(t) {
    if (localStorage) {
        if (a = JSON.parse(localStorage.getItem(mru_key)))
            for (var e in a) e === "smilie" + t && delete a[e];
        else var a = new Object;
        mru_limit == Object.keys(a).length && delete a[Object.keys(a)[0]], a["smilie" + t] = t, localStorage.setItem(mru_key, JSON.stringify(a))
    }
}

function get_revamp_MRUSK() {
    var t = [];
    if (localStorage[mru_key] && (mru = JSON.parse(localStorage[mru_key]), mru)) {
        for (var e in mru) e.search("smilie") > -1 && t.push(mru[e]);
        var a = {
            smilies: t
        }
    }
    return a || {}
}
var giphy_tab_id, giphy_timer, fetched_smilies = null;

function get_revamp_smiliesSK() {
    if (localSmilies = get_revamp_MRUSK(), localSmilies) var t = {
        smilies: $.param(localSmilies)
    };
    null == fetched_smilies ? $.ajax({
        method: "POST",
        url: "/misc/get_smilies/0",
        data: t || {}
    }).done(get_revamp_smilies_successSK) : $("#jsSmiliesWrapper8").toggleClass("is-open")
}

function get_revamp_smilies_successSK(t) {
    fetched_smilies = t, build_revamp_smilies_tagSK(t)
}

function openSmileyTabSK(t, e) {
    $("#jsSmiliesTabNavHead div").removeClass("is-active"), $(e).parent().addClass("is-active"), $(".tabcontent").hide(), $(t).show()
}

function open_smiley_tabSK(t, e, a) {
    "Giphy" == a && get_giphy_revampSK(t), $("#jsSmiliesTabNavHead div").removeClass("is-active"), $(e).addClass("is-active"), $(".tabcontent").hide(), $(t).show(), title = $(e).find(".tabNavIcon").attr("data-title"), smilie_trackingSK("smiley", "click", title)
}

function insert_smileySK(t, e, a) {
    var s = $(e).val(),
        i = $(e).prop("selectionStart"),
        o = s.substring(0, i),
        r = s.substring(i, s.length);
    $(e).val(o + t + r), $(e).focus(), $(e).prop("selectionStart", i + t.length), a && save_smiley_localStorageSK(t)
}

function build_revamp_smilies_tagSK(t) {
    parsed = JSON.parse(t), smilies = JSON.parse(parsed.kaskus);
    $("#jsSmiliesTabNavHead").append(parsed.tab), $("#jsSmiliesTabContent").append(parsed.content), load_MRU_revampSK(), $("#tab-mru").show()
}

function load_MRU_revampSK() {
    var t = $("#content-mru").find(".loadMRU");
    return t && $.each(t, function (t, e) {
        $(e).attr("src", $('.loadSmilies[alt="' + $(e).attr("data-src") + '"]').attr("src")), $(e).attr("title", $('.loadSmilies[alt="' + $(e).attr("data-src") + '"]').attr("title")), $(e).attr("alt", $('.loadSmilies[alt="' + $(e).attr("data-src") + '"]').attr("alt"))
    }), !0
}

function get_giphy_revampSK(t, e) {
    giphy_tab_id = t, $.ajax({
        method: "POST",
        url: "/misc/get_giphy/0",
        cache: !1,
        data: {
            keyword: e
        }
    }).done(function (t) {
        giphy = JSON.parse(t), $(giphy_tab_id).html(giphy), $("#search-giphy").focus(), e && $("#search-giphy").val(e), $("#search-giphy").keydown(function (t) {
            13 === t.keyCode && (clearTimeout(giphy_timer), t.preventDefault(), query = t.target.value, get_giphy_revampSK(giphy_tab_id, query))
        })
    })
}
var giphy_keyword = null;

function search_revamp_giphySK(t) {
    clearTimeout(giphy_timer), giphy_timer = setTimeout(function () {
        return giphy_keyword != t.value && (giphy_keyword = t.value, get_giphy_revampSK(giphy_tab_id, giphy_keyword)), !1
    }, 1e3)
}

function smilie_trackingSK(t, e, a) {
    _gaq.push(["_trackEvent", t, e, a]), dataLayer.push({
        event: "trackEvent",
        "eventDetails.category": t,
        "eventDetails.action": e,
        "eventDetails.label": a
    })
}