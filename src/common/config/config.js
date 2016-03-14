module.exports = {
    api: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost:3000'
    },
    db: {
        uri: process.env.MONGODB_ADDON_URI || process.env.MONGOLAB_URI || 'mongodb://127.0.0.1:27017/iadvize'
    }
};