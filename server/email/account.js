import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.EMAIL_ID,
        subject: 'Welcome to Chat One!',
        text: `Welcome ${name}! Thanks for joining Chat One. Let me know how you get along with the app.`
    });
    console.log('Welcome email sent');
}

const sendAccountClosingEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.EMAIL_ID,
        subject: 'Sorry to see you go!',
        text: `Goodbye ${name}! I hope to see you back sometime soon.`
    });
    console.log('Account closing email sent');
}

const sendVerificationEmail = (email, url) => {
    sgMail.send({
        to: email,
        from: process.env.EMAIL_ID,
        subject: 'Email verifcation',
        html: `Hi! Please click on the following link to continue <a href = "${url}">${url}</a>`
    });
    console.log('Verification email sent');
}

const sendProfileUpdateEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.EMAIL_ID,
        subject: 'Profile updated!',
        html: `Hello ${name}! Your profile has been updated successfully!`
    });
    console.log('Profile update email sent');
}

module.exports = {
    sendWelcomeEmail,
    sendAccountClosingEmail,
    sendVerificationEmail,
    sendProfileUpdateEmail
}