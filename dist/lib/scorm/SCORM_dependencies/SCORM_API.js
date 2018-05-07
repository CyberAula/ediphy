/*
 * SCORM API
 * This is a API that establishes communication with LMSs in SCORM 1.2 or SCORM 2004.
 *
 * Modifiyed by GING.
 *
 * Original provided by:
 *
 * Mark Statkus <mark@cybercussion.com>
 * https://github.com/cybercussion/SCOBot
 * Copyright (c) 2009-2014, Cybercussion Interactive LLC
 * Creative Commons Attribution-ShareAlike 4.0 International License.
 *
 * This is a content API, it self-establishes communication with the LMS in SCORM 2004 or 1.2.
 * Switch statements will convert some SCORM 2004 calls to SCORM 1.2, but you must understand there are limitations
 * on data storage between versions. Example: Suspend Data 64,000 vs 4096 or Bookmark(location) 1000 vs 255.
 * Depending on your use, your content may not squeeze into the SCORM 1.2 available space.  Because of this, log messages
 * will be output so you can monitor your cmi "set" value length.  Ultimately, a LMS may block your request because of this.
 * This API is meant to simplify common SCORM Tasks, but also offers the ability to use it 'long hand'. Several other
 * public API's are available online, some free some charge, and this is a best effort to boil it all down.
 * Documentation, samples, resources, and credits: ADL, Claude Ostyn, Pipwerks, SCORM.com
 * Goals: SCORM For Everyone else, low overhead, simple API's, containment, and transparency.
 *
 * Typical CMI Usage (if used by itself):
 * var scorm = new SCORM_API({debug: true, exit_type: 'suspend'}),
 * lmsconnected = scorm.initialize();
 * scorm.getvalue('cmi.location');
 * scorm.setvalue('cmi.location','4');
 * scorm.commit();
 * scorm.terminate();
 *
 * @version 3.1.3
 */
/* eslint-disable */
export default function SCORM_API(options) {
    // Constructor ////////////

    // Please edit run time options or override them when you instantiate this object.
    let defaults = {
            version: "3.1.3",
            debug: false,
            windowDebug: false,
            isActive: false,
            throw_alerts: false,
            prefix: "SCORM_API",
            exit_type: "suspend", // suspend, finish, or "" (undetermined)
            success_status: "unknown", // passed, failed, unknown
            completion_status: "unknown", // completed, incomplete, unknown
            time_type: "GMT",
            cmi: null,
        },

        // Settings merged with defaults and extended options
        settings = Object.assign({}, defaults, options),
        // Internal API Error Boolean, Error Code object
        isError = 0,
        error = {
            0: "No Error",
            404: "Not Found",
            405: "Prevented on a read only resource",
        },

        // API Object
        API = {
            connection: false,
            version: "none", // 2004, 1.2 or none
            mode: "",
            path: false,
            data: {
                completion_status: settings.completion_status,
                success_status: settings.success_status,
                exit_type: settings.exit_type,
            },
            isActive: settings.isActive,
        },
        self = this;

    // Public to Public call hook within the internal API
    // Set some more 'settings'
    settings.error = error; // Inherit
    settings.startDate = {}; // Set on Success of Initialize aka "the start time"
    // End Constructor ////////

    // Private ////////////////

    /**
   * Debug
   * Built-In Debug Functionality to output to console (Firebug, Inspector, Dev Tool etc ...)
   * @param msg {String} Debug Message
   * @param lvl {Integer} 1=Error, 2=Warning, 3=Log, 4=Info
   */
    function debug(msg, lvl) {
        if(settings) {
            msg = settings.prefix + ": " + msg;
            if(settings.debug) {
                if(settings.windowDebug == true) {
                    windowDebug(msg, lvl);
                } else {
                    _debug(msg, lvl);
                }
            }
            if(lvl < 3 && settings.throw_alerts) {
                alert(msg);
            }
        }
        return false;
    }

    function _debug(msg, lvl) {
    // IE 7 probably 6 was throwing a error if 'console undefined'
        if(!window.console) {
            window.console = {};
            window.console.info = noconsole;
            window.console.log = noconsole;
            window.console.warn = noconsole;
            window.console.error = noconsole;
            window.console.trace = noconsole;
        }
        switch(lvl) {
        case 1:
            console.error(msg);
            break;
        case 2:
            console.warn(msg);
            break;
        case 4:
            console.info(msg);
            break;
        case 3:
            console.log(msg);
            break;
        default:
            console.log(msg);
            return false;
        }
        return true;
    }

    /**
   * No Console
   * Lack of support in older browsers forced this
   * @param msg {String} Debug Message
   * @param lvl {*} 1=Error, 2=Warning, 3=Log, 4=Info
   * @event debug fired when no console is available.  You could listen to this to put it in an alternative log.
   */
    function noconsole(msg, lvl) {
    // ignore (IE 8 and prior or other browser that doesn't support it).
    }

    // Debug in a new window
    // debug info
    let aryDebug = new Array();
    let strDebug = "";
    let winDebug;

    function windowDebug(strInfo, lvl) {

        let isDebugWindowShown = false;
        if(!winDebug || winDebug.closed) {
            isDebugWindowShown = ShowDebugWindow();
        } else {
            isDebugWindowShown = true;
        }

        if(isDebugWindowShown == false) {
            // pop-up window blocked
            // Disable windowDebug
            settings.windowDebug = false;
            debug("Window debug has been blocked", 1);
            debug("Debugging messages will be displayed in the console", 2);
            debug(strInfo, lvl);
            return false;
        }

        let strLine;
        strLine = (aryDebug.length + 1) + ": " + strInfo;
        aryDebug[aryDebug.length] = strLine;

        if(winDebug && !winDebug.closed) {
            winDebug.document.write(strLine + "<br>\n");
        }

        return true;
    }

    function ShowDebugWindow() {
        if (winDebug && !winDebug.closed) {
            winDebug.close();
        }

        winDebug = window.open("", "Debug", "width=600,height=300,resizable,scrollbars");

        if((typeof winDebug === "undefined") || (winDebug === null)) {
            // pop-up window blocked
            return false;
        }

        winDebug.document.write(aryDebug.join("<br>\n"));

        winDebug.document.close();

        winDebug.focus();

        return true;
    }

    /**
   * Find API
   * API_1484_11 or API for SCORM 2004 or 1.2
   * @param win {object} Window level
   */
    function findAPI(win) {
        let attempts = 0, limit = 500;
        while ((!win.API && !win.API_1484_11) && (win.parent) && (win.parent !== win) && (attempts <= limit)) {
            attempts += 1;
            win = win.parent;
        }
        if(win.API_1484_11) { // SCORM 2004-specific API.
            API.version = "2004";
            // Set version
            API.path = win.API_1484_11;
        } else if(win.API) { // SCORM 1.2-specific API
            API.version = "1.2";
            // Set version
            API.path = win.API;
        } else {
            return false;
        }
        return true;
    }

    // SCORM Time centric to SCORM 2004 and 1.2 Compatibility
    /**
   * Centiseconds To ISO Duration
   * Borrowed from Claude Ostyn, but touched up for JSLint/JavaScript and evil "with" statement
   * @param n {Number} Total Seconds
   * @param bPrecise {Boolean} Only Set true if were dealing with months, years (highly unlikely)
   * @returns {String} SCORM 2004 Time PT0H0M0S Format
   */
    function centisecsToISODuration(n, bPrecise) {
    /* Note: SCORM and IEEE 1484.11.1 require centisec precision
     Parameters:
     n = number of centiseconds
     bPrecise = optional parameter; if true, duration will
     be expressed without using year and/or month fields.
     If bPrecise is not true, and the duration is long,
     months are calculated by approximation based on average number
     of days over 4 years (365*4+1), not counting the extra days
     for leap years. If a reference date was available,
     the calculation could be more precise, but becomes complex,
     since the exact result depends on where the reference date
     falls within the period (e.g. beginning, end or ???)
     1 year ~ (365*4+1)/4*60*60*24*100 = 3155760000 centiseconds
     1 month ~ (365*4+1)/48*60*60*24*100 = 262980000 centiseconds
     1 day = 8640000 centiseconds
     1 hour = 360000 centiseconds
     1 minute = 6000 centiseconds */
        let str = "P",
            nCs = Math.max(n, 0),
            nY = 0,
            nM = 0,
            nD = 0,
            nH,
            nMin;
        // Next set of operations uses whole seconds
        // with (Math) { //argumentatively considered harmful
        nCs = Math.round(nCs);
        if (bPrecise === true) {
            nD = Math.floor(nCs / 8640000);
        } else {
            nY = Math.floor(nCs / 3155760000);
            nCs -= nY * 3155760000;
            nM = Math.floor(nCs / 262980000);
            nCs -= nM * 262980000;
            nD = Math.floor(nCs / 8640000);
        }
        nCs -= nD * 8640000;
        nH = Math.floor(nCs / 360000);
        nCs -= nH * 360000;
        nMin = Math.floor(nCs / 6000);
        nCs -= nMin * 6000;
        // }
        // Now we can construct string
        if (nY > 0) {
            str += nY + "Y";
        }
        if (nM > 0) {
            str += nM + "M";
        }
        if (nD > 0) {
            str += nD + "D";
        }
        if ((nH > 0) || (nMin > 0) || (nCs > 0)) {
            str += "T";
            if (nH > 0) {
                str += nH + "H";
            }
            if (nMin > 0) {
                str += nMin + "M";
            }
            if (nCs > 0) {
                str += (nCs / 100) + "S";
            }
        }
        if (str === "P") {
            str = "PT0H0M0S";
        }
        // technically PT0S should do but SCORM test suite assumes longer form.
        return str;
    }

    /**
   * ISO Duration to Centisecond
   * @param str
   * @return {Number}
   */
    function ISODurationToCentisec(str) {
    // Only gross syntax check is performed here
    // Months calculated by approximation based on average number
    // of days over 4 years (365*4+1), not counting the extra days
    // in leap years. If a reference date was available,
    // the calculation could be more precise, but becomes complex,
    // since the exact result depends on where the reference date
    // falls within the period (e.g. beginning, end or ???)
    // 1 year ~ (365*4+1)/4*60*60*24*100 = 3155760000 centiseconds
    // 1 month ~ (365*4+1)/48*60*60*24*100 = 262980000 centiseconds
    // 1 day = 8640000 centiseconds
    // 1 hour = 360000 centiseconds
    // 1 minute = 6000 centiseconds
        let aV = [0, 0, 0, 0, 0, 0],
            bErr = !!((str.indexOf("P") !== 0)),
            bTFound = false,
            aT = ["Y", "M", "D", "H", "M", "S"],
            p = 0,
            i = 0,
            len;
        if (!bErr) {
            str = str.substr(1); // get past the P
            len = aT.length;
            i = 0;
            // for (i = 0; i < len; i += 1) {
            while (i < len) {
                if (str.indexOf("T") === 0) {
                    str = str.substr(1);
                    i = Math.max(i, 3);
                    bTFound = true;
                }
                p = str.indexOf(aT[i]);
                if (p > -1) {
                    /* jslint continue: true */
                    if ((i === 1) && (str.indexOf("T") > -1) && (str.indexOf("T") < p)) {
                        continue;
                    }
                    /* jslint continue: false */
                    if (aT[i] === "S") {
                        aV[i] = parseFloat(str.substr(0, p));
                    } else {
                        aV[i] = parseInt(str.substr(0, p), 10);
                    }
                    if (isNaN(aV[i])) {
                        bErr = true;
                        break;
                    }
                    if ((i > 2) && (!bTFound)) {
                        bErr = true;
                        break;
                    }
                    str = str.substr(p + 1);
                }
                i += 1;
            }
            bErr = !!(((!bErr) && (len !== 0)));
        }
        if (bErr) {
            return 0;
        }
        return aV[0] * 3155760000 + aV[1] * 262980000
      + aV[2] * 8640000 + aV[3] * 360000 + aV[4] * 6000
      + Math.round(aV[5] * 100);
    }

    /**
   * Pad Time
   * Pads time with proper formatting (double digits)
   */
    function padTime(n) {
        return n < 10 ? '0' + n : n;
    }

    /**
   * ISO 8601 Date String UTC
   * Converts date object into ISO 8601 standard
   * returns {String} ISO 8601 + UTC
   */
    function isoDateToStringUTC(d) {
        return d.getUTCFullYear() + '-' + padTime(d.getUTCMonth() + 1) + '-' + padTime(d.getUTCDate()) + 'T' + padTime(d.getUTCHours()) + ':' + padTime(d.getUTCMinutes()) + ':' + padTime(d.getUTCSeconds()) + "." + Math.round((d.getUTCMilliseconds() / 1000) % 1000) + 'Z';
    }

    /**
   * ISO 8601 Date String
   * Concerts date into ISO 8601 Standard
   * @returns {String} ISO 8601
   */
    function isoDateToString(d) {
        let offset = d.getTimezoneOffset() > 0 ? '-' : '+';
        return d.getFullYear() + '-' + padTime(d.getMonth() + 1) + '-' + padTime(d.getDate()) + 'T' + padTime(d.getHours()) + ':' + padTime(d.getMinutes()) + ':' + padTime(d.getSeconds()) + "." + Math.round((d.getMilliseconds() / 1000) % 1000) + offset + padTime(d.getTimezoneOffset() / 60) + ':00';
    // return d.getFullYear() + '-' + padTime(d.getMonth() + 1) + '-' + padTime(d.getDate()) + 'T' + padTime(d.getHours()) + ':' + padTime(d.getMinutes()) + ':' + padTime(d.getSeconds());
    }

    /**
   * ISO 8601 String to Date
   * Not extremely clear yet if this is needed at a SCO level.  If not I'll remove it later.
   * @param str {String} ISO8601
   * @return {Object} Date Object or false
   */
    function isoStringToDate(str) {
        let MM = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            d,
            uoffset,
            offset = 0,
            mil = 0,
            dd;
        /* jslint unparam: true*/
        switch (settings.time_type) {
        case "UTC":
            d = str.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))(|Z)/, function($0, $Year, $Month, $Day, $Hour, $Min, $Sec) {
                return MM[$Month - 1] + " " + $Day + ", " + $Year + " " + $Hour + ":" + $Min + ":" + $Sec;
            });
            dd = new Date.UTC(d);
            return dd;
        case "GMT":
            d = str.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))([\+|\-]\d+:\d+)/, function($0, $Year, $Month, $Day, $Hour, $Min, $Sec, $Ms, $Offset) {
                offset = parseInt($Offset.substring(1, $Offset.length), 10) * 60 * 60 * 60;
                mil = $Ms;
                return MM[$Month - 1] + " " + $Day + ", " + $Year + " " + $Hour + ":" + $Min + ":" + $Sec;
                // return $Year + "," + ($Month - 1) + "," + $Day + "," + $Hour + "," + $Min + "," + $Sec + "," + $Ms;
            });
            // At this point we have to convert the users offset to the recorded offset to set the date properly.
            dd = new Date(d);
            uoffset = dd.getTimezoneOffset() * 60 * 60;
            if (uoffset !== offset) {
                dd = new Date(dd.getTime() + offset + uoffset);
                dd.setMilliseconds(mil);
            }
            return dd;
        default:
            d = str.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/, function($0, $Year, $Month, $Day, $Hour, $Min, $Sec) {
                return MM[$Month - 1] + " " + $Day + ", " + $Year + " " + $Hour + ":" + $Min + ":" + $Sec;
            });
            dd = new Date(d);
            return dd;
        }
    }

    /**
   * Centiseconds To SCORM 1.2 Duration
   * Borrowed from Claude Ostyn, but touched up for JSLint/JavaScript and evil "with" statement
   * @param n {Number} Total Seconds
   * @returns {String} SCORM 2004 Time PT0H0M0S Format
   */
    function centisecsToSCORM12Duration(n) {
    // Format is [HH]HH:MM:SS[.SS]
        let // bTruncated = false,
            str,
            nH,
            nCs,
            nM,
            nS;
        // with (Math) { agrumentavely considered harmful
        n = Math.round(n);
        nH = Math.floor(n / 360000);
        nCs = n - nH * 360000;
        nM = Math.floor(nCs / 6000);
        nCs = nCs - nM * 6000;
        nS = Math.floor(nCs / 100);
        nCs = nCs - nS * 100;
        // }
        /* if (nH > 9999) {
     nH = 9999;
     bTruncated = true;
     }*/
        str = "0000" + nH + ":";
        str = str.substr(str.length - 5, 5);
        if (nM < 10) {
            str += "0";
        }
        str += nM + ":";
        if (nS < 10) {
            str += "0";
        }
        str += nS;
        if (nCs > 0) {
            str += ".";
            if (nCs < 10) {
                str += "0";
            }
            str += nCs;
        }
        // if (bTruncated) alert ("Hours truncated to 9999 to fit HHHH:MM:SS.SS format")
        return str;
    }

    // End SCORM Time Handlers /////////////////////////////

    /**
   * Make Boolean
   * Turns 'yes', 'no', 'true', 'false', '0', '1' into true/false
   * @param str {String} value to turn to boolean
   * @returns {Boolean}
   */
    function makeBoolean(str) {
        if (str === undefined) {
            debug("makeBoolean was given empty string, converting to false", 2);
            return false;
        }
        if (str === true || str === false) {
            return Boolean(str);
        }
        switch (str.toLowerCase()) {
        case "true":
        case "yes":
        case "1":
            return true;
        case "false":
        case "no":
        case "0":
        case null:
            return false;
        default:
            return Boolean(str);
        }
    }

    /**
   * Trigger Warning (internal to this API)
   * Throws a console log when a SCORM API Error occurs
   * @returns {Boolean}
   */
    function triggerWarning(n) {
        debug(error[n], 2);
        return true;
    }

    /**
   * Trigger Exception
   */
    function triggerException(msg) {
        triggerHandler('exception', { 'error': msg });
        debug("EXCEPTION: " + msg, 1);
        return true;
    }

    function triggerHandler(eventName, eventParams) {
    // CustomEvent polyfill
        (function() {
            if (typeof window.CustomEvent === "function") {return false;}
            function CustomEvent(event, params) {
                params = params || { bubbles: false, cancelable: false, detail: undefined };
                let evt = document.createEvent('CustomEvent');
                evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
                return evt;
            }
            CustomEvent.prototype = window.Event.prototype;
            window.CustomEvent = CustomEvent;
        })();
        document.dispatchEvent(new CustomEvent(eventName, { 'detail': eventParams }));
    }

    /**
   * Get Last LMS Error Code
   * Error Code should be 0 if its anything else, a error has occurred
   * @returns {Number}
   */
    function getLastErrorCode() {
        let lms = API.path, // shortcut
            code = 0;
        // default error code
        if (lms) {
            switch (API.version) {
            case "1.2":
                code = parseInt(lms.LMSGetLastError(), 10);
                break;
            case "2004":
                code = parseInt(lms.GetLastError(), 10);
                break;
            default:
                // handle nonLMS?
                break;
            }
        }
        return code;
    }

    /**
   * Get Last LMS Error Message
   * Error Message associated by error code
   * @param n {Number} error code
   * @returns {String} error message
   */
    function getLastErrorMessage(n) {
        let lms = API.path, // shortcut
            result = 'No LMS Connectivity';
        // default message
        if (lms) {
            switch (API.version) {
            case "1.2":
                result = lms.LMSGetErrorString(n.toString());
                break;
            case "2004":
                result = lms.GetErrorString(n.toString());
                break;
            default:
                // handle nonLMS?
                break;
            }
        }
        return String(result);
    }

    function getDiagnostic(n) {
        let lms = API.path, // shortcut
            result = 'No LMS Connectivity';
        // default message
        if (lms) {
            switch (API.version) {
            case "1.2":
                result = lms.LMSGetDiagnostic(n.toString());
                break;
            case "2004":
                result = lms.GetDiagnostic(n.toString());
                break;
            default:
                // handle nonLMS?
                break;
            }
        }
        return String(result);
    }

    // End Private ////////////

    // Public SCORM Calls /////
    /**
   * Get Value (SCORM Call)
   * Gets the cmi object value requested
   * @param n {String} CMI Object Path as String
   * @returns {String}
   * @event 'getvalue'
   */
    this.getvalue = function(n) {
        let v = null, // success
            lms = API.path, // lms shortcut
            ec = 0, // error code
            m = '', // error message
            d = '', // error diagnostic
            nn = null, // new number
            ig = false;// ignore
        if (API.isActive) {// it has initialized
            // This is switch cased to appropriately translate SCORM 2004 to 1.2 if needed.
            // Handy if you don't want to go through all your content calls...
            // console.log("API Wrapper called with key " + n);
            switch (API.version) {
            case "1.2":
                switch(n) {
                case undefined:
                    ig = true;
                    break;
                case "cmi.comments_from_lms._count":
                case "cmi.comments_from_learner._count":
                    ig = true;
                    break;
                case "cmi.credit":
                    nn = "cmi.core.credit";
                    break;
                case "cmi.location":
                    nn = "cmi.core.lesson_location";
                    break;
                case "cmi.learner_name":
                    nn = "cmi.core.student_name";
                    break;
                case "cmi.learner_id":
                    nn = "cmi.core.student_id";
                    break;
                case "cmi.completion_threshold":
                    // unsupported
                    ig = true;
                    break;
                case "cmi.progress_measure":
                    ig = true;
                    break;
                case "cmi.entry":
                    nn = "cmi.core.entry";
                    break;
                case "cmi.mode":
                    nn = "cmi.core.lesson_mode";
                    break;
                case "cmi.exit":
                    nn = "cmi.core.exit";
                    break;
                case "cmi.score.raw":
                    nn = "cmi.core.score.raw";
                    break;
                case "cmi.score.min":
                    nn = "cmi.core.score.min";
                    break;
                case "cmi.score.max":
                    nn = "cmi.core.score.max";
                    break;
                case "cmi.scaled_passing_score":
                    nn = "cmi.student_data.mastery_score";
                    break;
                case "cmi.max_time_allowed":
                    nn = "cmi.student_data.max_time_allowed";
                    break;
                case "cmi.time_limit_action":
                    nn = "cmi.student_data.time_limit_action";
                    break;
                case "cmi.learner_preference._children":
                    nn = "cmi.core.student_preference._children";
                    break;
                case "cmi.learner_preference.audio_level":
                    nn = "cmi.core.student_preference.audio";
                    break;
                case "cmi.learner_preference.delivery_speed":
                    nn = "cmi.core.student_preference.speed";
                    break;
                case "cmi.learner_preference.language":
                    nn = "cmi.core.student_preference.language";
                    break;
                case "cmi.learner_preference.audio_captioning":
                    nn = "cmi.core.student_preference.text";
                    break;
                case (n.match(/cmi.learner_preference./) || {}).input:
                    nn = n.replace("cmi.learner_preference.", "cmi.core.student_preference.");
                    break;
                case "cmi.success_status":
                case "cmi.completion_status":
                    nn = "cmi.core.lesson_status";
                    break;
                case "cmi.session_time":
                    nn = "cmi.core.session_time";
                    break;
                case "cmi.suspend_data":
                    nn = n;
                    break;
                default:
                    nn = n;
                    break;
                }
                if(ig) {
                    return 'false';
                }

                // console.log("API Wrapper calles SCORM 1.2 with key " + nn);
                v = lms.LMSGetValue(nn);
                // console.log("SCORM 1.2 API responded with value " + v);
                break;
            case "2004":
                v = lms.GetValue(n);
                break;
            default:
                // handle non-LMS fail-over (will return 'false' below otherwise)?
                break;
            }
            ec = getLastErrorCode();
            m = getLastErrorMessage(ec);
            d = getDiagnostic(ec);
            // Clean up Error Codes that are non-critical (like date element not initialized)
            // Custom event Trigger getvalue
            triggerHandler("getvalue", {
                'n': n,
                'v': v,
                'error': {
                    'code': ec,
                    'message': m,
                    'diagnostic': d,
                },
            });
            if(ec === 0 || ec === 403) {
                // Clean up differences in LMS responses
                if (v === 'undefined' || v === null || v === 'null') { // was typeof v
                    v = "";
                } else {
                    // Adapt returned values from SCORM 1.2 to SCORM 2004
                    if(API.version === "1.2") {
                        switch(n) {
                        case "cmi.learner_preference._children":
                            var childrens = v.split(",");
                            for(let i = 0; i < childrens.length; i++) {
                                switch(childrens[i]) {
                                case "audio":
                                    childrens[i] = "audio_level";
                                    break;
                                case "speed":
                                    childrens[i] = "delivery_speed";
                                    break;
                                case "text":
                                    childrens[i] = "audio_captioning";
                                    break;
                                default:
                                    break;
                                }
                            }
                            v = childrens.join(",");
                            break;
                        case "cmi.learner_preference.audio_level":
                            // SCORM 1.2: cmi.learner_preference.audio, -1 to 100 (-1 is off, 0 is a no-change status, 1-100 is volume level)
                            // SCORM 2004: cmi.learner_preference.audio_level, >0 (0 is off, 0-1 attenuation, 1 no-change, >1 amplification).
                            v = parseInt(v);
                            if(v < 0) {
                                // Off
                                v = 0;
                            } else if(v === 0) {
                                // No change
                                v = 1;
                            } else {
                                // 1<v<100
                                v = (Math.min(100, v) - 1) / 49; // vSCORM1.2=1 => v=0, vSCORM1.2=50 => v=1, vSCORM1.2=100 => v will be aproximately 2
                            }
                            break;
                        case "cmi.learner_preference.delivery_speed":
                            // SCORM 1.2: cmi.student_preference.speed, -100 to 100 (-100 is the slowest pace available in the system, 0 is no-change status, 100 is maximum pace available in the system)
                            // SCORM 2004: cmi.learner_preference.delivery_speed, >0 (1 no-change, <1 slower than reference speed, >1 faster than reference speed).
                            v = parseInt(v);
                            v = (Math.max(Math.min(100, v), -100) / 100) + 1; // vSCORM1.2=-100 => v=0, vSCORM1.2=0 => v=1, vSCORM1.2=100 => v=2
                            break;
                        case "cmi.learner_preference.language":
                            // SCORM 1.2: cmi.student_preference.language, Format: Alphabetic string, may include white space. It is the responsibility of the SCO to set this value.
                            // SCORM 2004: cmi.learner_preference.language, Value Space: ISO-646.
                            // No action required.
                            break;
                        case "cmi.learner_preference.audio_captioning":
                            // SCORM 1.2: cmi.student_preference.text, (-1: text is off, 0: no-change status, 1: text is on)
                            // SCORM 2004: cmi.learner_preference.audio_captioning, (-1: off state, 0: no-change state, 1: on state)
                            // No action required.
                            break;
                        default:
                            break;
                        }
                    }
                }
                return String(v);
            }
            debug("Error\nError Code: " + ec + "\nError Message: " + m + "\nDiagnostic: " + d, 1);
            return 'false';
        }
        debug(n + " Get Aborted, connection not initialized! " + API.isActive, 2);
        return 'false';
    };

    /**
   * Set Value (SCORM Call)
   * Sets the cmi object value by name
   * @param n {String} CMI Object Path as String
   * @param v {String} Value
   * @returns {String}
   * @event 'setvalue'
   */
    this.setvalue = function(n, v) {
        let s = 'false', // success
            lms = API.path, // lms shortcut
            ec = 0, // error code
            m = '', // error message
            d = '', // error diagnostic
            nn = null, // new number
            ig = false; // ignore
        // Security Consideration?
        // It may be worth some minor security later to validate this is being set from a authorized source.  This is lacking support old versions of IE however.
        // debug("The caller of this method is " + arguments.callee.caller.caller.name, 4);  //arguments.callee.caller
        if (API.isActive) {// it has initialized
            // This is switch cased to appropriately translate SCORM 2004 to 1.2 if needed.
            // Handy if you don't want to go through all your content calls...
            switch (API.version) {
            case "1.2":
                API.mode = API.mode === "" ? lms.LMSGetValue('cmi.core.lesson_mode') : API.mode;
                if (API.mode === "normal") {
                    switch (n) {
                    case "cmi.location":
                        if (v.length > 255) {
                            debug("Warning, your bookmark is over the limit!!", 2);
                        }
                        nn = "cmi.core.lesson_location";
                        break;
                    case "cmi.progress_measure":
                        ig = true;
                        break;
                    case "cmi.mode":
                        nn = "cmi.core.lesson_mode";
                        break;
                    case "cmi.exit":
                        nn = "cmi.core.exit";
                        API.exit_type = v;
                        break;
                    case "cmi.score.raw":
                        nn = "cmi.core.score.raw";
                        break;
                    case "cmi.score.min":
                        nn = "cmi.core.score.min";
                        break;
                    case "cmi.score.max":
                        nn = "cmi.core.score.max";
                        break;
                    case "cmi.score.scaled":
                        ig = true;
                        break;
                    case "cmi.success_status":
                        if((API.data.completion_status == "completed") && (v != "passed")) {
                            // When cmi.core.lesson_status is "completed", only allow the LO to change it to "passed"
                            return 'false';
                        }
                    case "cmi.completion_status":
                        if((API.data.completion_status == "passed")) {
                            // When cmi.core.lesson_status is "passed", prevent the LO to change it to "complete"
                            return 'false';
                        }
                        nn = "cmi.core.lesson_status";
                        API.data.completion_status = v;
                        // set local status
                        break;
                    case "cmi.scaled_passing_score":
                        nn = "cmi.student_data.mastery_score";
                        break;
                    case "cmi.learner_preference.audio_level":
                        nn = "cmi.core.student_preference.audio";
                        break;
                    case "cmi.learner_preference.delivery_speed":
                        nn = "cmi.core.student_preference.speed";
                        break;
                    case "cmi.learner_preference.language":
                        nn = "cmi.core.student_preference.language";
                        break;
                    case "cmi.learner_preference.audio_captioning":
                        nn = "cmi.core.student_preference.text";
                        break;
                    case "cmi.session_time":
                        nn = "cmi.core.session_time";
                        break;
                        // Possibly need more here, review further later.
                    case "cmi.total_time":
                        nn = "cmi.core.total_time";
                        break;
                    case "cmi.suspend_data":
                        if (v.length > 4096) {
                            debug("Warning, your suspend data is over the limit!!", 2);
                        }
                        nn = n;
                        break;
                    default:
                        nn = n;
                        break;
                    }
                    if (ig) {
                        return 'false';
                    }
                    debug("SCORM 1.2 LMS SetValue with n: " + nn + " and v: " + v, 3);
                    s = lms.LMSSetValue(nn, v);
                } else {
                    debug("Warning, you are not in normal mode.  Ignoring 'set' requests.", 2);
                    return 'false';
                }
                break;
            case "2004":
                API.mode = API.mode === "" ? lms.GetValue('cmi.mode') : API.mode;
                if (API.mode === "normal") {
                    switch (n) {
                    case "cmi.location":
                        if (v.length > 1000) {
                            debug("Warning, your bookmark is over the limit!!", 2);
                        }
                        break;
                    case "cmi.completion_status":
                        API.data.completion_status = v; // set local status
                        break;
                    case "cmi.success_status":
                        API.data.success_status = v; // set local status
                        break;
                    case "cmi.exit":
                        API.data.exit_type = v; // set local status
                        break;
                    case "suspend_data":
                        if (v.length > 64000) {
                            debug("Warning, your suspend data is over the limit!!", 2);
                        }
                        break;
                    default:
                        // any other handling?
                        break;
                    }
                    debug("SCORM 2004 LMS SetValue with n: " + n + " and v: " + v, 3);
                    s = lms.SetValue(n, v);
                } else {
                    debug("Warning, you are not in normal mode.  Ignoring 'set' requests.", 2);
                    return 'false';
                }
                break;
            default:
                // handle non-LMS?
                break;
            }
            ec = getLastErrorCode();
            m = getLastErrorMessage(ec);
            d = getDiagnostic(ec);
            // Custom Event Trigger setvalue
            triggerHandler("setvalue", {
                'n': n,
                'v': v,
                'error': {
                    'code': ec,
                    'message': m,
                    'diagnostic': d,
                },
            });
            // Ensure Error Codes not critical
            if (ec === 0 || ec === 403) {
                return s;
            }
            debug("Error\nError Code: " + ec + "\nError Message: " + getLastErrorMessage(ec) + " for " + n + "\nDiagnostic: " + getDiagnostic(ec), 1);
            return s;
        }
        debug(n + " Set Aborted, connection not initialized! Locate where you called it after you Terminated.", 2);
        return 'false';
    };

    /**
   * Commit (SCORM Call)
   * Commits the Data to the Server via the LMS API.  SCORM Time done by default.
   * @returns {String} 'true' or 'false'
   */
    this.commit = function() {
        let s = 'false',
            lms = API.path,
            ec = 0,
            session_secs,
            saveDate = new Date();

        if(API.isActive) {
            // it has been initialized
            session_secs = (saveDate.getTime() - settings.startDate.getTime()) / 1000;
            debug("Committing data", 3);

            switch (API.version) {
            case "1.2":
                self.setvalue("cmi.core.session_time", centisecsToSCORM12Duration(session_secs * 100));
                s = lms.LMSCommit("");
                break;
            case "2004":
                self.setvalue("cmi.session_time", centisecsToISODuration(session_secs * 100, true));
                s = lms.Commit("");
                break;
            default:
                // handle non-LMS?
                break;
            }

            ec = getLastErrorCode();
            if (ec === 0) {
                return s;
            }
            debug("Error\nError Code: " + ec + "\nError Message: " + getLastErrorMessage(ec) + " for Commit.\nDiagnostic: " + getDiagnostic(ec), 1);
            return 'false';
        }

        debug("Commit Aborted, connection not initialized!", 2);
        return 'false';
    };

    /**
   * Initialize  (SCORM Call)
   * Initializes the SCO
   * @returns {String} 'true' or 'false'
   */
    this.initialize = function() {
        debug("Initialize Called. \n\tversion: " + settings.version, 3);
        let s = false, // success boo
            lms = API.path, // shortcut
            ec = 0;
        // error code
        if (!API.isActive) {
            if (lms) {
                switch (API.version) {
                case "1.2":
                    s = makeBoolean(lms.LMSInitialize(""));
                    break;
                case "2004":
                    s = makeBoolean(lms.Initialize(""));
                    break;
                default:
                    // handle local mode ?
                    break;
                }
                ec = getLastErrorCode();

                // Check for any errors previously
                if (s && ec === 0) {
                    API.isActive = true;
                    API.data.completion_status = self.getvalue('cmi.completion_status');
                    settings.startDate = new Date();
                    // self.setvalue('cmi.exit', settings.exit_type); // Consider setting exit type sooner by default?
                    // Need to set Start Date
                    debug("SCO is initialized.", 3);
                    switch (API.data.completion_status) {
                    case "not attempted":
                    case "unknown":
                        self.setvalue("cmi.completion_status", "incomplete");
                        break;
                    default:
                        if(API.data.completion_status === '') {
                            triggerException("LMS compatibility issue, Please notify a administrator.  Completion Status is empty.");
                        }
                        break;
                    }
                    return 'true';
                }
                debug("Error\nError Code: " + ec + "\nError Message: " + getLastErrorMessage(ec) + " for Initialize.\nDiagnostic: " + getDiagnostic(ec), 1);
            } else {
                debug("Aborted, LMS could not be located!.", 2);
            }
        } else {
            debug("Aborted, connection already initialized!.", 2);
        }
        return 'false';
    };

    /**
   * Terminate (SCORM Call)
   * Terminates the SCO
   * @returns {Boolean}
   */
    this.terminate = function() {
        let s = false, lms = API.path, ec = 0;
        debug("Terminating " + API.isActive + " " + lms, 4);
        if(API.isActive) {
            if(lms) {
                // if not completed or passed, suspend the content.
                debug("completion_status = " + API.data.completion_status + "|| success_status = " + API.data.success_status, 3);
                self.commit(); // Store Data before Terminating
                switch (API.version) {
                case "1.2":
                    s = lms.LMSFinish("");
                    break;
                case "2004":
                    s = lms.Terminate("");
                    break;
                default:
                    // handle non-LMS?
                    break;
                }
                if(makeBoolean(s)) {
                    debug("Terminated.", 3);
                    API.isActive = false;
                }else{
                    ec = getLastErrorCode();
                    debug("Error\nError Code: " + ec + "\nError Message: " + getLastErrorMessage(ec) + " for Commit.\nDiagnostic: " + getDiagnostic(ec), 1);
                }
            }else{
                debug("Lost connection to LMS", 2);
            }
        } else {
            debug("Terminate Aborted, connection not initialized!", 2);
        }
        return s;
    };

    // End SCORM Public Calls /////////////

    // Start Public Utility based Support for SCORM Calls
    /**
   * Get Objective By ID
   * This is fun, they make you go fish the objectives array integer by the ID.
   * Objectives do not appear to be 'journaled' as object identifiers have to be unique.
   * As this method is seeking information it may trigger SCORM Errors on the LMS that hint that
   * objects haven't been defined yet.  This is perfectly normal.
   * @param id {*} Alpha-Numeric Identification of the Interaction you're looking for
   * @returns {String} 'false' if nothing found or id
   */
    this.getObjectiveByID = function(id) {
        let count = self.getvalue("cmi.objectives._count"), // obtain total objectives
            i,
            tID;
        scorm.debug("Set Objective - Begin search, Objective count is " + count, 4);
        if (count === '' || count === 'false' || count === '-1') {
            return 'false';
        }
        count = parseInt(count, 10) - 1; // convert from string
        i = count;
        // for (i = count; i >= 0; i -= 1) {
        while (i >= 0) {
            tID = self.getvalue("cmi.objectives." + i + ".id");
            // scorm.debug("Objective ID Check for " + i + " : " + id + " vs " + tID, 4);
            if (id === tID) {
                scorm.debug("Objective ID Match on " + i, 4);
                return i;
            }
            i -= 1;
        }
        return 'false';
    };

    /**
   * Get Interaction By ID
   * This is fun, they make you go fish the interactions array integer by the ID.
   * I included this in the main SCORM API because this functionality should be stock.  You're
   * either going to journal these (history) or treat them like states that you update.  You must decide that.
   * @param id {*} Alpha-Numeric Identification of the Interaction you're looking for
   * @returns {String} 'false' if nothing found or id
   */
    this.getInteractionByID = function(id) {
        let count = self.getvalue("cmi.interactions._count"), // obtain total objectives
            i,
            tID;
        if (count === "" || count === 'false' || count === '-1') {
            return 'false';
        }
        count = parseInt(count, 10) - 1; // convert from string
        scorm.debug("Getting interactions from count " + count, 4);
        i = count;
        // for (i = count; i >= 0; i -= 1) {
        while (i >= 0) {
            tID = this.getvalue("cmi.interactions." + i + ".id");
            // scorm.debug("Interaction ID Check for " + i + " : " + tID + " vs " + id, 4);
            if (id === tID) {
                scorm.debug("Interaction By ID Returning " + i);
                return i;
            }
            i -= 1;
        }
        return 'false';
    };

    /**
   * Get interaction.n.objective By ID
   * You can have multiple objectives assigned to a interaction.
   */
    this.getInteractionObjectiveByID = function(n, id) {
        let count = self.getvalue("cmi.interactions." + n + ".objectives._count"), // obtain total objectives
            i,
            tID;
        if (count === "" || count === 'false') {
            return '0';
        }
        count = parseInt(count, 10) - 1; // convert from string
        scorm.debug("Getting interaction objectives from count " + count, 4);
        i = count;
        // for (i = count; i >= 0; i -= 1) {
        while (i >= 0) {
            tID = self.getvalue("cmi.interactions." + n + ".objectives." + i + ".id");
            // scorm.debug("Interaction Objective ID Check for " + i + " : " + tID + " vs " + id, 4);
            if (id === tID) {
                scorm.debug("Interaction Objective By ID Returning " + i);
                return i;
            }
            i -= 1;
        }
        return 'false';
    };

    /**
   * Get interaction.n.correct_responses By pattern
   * You can have multiple correct responses assigned to a interaction.
   */
    this.getInteractionCorrectResponsesByPattern = function(n, pattern) {
        let count = self.getvalue("cmi.interactions." + n + ".correct_responses._count"), // obtain total correct_responses
            i,
            p;
        if (count === "" || count === 'false') {
            scorm.debug("Correct Responses pattern was empty or false", 4);
            return '0'; // never created before so go with 0
        }
        count = parseInt(count, 10) - 1; // convert from string
        scorm.debug("Getting interaction correct responses from count " + count, 4);
        i = count;
        // for (i = count; i >= 0; i -= 1) {
        while (i >= 0) {
            p = self.getvalue("cmi.interactions." + n + ".correct_responses." + i + ".pattern");
            // score.debug("Interaction Correct Responses Pattern Check for " + i + " : " + p + " vs " + pattern, 4);
            if (pattern === p) {
                scorm.debug("Interaction Correct Responses By Pattern Returning " + i);
                return "match";
            }
            i -= 1;
        }
        return 'false';
    };

    // End SCORM Public Utilities

    // Internal API Public Calls //////////
    /**
   * Init (Internal API)
   * Initializes the SCORM API, and locates the LMS API
   * @returns {Boolean}
   */
    this.init = function() {
    // Search for LMS API
        let win;
        try {
            win = window.parent;
            if (win && win !== window) {
                findAPI(window.parent);
            }
        } catch (e) {/* Cross Domain issue */
            debug(e, 1);
        }
        if (!API.path) {
            try {
                win = window.top.opener;
                findAPI(win);
            } catch (ee) {/* Cross domain issue */
                debug(ee, 1);
            }
        }
        if (API.path) {
            API.connection = true;
            return true;
        }
        debug("I was unable to locate an API for communication", 1);
        return false;
    };

    /**
   * Get Last Error (Internal API)
   * Converts error integer to Message String
   * @param n {String} name
   * @returns value {String}
   */
    this.getLastError = function(n) {
        return error[n];
    };

    /**
   * Is LMS Connected
   * Will tell you if LMS is truly connected or not.  You may be running locally.
   * @return {Boolean}
   */
    this.isLMSConnected = function() {
        return API.connection;
    };

    /**
   * Set (Internal API)
   * This locally sets values local to this API
   * @param n {String} name
   * @param v (String,Number,Object,Array,Boolean} value
   */
    this.set = function(n, v) {
    // debug("set " + n, 3);
    // May need to maintain read-only perms here, case them out as needed.
        switch (n) {
        case "version":
        case "prefix":
            triggerWarning(405);
            return false;
            // break;
        case "isActive":
            API.isActive = v;
            settings[n] = v;
            break;
        case "startDate":
            settings[n] = new Date(v);
            // Need to set Start Date if forcing isActive!
            break;
        default:
            settings[n] = v;
            break;
        }
        return (isError !== 0);
    };

    /**
   * Get (Internal API)
   * This locally gets values local to this API
   * @param n {String} name
   * @returns {*} value or {Boolean} false
   */
    this.get = function(n) {
    // debug("get " + n, 3);
        if (settings[n] === undefined) {
            triggerWarning(404);
            return false;
        }
        return settings[n];
    };

    /**
   * Hook for External Plugins like Flash to set Time
   * Public to Private API's
   */
    this.centisecsToSCORM12Duration = centisecsToSCORM12Duration;
    this.centisecsToISODuration = centisecsToISODuration;
    this.ISODurationToCentisec = ISODurationToCentisec;
    this.isoDateToStringUTC = isoDateToStringUTC;
    this.isoDateToString = isoDateToString;
    this.isoStringToDate = isoStringToDate;
    this.makeBoolean = makeBoolean;
    this.debug = debug;
    this.settings = settings;
    this.API = API;
    // Self Initialize, note you could make this call outside, but later I decided to do it by default.
    this.init();
}
/* eslint-enable */
