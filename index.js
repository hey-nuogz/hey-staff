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


		wock.add('staff-start', () => {
			clearInterval(this.timer);

			this.timer = setInterval(() => this.staff(this.hey.bind(this), this), this.interval);

			this.staff(this.hey.bind(this), this);
		});

		wock.add('staff-stop', () => clearInterval(this.timer));

		wock.add('setToken', token => {
			this.token = token;

			this.auth();
		});

		wock.reopen = true;
		wock.at('open', this.auth.bind(this));
	}

	auth() {
		if(this.token) {
			this.wock.cast('hey/auth-staff', this.app, this.id, this.who, this.token);
		}
	}


	hey(push) { return this.wock.cast('hey/push', push); }

	add(...params) { return this.wock.add(...params); }
	open(reason) { return this.wock.open(reason); }
}


export default StaffWock;
