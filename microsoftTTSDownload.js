// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://azure.microsoft.com/zh-cn/services/cognitive-services/text-to-speech/*
// @icon         https://www.google.com/s2/favicons?domain=microsoft.com
// @grant        none
// ==/UserScript==

"use strict";
(function (n) {
    window.initializeTTSDemo = function (t) {
        console.log(t)
        n(document).ready(function () {
            function ot() {
                var i = c.SpeechTranslationConfig.fromAuthorizationToken(t.token, t.region),
                    n, r;
                i.speechSynthesisOutputFormat = c.SpeechSynthesisOutputFormat.Audio48Khz192KBitRateMonoMp3;
                v = new c.SpeakerAudioDestination;
                v.onAudioEnd = function () {
                    p.hidden = !0;
                    y.hidden = !1
                };
                r = c.AudioConfig.fromSpeakerOutput(v);
                n = new c.SpeechSynthesizer(i, r);

                n.synthesisCompleted = function () {
                    n.close();
                    n = null
                };
                n.SynthesisCanceled = function (n, i) {
                    var r;
                    p.hidden = !0;
                    y.hidden = !1;
                    r = c.CancellationDetails.fromResult(i);
                    r.reason === c.CancellationReason.Error && (b.innerText = t.srTryAgain)
                };
                n.speakSsmlAsync(it.value, result => {

                    let url = window.URL.createObjectURL(new Blob([result.audioData], {
                        type: "arraybuffer"
                    }))
                    const link = document.createElement('a');
                    link.style.display = 'none';
                    link.href = url;
                    link.setAttribute('download', 'out.mp4');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    n.close();
                    return result.audioData;
                }, function (n) {
                    b.innerText = t.srTryAgain + " " + n
                })
            }

            function l() {
                var n = '<prosody rate="{SPEED}" pitch="{PITCH}">{TEXT}<\/prosody>',
                    t;
                n = n.replace("{SPEED}", o.value + "%");
                n = n.replace("{PITCH}", s.value + "%");
                e.selectedIndex === 0 && (w.hidden || h.selectedIndex === 0) || (n = "<mstts:express-as {STYLE_ATTRIBUTE} {ROLE_PLAY_ATTRIBUTE}>{0}<\/mstts:express-as>".replace("{0}", n), n = e.selectedIndex !== 0 ? n.replace("{STYLE_ATTRIBUTE}", 'style="' + e[e.selectedIndex].value + '"') : n.replace("{STYLE_ATTRIBUTE}", ""), n = w.hidden || h.selectedIndex === 0 ? n.replace("{ROLE_PLAY_ATTRIBUTE}", "") : n.replace("{ROLE_PLAY_ATTRIBUTE}", 'role="' + h[h.selectedIndex].value + '"'));
                n = '<voice name="{VOICE}">{0}<\/voice>'.replace("{0}", n);
                n = n.replace("{VOICE}", i[i.selectedIndex].value);
                t = a.value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
                d.hidden || (t = '<lang xml:lang="{SECONDARY_LOCALE}">{0}<\/lang>'.replace("{0}", t), t = t.replace("{SECONDARY_LOCALE}", f[f.selectedIndex].value));
                n = '<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US">{0}<\/speak>'.replace("{0}", n);
                n = n.replace("{TEXT}", t);
                it.value = n
            }
            var rt = document.getElementById("playbtn"),
                y = document.getElementById("playli"),
                ut = document.getElementById("stopbtn"),
                p = document.getElementById("stopli"),
                r = document.getElementById("languageselect"),
                i = document.getElementById("voiceselect"),
                e = document.getElementById("voicestyleselect"),
                h = document.getElementById("roleplayselect"),
                w = document.getElementById("roleplayselectdiv"),
                f = document.getElementById("secondarylocaleselect"),
                d = document.getElementById("secondarylocaleselectdiv"),
                a = document.getElementById("ttstext"),
                it = document.getElementById("ttsssml"),
                b = document.getElementById("ttsstatus"),
                o = document.getElementById("speed"),
                ft = document.getElementById("speedlabel"),
                s = document.getElementById("pitch"),
                et = document.getElementById("pitchlabel"),
                v = null,
                c = window.SpeechSDK,
                k = {},
                g = {},
                nt = {},
                tt = {},
                u;
            c = window.SpeechSDK;
            n.ajax({
                url: "https://" + t.region + ".tts.speech.microsoft.com/cognitiveservices/voices/list",
                type: "GET",
                beforeSend: function (n) {
                    n.setRequestHeader("Authorization", "Bearer " + t.token)
                },
                success: function (i) {
                    var u = i.sort(function (n, t) {
                        return n.VoiceType.localeCompare(t.VoiceType)
                    });
                    n.each(u, function (n, i) {
                        var r = i.DisplayName;
                        k[i.Locale] || (k[i.Locale] = "");
                        i.VoiceType === "Neural" && (r += " (Neural)");
                        i.LocalName !== i.DisplayName && (r += " - " + i.LocalName);
                        i.Status === "Preview" && (r += " - " + t.ttsPreview);
                        k[i.Locale] += '<option value="' + i.ShortName + '">' + r + "<\/option>";
                        g[i.ShortName] = i.StyleList;
                        nt[i.ShortName] = i.RolePlayList;
                        tt[i.ShortName] = i.SecondaryLocaleList
                    });
                    r.onchange()
                },
                error: function (n, i, r) {
                    b.innerText = t.srTryAgain;
                    global.Core.Util.TrackException("A Text To Speech voice list API Ajax error occurred: " + r)
                }
            });
            ut.onclick = function () {
                y.hidden = !1;
                p.hidden = !0;
                v !== null && v.pause();
                v = null
            };
            rt.onclick = function () {
                p.hidden = !1;
                y.hidden = !0;
                b.innerText = "";
                ot(function () {})
            };
            r.onchange = function () {
                u = "";
                n.each(t.ttsDefaultText, function (n, t) {
                    r[r.selectedIndex].value === n ? u = t : !u && r[r.selectedIndex].value.startsWith(n) && (u = t)
                });
                u || (u = t.ttsDefaultText.default);
                a.value = u;
                a.style.direction = ["ar", "he", "ur"].includes(r[r.selectedIndex].value.slice(0, 2)) ? "rtl" : "";
                i.innerHTML = k[r[r.selectedIndex].value];
                i.onchange();
                l()
            };
            i.onchange = function () {
                e.innerHTML = "";
                e.options.add(new Option("General", "general"));
                g[i[i.selectedIndex].value] ? (n.each(g[i[i.selectedIndex].value], function (n, t) {
                    e.options.add(new Option((t[0].toUpperCase() + t.slice(1)).replace("Customerservice", "Customer Service").replace("Voiceassistant", "Voice Assistant"), t))
                }), e.disabled = !1) : e.disabled = !0;
                nt[i[i.selectedIndex].value] ? (h.innerHTML = "", h.options.add(new Option("Default", "Default")), n.each(nt[i[i.selectedIndex].value], function (n, t) {
                    h.options.add(new Option(t, t))
                }), w.hidden = !1) : w.hidden = !0;
                tt[i[i.selectedIndex].value] ? (f.innerHTML = "", f.options.add(new Option(r[r.selectedIndex].text + " - Default", r[r.selectedIndex].value)), n(r.options).each(function () {
                    tt[i[i.selectedIndex].value].includes(n(this).attr("value")) && f.options.add(new Option(n(this).text(), n(this).attr("value")))
                }), d.hidden = !1) : d.hidden = !0;
                s.disabled = !1;
                o.disabled = !1;
                l()
            };
            e.onchange = function () {
                l()
            };
            h.onchange = function () {
                l()
            };
            f.onchange = function () {
                f.selectedIndex !== 0 ? (s.disabled = !0, o.disabled = !0) : (s.disabled = !1, o.disabled = !1);
                u = "";
                n.each(t.ttsDefaultText, function (n, t) {
                    f[f.selectedIndex].value === n ? u = t : !u && f[f.selectedIndex].value.startsWith(n) && (u = t)
                });
                u || (u = t.ttsDefaultText.default);
                a.value = u;
                l()
            };
            s.oninput = function () {
                var n = (s.value - s.min) / (s.max - s.min) * 2,
                    i;
                i = Math.abs(n) < 1 ? n.toPrecision(2) : n.toPrecision(3);
                et.innerText = t.ttsPitch + ": " + i
            };
            s.onchange = function () {
                l()
            };
            o.oninput = function () {
                var n = (o.value - o.min) / (o.max - o.min) * 3,
                    i;
                i = Math.abs(n) < 1 ? n.toPrecision(2) : n.toPrecision(3);
                ft.innerText = t.ttsSpeed + ": " + i
            };
            o.onchange = function () {
                l()
            };
            a.onchange = function () {
                l()
            }
        })
    }
})(jQuery)