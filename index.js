require('dotenv').config();

const ldap = require('ldapjs');
var ssha = require('node-ssha256');
const { Client } = require('pg')
const pgclient = new Client()
const generator = require('generate-password');
let LDAPClient = ldap.createClient({
    url: 'ldap://10.244.138.150'
})
LDAPClient.bind("cn=admin, dc=utdmaker, dc=space", `stavMaker18`, (err) => {
    if (err) {
        console.warn(err);
        return;
    }
    pgclient.connect()
    pgclient.query('SELECT * from fixed_members', (err, res) => {
        //console.log(err ? err.stack : res.rows[0]) // Hello World!
        if (err) {
            return 0;
        }
        res.rows.forEach(({ firstname, lastname, netid, email }, index) => {
            const password = generator.generate({
                length: 10,
                numbers: true
            });
            if (firstname !== null && lastname !== null && netid !== null && email !== null && firstname == "Cameron") {
                console.log(`Hey ${firstname}, This message is letting you know that you have been succesfully onboarded as a UTDesign Makerspace Member. Here are your login credentials:\nusername: ${netid}\npassword: ${password}`)
                const LDAPPerson = {
                    displayName: `${firstname} ${lastname}`,
                    sn: lastname,
                    cn: netid,
                    givenName: firstname,
                    homeDirectory: `/home/${netid}`,
                    objectClass: [
                        "inetOrgPerson",
                        "posixAccount",
                        "top"
                    ],
                    userPassword: `{SHA}cojt0Pw//L6ToM8G41aOKFIWh7w=`,
                    uid: netid,
                    uidNumber: 10002 + index,
                    gidNumber: 34657

                }
                LDAPClient.add(`uid=${netid}, dc=utdmaker, dc=space`, LDAPPerson , (err) => {
                    console.log(LDAPPerson)
                    console.log(err)
                })
            }
        })
        pgclient.end()
    })

});
