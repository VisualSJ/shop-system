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
                    .where('b=b')
                    .toString()
            ).to.be.equal(
                `SELECT * FROM User WHERE a=a AND b=b;`
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
                    .add('a', 'INT(11)')
                    .add('b', 'INT(11)')
                    .toString()
            ).to.be.equal(
                `CREATE TABLE User (a INT(11), b INT(11));`
            );
        });

        it('sugar -> insert', () => {
            Chai.expect(
                MySQL.sugar()
                    .insert('User')
                    .add('col1' ,'15')
                    .add('col2', 'col1*2')
                    .toString()
            ).to.be.equal(
                `INSERT INTO User (col1, col2) VALUES (15, col1*2);`
            );
        });

        it('sugar -> delete', () => {
            Chai.expect(
                MySQL.sugar()
                    .delete('User')
                    .where('id=1')
                    .where('name=a')
                    .toString()
            ).to.be.equal(
                `DELETE FROM User WHERE id=1 AND name=a;`
            )
        });

        it('sugar -> update', () => {
            Chai.expect(
                MySQL.sugar()
                    .update('User')
                    .set('a', 'a')
                    .set('b', 'b')
                    .where('a=1')
                    .where('b=2')
                    .toString()
            ).to.be.equal(
                `UPDATE User SET a=a, b=b WHERE a=1 AND b=2;`
            );
        });
    });

});