const sgMail = require('@sendgrid/mail')
sgMail.setApiKey('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')

const sendWeclomeMail = async (email, name) => {
   await  sgMail.send({
        to: email,
        from: 'arpited7@gmail.com',
        subject: 'welcome you fucking loser',
        text: `fuck yourself, ${name}. hope you have a terrible time.`
    })
}

sendByeByeMail =async  (email, name) => {
    await sgMail.send({
        to: email,
        from: 'arpited7@gmail.com',
        subject: 'bye bye you fucking cunt. no ones gonna miss you.',
        text: `hey, ${name}, we are glad you are fucking off. asshole.`,
        html: '<h1 style="color:red"> fucking cunt!!!!! </h1>'
    })
}

module.exports = {
    sendWeclomeMail, sendByeByeMail
}