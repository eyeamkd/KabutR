var Service = require('node-windows').Service;
 
// Create a new service object
var svc = new Service({
  name:'KabutR',
  description: 'Automatic Mail Delivery System',
  script: 'C:\\Users\\kunal.d\\Desktop\\Projects\\KabutR\\index.js',
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ]
});
 
// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});
 
svc.install();