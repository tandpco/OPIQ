var keystone = require('keystone');

exports = module.exports = function(req, res) {
	var has, ip = req.connection.remoteAddress, bl;
	if(!keystone.get(ip + 'backlog'))
		keystone.set(ip + 'backlog', []);


	bl = keystone.get(ip + 'backlog');


	console.log('backlog', bl);
	console.log('req.body', req.body);

	for(var i = 0; i < bl.length; i++){
		console.log(bl[i]);
		if(bl[i].page === req.body.page){
			has = true;
			bl[i] = req.body;
		}
	}
	if(!has)
		bl.push(req.body);


	console.log('backlog after push', bl);

}