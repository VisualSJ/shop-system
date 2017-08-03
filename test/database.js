'use strict';

const Chai = require('chai');

const MySQL = require('../database/mysql');

describe('Database', () => {

    describe('mysql', () => {

        it('sugar -> select', () => {
            Chai.expect(
                MySQL.sugar()
                    .select('*')
                    .from('User')
                    .where('a=a')
                    .toString()
            ).to.be.equal(
                `SELECT * FROM User WHERE a=a;`
            );

            Chai.expect(
                MySQL.sugar()
                    .select('*')
                    .from('User')
                    .where('a=a')
                    .where('b=b')
                    .toString()
            ).to.be.equal(
                `SELECT * FROM User WHERE a=a AND b=b;`
            );
        });

        it('sugar -> create', () => {
            Chai.expect(
                MySQL.sugar()
                    .create('User')
                    .add('a INT(11)')
                    .toString()
            ).to.be.equal(
                `CREATE TABLE User ( a INT(11) );`
            );
        });

    });

});