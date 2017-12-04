var Service = require('node-windows').Service;
 
// Create a new service object 
var svc = new Service({
  name:'NiuGame',
  description: 'The nodejs.org example web serversss.',
  script: 'D:/workspace/LiveWeb/lesson4/zhihu.js'
});
 
// Listen for the "install" event, which indicates the 
// process is available as a service. 
svc.on('install',function(){
  svc.start();
});
 
svc.install();