var webPush = require('web-push');
const vapidKeys = {
    "publicKey": "BD2mP9KmSwc9oSLR8B0lC7VVT4n_QKsaL_F6AgARctIUzPR0uiWEbY2fCVu-DCa4FwRXSOAs5XeswwSaz7rNj_Q", 
    "privateKey": "9lWp2zf5O8UKZnCcAb7_bhZy32Fy6ZuQ5JDCoEV4uYs"
};

webPush.setVapidDetails(
    'mailto:anonimgama2@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

var pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/dT4S_S7jbXA:APA91bF74TV8EI9zXUW-DZVuMoK6phuknF_wonqb6BaeW7n7brJwHMf-mohlJR0erhYsODu99JPTyYeIyY435jdvqGLljViJfvSmgJ1eGirLSxfE979syergcgXwFjLKX60szsLVCviE",
    "keys": {
        "p256dh": "BAbJ4hhou7/HGUq/SoDALNMwLRTJjXdSaGgJ8woxLBIXCVYE7gNXio9OLC0rU3ul76YmtCRymzZzDHVGsPU1dg8=", 
        "auth": "0RFKrtHm8ePvHRnesw6pIg=="
    }
};

var payload = 'Selamat! Aplikasi ini sudah dapat menerima push notifikasi!';
var options = {
    gcmAPIKey: '252690868828',
    TTL: 60
};

webPush.sendNotification(
    pushSubscription,
    payload,
    options
);