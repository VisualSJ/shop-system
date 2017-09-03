'use strict';

const chai = require('chai');
const database = require('../../database');
const user = require('../../lib/user');
const check = user._check;

describe('lib.user', () => {

    it('connect', (done) => {
        database.start()
            .then(done)
            .catch(done);
    });

    it('The length must be greater than or equal to 2', () => {
        chai.expect(check.name('a')).to.equal(false);
        chai.expect(check.name('aa')).to.equal(true);
    });
    it('The length must be less than or equal to 10', () => {
        chai.expect(check.name('aaaaaaaaaaa')).to.equal(false);
        chai.expect(check.name('aaaaaaaaaa')).to.equal(true);
    });
    it('Use only the beginning of the English letter', () => {
        chai.expect(check.name('0as')).to.equal(false);
        chai.expect(check.name('_as')).to.equal(false);
        chai.expect(check.name('aaa')).to.equal(true);
        chai.expect(check.name('Aaa')).to.equal(true);
    });
    it('Can only contain English letters and underline', () => {
        chai.expect(check.name('aa~')).to.equal(false);
        chai.expect(check.name('aa!')).to.equal(false);
        chai.expect(check.name('aa#')).to.equal(false);
        chai.expect(check.name('aa$')).to.equal(false);
        chai.expect(check.name('aa%')).to.equal(false);
        chai.expect(check.name('aa^')).to.equal(false);
        chai.expect(check.name('aa&')).to.equal(false);
        chai.expect(check.name('aa*')).to.equal(false);
        chai.expect(check.name('aa(')).to.equal(false);
        chai.expect(check.name('aa)')).to.equal(false);
        chai.expect(check.name('aa_')).to.equal(true);
        chai.expect(check.name('aa+')).to.equal(false);
        chai.expect(check.name('aa=')).to.equal(false);
    });

    it('Insert the user', (done) => {
        user.insert({
            name: 'test',
            password: 'testtest',
            email: 'a@b.com',
            phone: 13850057505,
            sex: 0,
        }).then(() => {
            done();
        }).catch((error) => {
            console.log(error);
            done(error);
        });
    });

    it('Query the information just inserted - name', (done) => {
        user.count({ name: 'test' }).then((count) => {
            if (count != 0) {
                done();
            } else {
                done('The matching error');
            }
        }).catch((error) => {
            console.log(error);
            done(error);
        });
    });

    it('Query the information just inserted - email', (done) => {
        user.count({ email: 'a@b.com' }).then((count) => {
            if (count != 0) {
                done();
            } else {
                done('The matching error');
            }
        }).catch((error) => {
            console.log(error);
            done(error);
        });
    });

    it('Query the information just inserted - phone', (done) => {
        user.count({ phone: '13850057505' }).then((count) => {
            if (count != 0) {
                done();
            } else {
                done('The matching error');
            }
        }).catch((error) => {
            done(error);
        });
    });

    it('Query the user', (done) => {
        user.query({
            name: 'test'
        }).then(() => {
            done();
        }).catch((error) => {
            done(error);
        });
    });

    it('Update the user', () => {
        user.update(1, {
            name: 'test2',
        }).then(() => {
            user.query({
                name: 'test'
            }).then((user) => {
                if (user.name !== 'test') {
                    done('Update error');
                } else {
                    done();
                }
            }).catch((error) => {
                done(error);
            });
        }).catch((error) => {
            done(error);
        });
    });
});