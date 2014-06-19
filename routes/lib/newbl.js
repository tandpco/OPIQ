var keystone = require('keystone');

exports = module.exports = function(req, res) {
	var has, ip = req.headers['x-forwarded-for'], bl;
	if(!keystone.get(ip + 'backlog'))
		keystone.set(ip + 'backlog', []);


	bl = keystone.get(ip + 'backlog');



	for(var i = 0; i < bl.length; i++){
		if(bl[i].page === req.body.page){
			has = true;
			bl[i] = req.body;
		}
	}
	if(!has)
		bl.push(req.body);


	res.send('complete');

}