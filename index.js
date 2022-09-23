window.api = {
    endpoint: "https://api.uios.computer"
};

window.auth ? null : window.auth = {};
auth.config = {
    apiKey: "AIzaSyBxGXe52WtXo_B5iKBo9BQZSfAwYFhLRO8",
    authDomain: "uios-83649.firebaseapp.com",
    projectId: "uios-83649",
    messagingSenderId: "47824486713",
    appId: "1:47824486713:web:51f3a124b42b1080"
};

window.cdn = {
    endpoint: "https://cdn.uios.computer/file/write-uios"
};

window.onload = ()=>{
    api.endpoint = is.local(window.location.href) ? window.location.protocol + "//api.uios.tld" : api.endpoint;

    window.dom = {
        body: document.body,
        boot: document.getElementById("boot")
    };

    dom.body.dataset.load = "ing";

    init();
}

function init() {
    console.log("Initializing...");

    window.rout.ing = function(href, GOT, n, m=GOT[n], root=GOT[0]) {
        return m.includes("#") || (root === 'users' && n === 1);
    }

    touch.events = {
        dbltap: on.touch.dbltap,
        drag: on.touch.drag,
        press: on.touch.press,
        tap: on.touch.tap
    };
    touch.ing = false;

    dom.body.dataset.theme = "meridiem";
    dom.body.addEventListener("click", function(e) {
        if (window.touch.ing === false) {
            on.touch.tap(e);
            //console.log(e.type,window.touch.ing);
        } else {
            window.touch.ing = false;
            //console.log(e.type,window.touch.ing);
        }
    });
    dom.body.addEventListener("touchstart", function(e) {
        window.touch.ing = true;
        touch.handler(event);
        //console.log(e.type);
    }, {
        passive: true
    });
    dom.body.addEventListener("touchmove", touch.handler, {
        passive: true
    });
    dom.body.addEventListener("touchcancel", touch.handler, false);
    dom.body.addEventListener("touchend", function(e) {
        //window.touch.ing = false;
        touch.handler(event);
        //console.log(e.type);
    });

    var url = window.location.pathname;
    if (window.globals.domains.subdomain === "uios") {
        var dir = rout.ed.dir(window.location.pathname);
        dir.splice(0, 1)
        var url = rout.ed.url(dir);
    }

    var uri = ((dom.boot.dataset.path ? dom.boot.dataset.path : url) + (window.location.search + window.location.hash));

    var go = false;
    const authChange = function(e) {
        const load = function(e) {
            dom.body.dataset.load = "ed";
        };
        dom.body.dataset.load = "ed";
    };
    if (window.firebase) {
        firebase.initializeApp(auth.config);
        const onAuthStateChanged = async function(user) {
            if (user) {
                const a = function(d) {
                    const data = JSON.parse(d);
                    const settings = data.settings;
                    if (settings) {
                        const json = settings.json;
                        const theme = json.theme;
                        controller.system.theme(theme);
                    }
                    auth.change(user).then(authChange);
                    go ? null : uri.router().then(function() {
                        go = true;
                        authChange();
                    });
                }
                const jwt = await auth.getIdToken();
                var endpoint = is.local(window.location.href) ? window.location.protocol + "//api.uios.tld" : api.endpoint;
                ajax(endpoint + "/write/account?jwt=" + jwt).then(a);
            } else {
                go ? null : uri.router().then(function() {
                    go = true;
                    authChange();
                });
            }
        }
        firebase.auth().onAuthStateChanged(onAuthStateChanged);
    } else {
        uri.router().then(authChange);
    }

    console.log("Initialized");
}
