

/**
 * 邮件发送配置
 */

module.exports = {
    //smtp邮件发送配置，示例配置
    SMTP:{
        host: "smtp.ym.163.com", // hostname
        secureConnection: false, // use SSL
        port: 25, // port for secure SMTP
        auth: {
            user: "talk@jojoin.com",
            pass: ""
        }
    }
};