create table if not exists symbols (
    symbol char(8) primary key,
    type  varchar(256),
    name varchar(256),
    region  varchar(128),
    unique(symbol)
);
create table if not exists historic (
    id serial primary key, 
    symbol char(4) references symbols (symbol), 
    date varchar(12), 
    open numeric, 
    high numeric,
    low numeric,
    close numeric,
    adj_close numeric,
    volume bigint 
);