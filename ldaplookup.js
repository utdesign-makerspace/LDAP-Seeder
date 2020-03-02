const ldap = require('ldapjs');

let LDAPClient = ldap.createClient({
    url: 'ldap://10.244.138.150'
})

LDAPClient.bind("cn=admin, dc=utdmaker, dc=space", `password`, (err) => {
    LDAPClient.search("dc=utdmaker, dc=space", {
        filter: '(cn=*)',
        scope: 'sub'
      }, (err1, res) => {
        res.on('searchEntry', function(entry) {
            console.log('entry: ' + JSON.stringify(entry.object, null, 2));
          });
          res.on('searchReference', function(referral) {
            console.log('referral: ' + referral.uris.join());
          });
          res.on('error', function(err) {
            console.error('error: ' + err.message);
          });
          res.on('end', function(result) {
            console.log('status: ' + result.status);
          });
      })
})
