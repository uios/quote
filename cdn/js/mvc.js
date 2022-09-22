window.mvc ? null : (window.mvc = {});

window.mvc.m ? null : (window.mvc.m = model = {
    error: {
        image: e=>{
            console.log('model.error.image', e);
            e.remove();
        }
    },
    time: {
        date: (timestamp)=>{
            const rtf = new Intl.RelativeTimeFormat('en',{
                numeric: 'always',
            });
            const oneDayInMs = 1000 * 60 * 60 * 24;
            const daysDifference = Math.round((timestamp - new Date().getTime()) / oneDayInMs, );

            const formatted = isNaN(daysDifference) ? "" : rtf.format(daysDifference, 'day');
            return formatted;
        }
        ,
        line: ()=>{
            return new Promise(async(resolve,reject)=>{
                var feed = byId('feed-index-posts');
                var lastFeedId = feed.innerHTML === "" ? 0 : parseInt(feed.firstElementChild.dataset.id);
                var endpoint = is.local(window.location.href) ? window.location.protocol + "//api.uios." + window.globals.domains.tld : api.endpoint;
                const f = async(d)=>{
                    var data = JSON.parse(d);
                    var posts = data.posts;
                    if (posts && posts.length > 0) {
                        var lastPostId = parseInt(posts[posts.length - 1].id);

                        if ((lastPostId > lastFeedId) && posts.length > 0) {
                            //feed.innerHTML = "";
                            var template = await ajax('/cdn/html/template/template.feed.quotes.html');
                            var html = new DOMParser().parseFromString(template, "text/html").body;
                            var pp = 0;
                            do {
                                const post = posts[pp];
                                const fullname = post.fullname;
                                const id = post.id;
                                const quote = post.quote;
                                const uid = post.uid;
                                const user = post.user;
                                const username = post.username;

                                var card = html.firstElementChild.cloneNode(true);
                                card.dataset.id = post.id;
                                card.dataset.uid = uid;
                                card.all('box')[0].dataset.href = "/users/"+user+"/";
                                card.all('box')[1].all('text')[0].find('b').textContent = fullname;
                                card.all('box')[1].all('text')[0].find('span').textContent = username;
                                card.all('box')[1].all('text')[1].textContent = quote;
                                
                                feed.insertAdjacentHTML('afterbegin', card.outerHTML);
                                pp++;
                            } while (pp < posts.length);
                            
                            lazyLoad(feed.all('[data-src]'))
                        }
                    }

                    resolve(route);
                }
                const c = (e)=>{
                    console.log('mvc.v users user /photo/users/:user catch', {
                        e
                    });
                    //model.error.code(e, v);
                }
                var jwt = auth.user() ? await auth.getIdToken() : null;
                const obj = {};
                jwt ? obj.jwt = jwt : null;
                lastFeedId > 0 ? obj.last = lastFeedId : null;
                const params = new URLSearchParams(obj);
                endpoint += '/write/posts';
                if (obj.last) {
                    endpoint += '?' + params.toString();
                }
                ajax(endpoint).then(f).catch(c);
            }
            );
        }
    }
});

window.mvc.v ? null : (window.mvc.v = view = function(route) {
    console.log(108, {
        route
    });

    return new Promise(async function(resolve, reject) {
        var page = route.page;
        var path = route.path;
        var gut = route.hash ? rout.ed.dir(route.hash.split('#')[1]) : [];
        var get = (route ? route.GOT : rout.ed.dir(dom.body.dataset.path)).concat(gut);
        var root = get[0] || gut[0];

        window.GET = window.GET ? GET : rout.ed.dir(dom.body.dataset.path);

        if (root) {

            if (root === "explore") {
                resolve(route);
            } else if (root === "post") {
                var vp = dom.body.find('[data-page="/"]');
                vp.innerHTML === "" && vp.dataset.fetch ? vp.innerHTML = await ajax(vp.dataset.fetch) : null;
                vp.dataset.active = "true";

                const user = auth.user();

                if (user) {
                    const uid = user.uid;
                    vp = dom.body.find('[data-page="/post/quote/"]');
                    var img = document.createElement('img');
                    img.src = cdn.endpoint + '/' + uid + '/avi.jpg';
                    img.setAttribute("onerror", 'this.remove()');
                    const avi = vp.find('picture'); console.log({avi});
                    avi.innerHTML = img.outerHTML;
                    avi.dataset.href = avi.nextElementSibling.dataset.href = "/users/" + uid + "/";
                }

                resolve(route);
            } 
            else if(root === "users") {
                if(get.length > 1) {
                    resolve(route);                    
                }
            } else {
                resolve(route);
            }

        } else {
            mvc.m.time.line();
            resolve(route);
        }
    }
    );
}
);

window.mvc.c ? null : (window.mvc.c = controller = {
    menu: {
        close: ()=>{
            byId('main-menu').dataset.transform = "translateX(-100%)";
        }
        ,
        open: ()=>{
            byId('main-menu').removeAttribute('data-transform');
        }
    },
    my: {
        login: (event,f)=>{
            event.preventDefault();
            auth.account.login(event).then(e=>(f ? f : '/').router()).catch(e=>{
                var code = e.code;
                var message = e.message;
                alert(message);
            }
            );
        }
    },
    post: {
        quote: async(event)=>{
            event.preventDefault();
            const user = auth.user();
            if (user) {
                const form = event.target;
                const submit = form.find('[type="submit"]');
                const textarea = form.find('textarea');
                const quote = textarea.value;
                submit.disabled = true;
                if (quote.length > 0) {
                    const a = (event)=>{
                        console.log('controller.post.quote data', event);
                        submit.removeAttribute("disabled");
                        textarea.value = "";
                        "/".router();
                    }
                    const b = (event)=>{
                        console.log('controller.post.quote error', event);
                        submit.removeAttribute("disabled");
                    }
                    var data = new FormData();
                    const jwt = await auth.getIdToken();
                    data.append("jwt", jwt);
                    data.append("quote", quote);
                    ajax(api.endpoint + '/write/posts', {
                        data,
                        dataType: "POST"
                    }).then(a).catch(b);
                } else {
                    alert("Your post is empty.");
                    submit.removeAttribute("disabled");
                }
            }
        }
    },
    system: {
        theme: type=>{
            window.tS = event=>{
                if (event.matches) {
                    document.body.dataset.theme = "dark";
                } else {
                    document.body.removeAttribute('data-theme');
                }
            }
            if (type === "system") {
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.body.dataset.theme = "dark";
                } else {
                    document.body.removeAttribute('data-theme');
                }
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', tS);
            } else {
                window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', tS);
            }

            if (type === "auto") {
                controller.system.time();
            } else {
                if (window.timer) {
                    clearTimeout(window.timer);
                    window.timer = 0;
                }
            }

            if (type === "light") {
                document.body.removeAttribute('data-theme');
            }

            if (type === "dark") {
                document.body.dataset.theme = "dark";
            }
        }
    }
});
