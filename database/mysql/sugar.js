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
        var where = '';
        if (this._where.length > 0) {
            where = ` WHERE ${this._where.join(' AND ')}`;
        }
        return `SELECT ${this._select} FROM ${this._from}${where};`;
    }

}

class Create {

    constructor (table) {
        this._table = table;
        this._add = [];
    }

    add (name, type, rule) {
        var text = `${name} ${type}`;
        if (rule) {
            text += ` ${rule}`;
        }
        this._add.push(text);
        return this;
    }

    toString () {
        return `CREATE TABLE ${this._table} (${this._add.join(', ')});`;
    }

}

class Insert {

    constructor (table) {
        this._table = table;
        this._add = [];
    }

    add (name, value) {
        this._add.push({
            name: name,
            value: value,
        });
        return this;
    }

    toString () {
        var names = this._add.map((item) => {
            return item.name;
        });
        var values = this._add.map((item) => {
            return item.value;
        });
        return `INSERT INTO ${this._table} (${names.join(', ')}) VALUES (${values.join(', ')});`;
    }

}

class Delete {

    constructor (table) {
        this._table = table;
        this._where = [];
    }

    where (rule) {
        this._where.push(rule);
        return this;
    }

    toString () {
        return `DELETE FROM ${this._table} WHERE ${this._where.join(' AND ')};`;
    }
}

class Update {

    constructor (table) {
        this._table = table;
        this._set = [];
        this._where = [];
    }

    set (name, value) {
        this._set.push(`${name}=${value}`);
        return this;
    }

    where (rule) {
        this._where.push(rule);
        return this;
    }

    toString () {
        return `UPDATE ${this._table} SET ${this._set.join(', ')} WHERE ${this._where.join(' AND ')};`;
    }

}

class Sugar {

    select (select) {
        return new Select(select);
    }

    create (table) {
        return new Create(table);
    }

    insert (table) {
        return new Insert(table);
    }

    delete (table) {
        return new Delete(table);
    }

    update (table) { 
        return new Update(table);
    }

}

module.exports = function (type) {
    if (type == '') {}
    return new Sugar();
};