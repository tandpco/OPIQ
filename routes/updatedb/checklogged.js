	var keystone = require('keystone'),
		_ = require('underscore');

exports = module.exports = function(req, res) {
	var ip = req.connection.remoteAddress;


	if(req.user){
		res.send('user');
		return;
	}



	if(!keystone.get(ip + 'checkedlog'))keystone.set(ip + 'checkedlog' , 0);


	if(!keystone.get(req.body.page)){

		keystone.set(req.body.page, true);
		keystone.set(ip + 'checkedlog', keystone.get(ip + 'checkedlog') + 1);		
	}
	
	




	
	if(keystone.get(ip + 'checkedlog') >= 4)
		res.send('max');
	else res.send('not_logged');
}