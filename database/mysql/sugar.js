'use strict';

class Select {

    constructor (select) {
        this._select = select;
        this._from = '';
        this._where = [];
    }

    from (table) {
        this._from = table;
        return this;
    }

    where (rule) {
        this._where.push(rule);
        return this;
    }

    toString () {
        var command = `SELECT ${this._select} FROM ${this._from}`;
        if (this._where.length > 0) {
            command += ` WHERE`;
            this._where.forEach((where, index) => {
                if (index !== 0) {
                    command += ` AND`;
                }
                command += ` ${where}`;
            });
        }
        return command;
    }

}

class Create {

    constructor (table) {
        this._table = table;
        this._rows = [];
    }

    add (row) {
        this._rows.push(row);
        return this;
    }

    toString () {
        var command = `CREATE TABLE ${this._table} (`;
        this._rows.forEach((row, index) => {
            if (index !== 0) {
                command += ',';
            }
            command += ` ${row}`;
        });
        command += ' )';
        return command;
    }

}

class Insert {

    constructor () {}

}

class Update {

    constructor () {}

}

class Sugar {

    select (select) {
        return new Select(select);
    }

    create (table) {
        return new Create(table);
    }

    insert () {
        return new Insert();
    }

    update () { 
        return new Update();
    }

}

module.exports = Sugar;