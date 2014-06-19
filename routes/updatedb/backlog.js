var keystone = require('keystone');

exports = module.exports = function(req, res) {
	var has, ip = req.connection.remoteAddress;
	if(!keystone.get(ip + 'backlog'))
		keystone.set(ip + 'backlog', []);


	for(var i = 0; i < keystone.get(ip +'backlog').length; i++)
		if(keystone.get(ip + 'backlog')[i].page === req.body.page){
			has = true;
			keystone.get(ip + 'backlog')[i] = req.body;
		}
	if(!has)
		keystone.get(ip + 'backlog').push(req.body);


}