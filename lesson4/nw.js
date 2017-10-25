var Service = require('node-windows').Service;
 
// Create a new service object 
var svc = new Service({
  name:'Hello World',
  description: 'The nodejs.org example web server.',
  script: 'D:\workspace\LiveWeb\lesson4\server.js'
});
 
// Listen for the "install" event, which indicates the 
// process is available as a service. 
svc.on('install',function(){
  svc.start();
});
 
svc.install();