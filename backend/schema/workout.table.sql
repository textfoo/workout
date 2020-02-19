create table if not exists exercise (
    id serial primary key, 
    created datetime,
    name varchar(128),
    type nvarchar(128),
    
);