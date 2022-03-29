import Wock from './lib/Wock.js';


class StaffWock {
	wock;

	app;
	id;

	who;
	token;

	interval;
	staff;
	timer;


	constructor(target, app, id, who, token, interval, staff, logInfo, logError) {
		if(!~~interval || ~~interval < 1000) { throw Error('间隔无效或小于一秒'); }


		this.app = app;
		this.id = id;

		this.who = who;
		this.token = token;

		this.interval = interval;
		this.staff = staff;


		const wock = this.wock = new Wock(
			new URL('wock', `http://${target.host}:${target.port}`).toString().replace(/^http/, 'ws'),
			logInfo, logError
		);


		wock.add('start', () => {
			clearInterval(this.timer);

			this.timer = setInterval(this.runner.bind(this), this.interval);

			this.runner();
		});

		wock.add('stop', () => clearInterval(this.timer));

		wock.add('setToken', token => {
			this.token = token;

			this.auth();
		});


		wock.reopen = this.auth.bind(this);
		wock.at('open', this.auth.bind(this), true);
	}

	auth() {
		if(this.token) {
			this.wock.cast('hey/auth-staff', this.app, this.id, this.who, this.token);
		}
	}

	runner() {
		const push = this.staff(this);

		if(push) {
			this.hey(push);
		}
	}

	hey(push) { return this.wock.cast('hey/push', push); }

	add(...params) { return this.wock.add(...params); }
	open(reason) { return this.wock.open(reason); }
}


export default StaffWock;
