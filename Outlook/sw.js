const staticCacheName = "site-static-v1";      //name of cache, CHANGE EVERY TIME//
const assets = [
    "/",
    "outlook.html",
    "app.js",
    "manifest.json",
    "sw.js",
    "https://code.jquery.com/jquery-3.2.1.slim.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js",
    "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/js/bootstrap.min.js",
    "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css",
    "img/top1.png",
    // "pages/fallback.html"
];
const dynamicCache = "site-dynamic-v1";

self.addEventListener("install", evt=>{
    console.log("service worker is installed");
    evt.waitUntil(
        caches.open(staticCacheName).then(cache => {
            console.log("caching app shell");
            cache.addAll(assets);              //這事實上一系列的request)
        })
    );   
    // self.skipWaitidfsdfng();////
});

self.addEventListener("activate", evt => {
    console.log("sevice worker is activated");
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key!==staticCacheName && key!==dynamicCache)
                .map(key => caches.delete(key))
            )
        })                  //刪除舊的cache//
    )
});

self.addEventListener("fetch", evt => {
    // console.log("service worker gotvddcdbsffd fetched", evt);
    evt.respondWith(                    //service worker中途攔截
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request).then(fetchRes=>{
                return caches.open(dynamicCache).then(cache=>{
                    cache.put(evt.request.url, fetchRes.clone());       //key and value
                    return fetchRes;
                })
            }).catch(err => caches.match("pages/fallback.html").then(fallback => {return fallback}))
        })
    )
});
