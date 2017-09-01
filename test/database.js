'use strict';

const chai = require('chai');

const database = require('../database');
const mysql = require('../database/mysql');

const user = require('../lib/user');

describe('Database', () => {

    it('connect', (done) => {
        database.start()
            .then(done)
            .catch(done);
    });

    describe('mysql.sugar', () => {

        it('select', () => {
            chai.expect(
                mysql.sugar()
                    .select('*')
                    .from('User')
                    .where('a=a')
                    .where('b=b')
                    .toString()
            ).to.be.equal(
                'SELECT * FROM `User` WHERE a=a AND b=b;'
            );

            chai.expect(
                mysql.sugar()
                    .select('*')
                    .from('User')
                    .where('a=a')
                    .where('b=b')
                    .toString()
            ).to.be.equal(
                'SELECT * FROM `User` WHERE a=a AND b=b;'
            );
        });

        it('create', () => {
            chai.expect(
                mysql.sugar()
                    .create('User')
                    .add('a', 'INT(11)')
                    .add('b', 'INT(11)')
                    .toString()
            ).to.be.equal(
                'CREATE TABLE `User` (a INT(11), b INT(11));'
            );
        });

        it('insert', () => {
            chai.expect(
                mysql.sugar()
                    .insert('User')
                    .add('col1' ,'15')
                    .add('col2', 'col1*2')
                    .toString()
            ).to.be.equal(
                'INSERT INTO `User` (col1, col2) VALUES (15, col1*2);'
            );
        });

        it('delete', () => {
            chai.expect(
                mysql.sugar()
                    .delete('User')
                    .where('id=1')
                    .where('name=a')
                    .toString()
            ).to.be.equal(
                'DELETE FROM `User` WHERE id=1 AND name=a;'
            )
        });

        it('update', () => {
            chai.expect(
                mysql.sugar()
                    .update('User')
                    .set('a', 'a')
                    .set('b', 'b')
                    .where('a=1')
                    .where('b=2')
                    .toString()
            ).to.be.equal(
                'UPDATE `User` SET a=a, b=b WHERE a=1 AND b=2;'
            );
        });
    });

    describe('user', () => {
        var data = {};
        
        it('check name', (done) => {
            user.insert(data).then(done).catch((error) => {
                if (error === 510) {
                    done();
                }
            });
            data.name = '1233'
            user.insert(data).then(done).catch((error) => {
                if (error === 510) {
                    done();
                }
            });
            data.name = 'abcd('
            user.insert(data).then(done).catch((error) => {
                if (error === 510) {
                    done();
                }
            });
        });
    });

});