/**
 * Created by alexthomas on 4/5/16.
 */
module.exports = {
    web: {
        entryPointFile: 'index.html',
        publicPath: '/public',
        port: process.env.port || 8080
    },
    datastore: {
        path: ''
    },
    session: {
        secret: 'I know what you did last summer',
        cookie: {
            maxAge: 60000,
            expires: false
        }
    }
};