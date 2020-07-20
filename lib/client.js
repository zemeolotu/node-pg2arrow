const { Table, Builder, Utf8, Int16, TimestampMicrosecond,
    Int32, Int64, Float32, Uint32, Float64, Bool } = require('apache-arrow');
const Client = require('pg-native');

const { builtins } = require('pg-types');

const columnTypes = new Map();

Object.keys(builtins).forEach(type => {
    columnTypes.set(builtins[type], type);
});

const builderMapping = new Map(Object.entries({
    FLOAT4: Float32,
    FLOAT8: Float64,
    INT8: Int64,
    INT4: Int32,
    INT2: Int16,
    TIMESTAMP: TimestampMicrosecond,
    VARCHAR: Utf8,
    OID: Uint32,
    BOOL: Bool,
}));

const nullValues = new Map([[Utf8, '']]);

class ArrowClient extends Client {
    readValue(rowIndex, colIndex, dataTypeId, nullValue) {
        const rawValue = this.pq.getvalue(rowIndex, colIndex);
        if (rawValue === '') {
            if (this.pq.getisnull(rowIndex, colIndex)) {
                return nullValue;
            }
        }
        return this._types.getTypeParser(dataTypeId)(rawValue);
    }

    _consumeQueryResults() {
        const tupleCount = this.pq.ntuples();
        const fieldCount = this.pq.nfields();

        const builders = {};
        for (let columnIndex = 0; columnIndex < fieldCount; columnIndex += 1) {
            const dataTypeId = this.pq.ftype(columnIndex);
            const columnType = columnTypes.get(dataTypeId);

            const Type = builderMapping.get(columnType) || Utf8;
            const builder = Builder.new({ type: new Type() });
            const nullValue = nullValues.has(Type) ? nullValues.get(Type) : null;

            builders[this.pq.fname(columnIndex)] = builder;

            for (let rowIndex = 0; rowIndex < tupleCount; rowIndex += 1) {
                const value = this.readValue(rowIndex, columnIndex, dataTypeId, nullValue);

                builder.append(value);
            }
            builder.finish();
        }
        const vectors = Object.values(builders).map(builder => builder.toVector());
        const table = Table.new(vectors, Object.keys(builders));
        return { rows: table };
    }
}

module.exports = { ArrowClient };
